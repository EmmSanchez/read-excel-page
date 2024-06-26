'use client'
import React from 'react';
import { Table } from '@/app/components/table/table';
import { HeaderButtons } from '@/app/components/header/headerButtons';

export default function Home() {
  return (
    <>      
      <div className="w-full bg-white dark:bg-zinc-900">
        <HeaderButtons />
        <Table />
      </div>
    </>
  );
}