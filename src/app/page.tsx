'use client'
import React from 'react';
import { Login } from './components/login/login';
import { Providers } from './themes/themeProvider';

export default function Home() {
  return (
    <>
      <Providers>
        <Login/>
      </Providers>
    </>
  );
}
