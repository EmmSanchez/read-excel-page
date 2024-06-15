'use client'
import React from 'react';
import { Table } from '../components/table/table';
import { HeaderButtons } from '../components/header/headerButtons';

export default function Home() {
  return (
    <>
      <HeaderButtons />
      <Table />
    </>
  );
}