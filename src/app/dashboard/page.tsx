'use client'
import React, { useEffect } from 'react';
import { Table } from '../components/table/table';
import { HeaderButtons } from '../components/header/headerButtons';
import { useUserStore } from '../store/userStore';

export default function Home() {
  const setUserProfile = useUserStore(state => state.setUserProfile)
  const userProfile = useUserStore(state => state.userProfile)

  const getProfile = async () => {
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const profileData = await response.json()

    console.log(profileData);
    
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <>
      <HeaderButtons />
      <Table />
    </>
  );
}