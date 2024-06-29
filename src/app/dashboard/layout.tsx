'use client'
import { NavBar } from "../components/NavBar/navbar";
import { Providers } from "../themes/themeProvider";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { useDataStore } from "../store/dataStore";
import { useFileStore } from "../store/fileStore";
import { useTestOptionsStore } from "../store/testOptions";
import { useDataUsersStore } from "../store/dataUsers";
import { sortArrayByColumn } from "../components/table/table";

interface Participant {
  '#': number;
  'Apellido paterno': string;
  'Apellido materno': string;
  'Nombre': string;
  'Prueba': string;
  '# Empleado': number;
  'Edad': number;
  'Genero': string;
  'Categoria': string;
  'Altura [cm]': number;
  'Peso [kg]': number;
  'Grasa [%]': number;
  'IMC': number;
  'Cintura [cm]': number;
  'BMI': number;
  'BMR': number;
  'Fatmass': number;
  'FFM': number;
  'TBW': number;
  'Agarre': number;
  'Puntos': number;
  'Salto': number;
  'Puntos_1': number;
  'Agilidad': number;
  'Puntos_2': number;
  'Resistencia': number;
  'Puntos_3': number;
  'Total': number;
}

type ExcelData = (string | number | boolean | null)[][] | null;



function convertParticipantsToArray(participants: Participant[]): (string | number)[][] {
  const keys: (keyof Participant)[] = [
    '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria',
    'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre',
    'Puntos', 'Salto', 'Puntos_1', 'Agilidad', 'Puntos_2', 'Resistencia', 'Puntos_3', 'Total'
  ];

  const headers: (keyof Participant)[] = [
    '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria',
    'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre',
    'Puntos', 'Salto', 'Puntos', 'Agilidad', 'Puntos', 'Resistencia', 'Puntos', 'Total'
  ];

  const sortedParticipants: (string | number)[][] = [headers];

  participants.map(participant => {
    const values = keys.map(key => participant[key]);
    sortedParticipants.push(values);
  });

  return sortedParticipants;
}


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        }
      });

      if (response.ok) {
        const { participants , fileInfoArray} = await response.json();
        console.log(participants);
        
        const participantsArray = convertParticipantsToArray(participants)
        console.log(participantsArray);

        const sortedParticipants = sortArrayByColumn(participantsArray, '#') as ExcelData
        console.log(sortedParticipants);
        
        
        // if there is no data or just the columns
        if (participantsArray.length === 1) {
          console.log('No hay datos de partipantes');
          
          // there is a file with no data
          if (!fileInfoArray) {
            return
          }
  
          setExcelData(sortedParticipants)
          const fileInfo = fileInfoArray[0]
          setFile(fileInfo)
          
        } else {
          setExcelData(sortedParticipants)
          const fileInfo = fileInfoArray[0]
          setFile(fileInfo)
        }
      } else {
        console.error('Error al obtener los datos de participantes')
        const {participants} = await response.json();
        console.log(participants);
        
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
