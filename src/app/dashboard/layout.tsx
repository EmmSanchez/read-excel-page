'use client'
import { NavBar } from "../components/NavBar/navbar";
import { Providers } from "../themes/themeProvider";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { useDataStore } from "../store/dataStore";
import { useFileStore } from "../store/fileStore";
import { useTestOptionsStore } from "../store/testOptions";
import { useDataUsersStore } from "../store/dataUsers";
import { useNavLinksStore } from "../store/navLinks";
import connectDB from "../lib/mongodb";



export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setUserProfile = useUserStore(state => state.setUserProfile)
  const userProfile = useUserStore(state => state.userProfile)
  const setExcelData = useDataStore((state) => state.setExcelData)
  const setFile = useFileStore((state) => state.setFile)  
  const setOptions = useTestOptionsStore(state => state.setOptions)
  const setUsers = useDataUsersStore(state => state.setUsers)
  const setLinks = useNavLinksStore(state => state.setLinks)



  // SETEAR LINKS EN ESTA FUNCIÓN DEPENDIENDO TIPO DE USER
  const getProfile = async () => {
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { user, links } = await response.json()
    setUserProfile(user)
    setLinks(links)
  }

  const getData = async () => {
    try {
      const response = await fetch('/api/excelData/getData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const {participantsArray, fileInfoArray} = await response.json();
        
        
        // if there is no data or just the columns
        // if (participantsArray.length <= 1) {
        //   console.log('No hay datos disponibles en la base de datos');

        // } else {
        //   console.log(participantsArray);
          
          setExcelData(participantsArray)
          const fileInfo = fileInfoArray[0]
          setFile(fileInfo)
        // }
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  const getOptions = async () => {
    try {
      const res = await fetch('/api/excelData/testOptions/getOptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        const {options} = await res.json()
        setOptions(options)                
      }
    } catch (error) {
      console.error('Error en la petición', error)
    }
  }

  const validateRol = async (rol: string | null) => {
    if (!rol) return

    if (rol === 'admin') {
      try {
        const res = await fetch('/api/auth/getUsers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(rol)
        })

        if (res.ok) {
          const { users } = await res.json()
          setUsers(users)
          
        }
      } catch (error) {
        console.error('Error obtener datos', error)
      }
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await connectDB()
        await getProfile();
        await getData();
        await getOptions();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [])

  useEffect(() => {
    if (userProfile === 'admin') {
      validateRol(userProfile)
    }
  }, [userProfile])
  
  return (
    <>
      <Providers>
        <NavBar />
      </Providers>
      {children}
    </>
  );
}
