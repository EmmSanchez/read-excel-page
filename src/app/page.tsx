'use client'
import React from 'react';
import { Dropzone } from './components/dropzone';
import { Table } from './components/table/table';


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
      <Dropzone />
      <Table />
    </>
  );
}

