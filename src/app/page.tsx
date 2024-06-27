'use client'
import React, { useEffect } from 'react';
import { Login } from './components/login/login';
import { Providers } from './themes/themeProvider';
import connectDB from '@/utils/mongoose';

export default function Home() {

  useEffect(() => {
    connectDB()
  }, [])

  return (
    <>
      <Providers>
        <Login/>
      </Providers>
    </>
  );
}
