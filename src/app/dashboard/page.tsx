'use client'
import React, { useEffect } from 'react';
import { Table } from '../components/table/table';
import { HeaderButtons } from '../components/header/headerButtons';
import { useUserStore } from '../store/userStore';
import { Providers } from '../themes/themeProvider';
import { useDataStore } from '../store/dataStore';
import { useFilteredDataStore } from '../store/filteredData';
import { useFileStore } from '../store/fileStore';
import { error } from 'console';
import { useTestOptionsStore } from '../store/testOptions';

export default function Home() {
  const setUserProfile = useUserStore(state => state.setUserProfile)
  const setExcelData = useDataStore((state) => state.setExcelData)
  const setFile = useFileStore((state) => state.setFile)  
  const setOptions = useTestOptionsStore(state => state.setOptions)

  const getProfile = async () => {
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { user } = await response.json()
    setUserProfile(user)
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

  useEffect(() => {
    getProfile()
    getData()
    getOptions()
  }, [])

  return (
    <>
      <Providers>
        <div className="w-full h-screen bg-white dark:bg-zinc-950">
          <HeaderButtons />
          <Table />
        </div>
      </Providers>
    </>
  );
}