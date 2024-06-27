'use client'
import React, { useEffect } from 'react';
import { Login } from './components/login/login';
import { Providers } from './themes/themeProvider';
import connectDB from '@/utils/mongoose';

export default function Home() {

  useEffect(() => {
    const establishConnection = async () => {
      try {
        await connectDB();
        console.log('Conexión a MongoDB establecida');
      } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
      }
    };

    establishConnection();
  }, [])

  return (
    <>
      <Providers>
        <Login/>
      </Providers>
    </>
  );
}
