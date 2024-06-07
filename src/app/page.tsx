'use client'
import React from 'react';
import { Table } from './components/table/table';
import { HeaderButtons } from './components/header/headerButtons';


// interface Participant {
//   id: number,
//   name: string,
//   strength: number,
//   speed: number,
//   score: number,
//   time: string,
//   total: number
// }

export default function Home() {
  return (
    <>
      <HeaderButtons />
      <Table />
    </>
  );
}

