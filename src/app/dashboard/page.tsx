'use client'
import React, { useEffect } from 'react';
import { Table } from '../components/table/table';
import { HeaderButtons } from '../components/header/headerButtons';
import { useUserStore } from '../store/userStore';
import { Providers } from '../themes/themeProvider';

export default function Home() {
  const setUserProfile = useUserStore(state => state.setUserProfile)

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

  useEffect(() => {
    getProfile()
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