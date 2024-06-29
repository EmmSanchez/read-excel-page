'use client'
import { NavBar } from "../components/NavBar/navbar";
import { Providers } from "../themes/themeProvider";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { useDataStore } from "../store/dataStore";
import { useFileStore } from "../store/fileStore";
import { useTestOptionsStore } from "../store/testOptions";
import { useDataUsersStore } from "../store/dataUsers";



export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userProfile = useUserStore(state => state.userProfile)
  const setExcelData = useDataStore((state) => state.setExcelData)
  const setFile = useFileStore((state) => state.setFile)  
  const setOptions = useTestOptionsStore(state => state.setOptions)
  const setUsers = useDataUsersStore(state => state.setUsers)



  const getData = async () => {
    try {
      const response = await fetch('/api/excelData/getData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: "no-store"
      });

      if (response.ok) {
        const {participantsArray, fileInfoArray} = await response.json();
        console.log(participantsArray);
        
        // if there is no data or just the columns
        if (participantsArray.length === 1) {
          console.log('No hay datos de partipantes');
          
          // there is a file with no data
          if (!fileInfoArray) {
            return
          }
          
          setExcelData(participantsArray)
          const fileInfo = fileInfoArray[0]
          setFile(fileInfo)
          

        } else {
          setExcelData(participantsArray)
          const fileInfo = fileInfoArray[0]
          setFile(fileInfo)
        }
      } else {
        console.error('Error al obtener los datos de participantes')
        const {participantsArray} = await response.json();
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
        },
        cache: "no-store"
      })

      if (res.ok) {
        const {options} = await res.json()
        setOptions(options)                
      } else {
        console.error('Error al obtener las opciones de test')
      }
    } catch (error) {
      console.error('Error en la petición', error)
    }
  }

  const validateRol = async (rol: string | null) => {
    if (!rol) return

    if (rol === 'Administrador') {
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
          
        } else {
          console.error('Error al validar el rol')
        }
      } catch (error) {
        console.error('Error obtener datos', error)
      }
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {  
        await getData();
        await getOptions();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
    
    const storedUserRol = localStorage.getItem('userProfile')
    if (!storedUserRol) return
    const userRol = JSON.parse(storedUserRol)
    if (userRol !== 'Administrador') return
    validateRol(userRol)

  }, [])

  return (
    <>
      <Providers>
        <NavBar />
      </Providers>
      {children}
    </>
  );
}
