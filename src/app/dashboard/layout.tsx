'use client'
import { NavBar } from "../components/NavBar/navbar";
import { useEffect, useState } from "react";
import { useFileStore } from "../store/fileStore";
import { useTestOptionsStore } from "../store/testOptions";
import { useDataUsersStore } from "../store/dataUsers";
import { useAgesStore } from "../store/agesStore";
import { useParticipantsDataStore } from "@/app/store/participants";
import { useUserStore } from "../store/userStore";
import { useIsGetDataFetchFinished } from "../store/getDataFinished";



export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setFile = useFileStore((state) => state.setFile)  
  const setOptions = useTestOptionsStore(state => state.setOptions)
  const setUsers = useDataUsersStore(state => state.setUsers)

  // RANGOS DE EDADES
  const ageRanges = useAgesStore(state => state.ageRanges)
  const setAgeRanges = useAgesStore(state => state.setAgeRanges)

  // FIXING
  const setParticipants = useParticipantsDataStore(state => state.setParticipants)

  const setUserProfile = useUserStore(state => state.setUserProfile)

  // Manual loading
  const setIsGetDataFetchFinished = useIsGetDataFetchFinished(state => state.setIsGetDataFetchFinished)



  const getData = async () => {
    try {
      const response = await fetch('/api/excelData/getData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        
        if (!data || !data.sortedParticipants || !data.fileInfoArray) {
          console.error('La respuesta no contiene los datos esperados:', data);
          return;
        }
  
        const { sortedParticipants, fileInfoArray } = data;
  
        if (sortedParticipants.length === 0) {
          // there is a file with no data
          if (!fileInfoArray) {
            return;
          }
          
          setParticipants(sortedParticipants);
          const fileInfo = fileInfoArray[0];
          setFile(fileInfo);
          setIsGetDataFetchFinished(true)
        } else {
          setParticipants(sortedParticipants);
          const fileInfo = fileInfoArray[0];
          setFile(fileInfo);
          setIsGetDataFetchFinished(true)
        }
      } else {
        console.error('Error al obtener los datos de participantes, código de estado:', response.status);
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

  const getRanges = async () => {
    try {
      const res = await fetch('/api/excelData/ages/getRanges', {
        method: 'GET',
        headers: {
          'Content-Type': 'applicaction/json'
        },
      })

      if (res.ok) {
        const { ranges } = await res.json()
        if (ranges) {
          setAgeRanges(ranges)
        } else {
          setAgeRanges([])
        }
      }
    } catch (error) {
      console.error('Error al obtener rangos de edades', error)
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getData();
        await getOptions();
        await getRanges();

        const storedUserRol = localStorage.getItem('userProfile');
        if (!storedUserRol) return;
        const userRol = JSON.parse(storedUserRol);
        setUserProfile(userRol);

        if (userRol !== 'Administrador') return;
        await validateRol(userRol);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
