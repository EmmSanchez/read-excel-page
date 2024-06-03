'use client'
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import { Dropzone } from './components/dropzone';
import { useFileStore } from './store/fileStore';
import { useDataStore } from './store/dataStore';
import { Row } from './components/table/row';
import { RemoveRowsButton } from './components/buttons/removeRowsButton';
import { AddRowButton } from './components/buttons/addRowButton';

// interface Participant {
//   id: number,
//   name: string,
//   strength: number,
//   speed: number,
//   score: number,
//   time: string,
//   total: number
// }

type ExcelData = (string | number | boolean | null)[][] | null;

export function Table() {
  const file = useFileStore((state) => state.file);
  const excelData = useDataStore((state) => state.excelData)
  const setExcelData = useDataStore((state) => state.setExcelData)
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([])  

  // -----------------------------------------------------------------------------------------------

  // CONVERT EXCEL TO JSON
  useEffect(() => {
    if (!file) {
      setExcelData(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as ExcelData;
        setExcelData(jsonData);
      }
    };
    reader.readAsArrayBuffer(file);
    setSelectedRows([])
    setRowToDelete(null)
  }, [file, setExcelData])

  // GET ROW INDEX WITH ACTION
  const handleGetRow = (rowIndex: number, action: string) => {
    if(!action) return

    // IF ROWTODELETE HAS A NUMBER AND YOU CLICK OTHER ROW, THE ROWTODELETE WILLNOT BE SELECTED
    if (rowToDelete) {
      setSelectedRows([])
    }

    // SELECT 1 OR MORE ROWS
    if (action === 'select') {
      setRowToDelete(null)
      setSelectedRows(prev => {
        if (prev?.includes(rowIndex)) {
          return prev.filter(index => index !== rowIndex); // Deselect if already selected
        } else {
          return [...prev, rowIndex]; // Select if not already selected
        }
      });
    }

    // DELETE A WITH ROW TRASH BUTTON
    if(action === 'delete') {
      setSelectedRows([rowIndex])
      setRowToDelete(rowIndex)
    }
  };

  // DELETE ROW
  const confirmDeleteRow = () => {
    if (rowToDelete !== null) {
      const newExcelData = excelData?.filter((_, index) => index !== rowToDelete + 1) as ExcelData;
      setExcelData(newExcelData);
      setRowToDelete(null);
      setSelectedRows([])
    }
  };

  const cancelDelete = () => {
    setSelectedRows([])
    setRowToDelete(null);
  };
  // --------

  // DELETE MORE THAN 2 ROWS
  const deleteSelectedRows = () => {
    if(!selectedRows || !excelData) return
    const newData = excelData.filter((_, index) => !selectedRows.includes(index - 1)) as ExcelData
    setExcelData(newData)
    setSelectedRows([])
    setRowToDelete(null)
  }

  // TO DO LIST
  // - Edit rows
  // - Search for ID
  

  return (
    <>
      {excelData ? (
        <>
          <div className="flex flex-col justify-start w-full">
            <div className="flex mx-3 pr-2 w-[1200px] justify-end gap-3 text-sm">
              <AddRowButton selectedRows={selectedRows}/>
              <RemoveRowsButton selectedRows={selectedRows} deleteSelectedRows={deleteSelectedRows}/>
            </div>
            

            {/* TABLE */}
            <div className='table table-auto m-3 bg-slate-50 w-[1200px] rounded-md border-solid border-[1px] border-black/20 overflow-hidden'>
              <div className='table-header-group bg-slate-200/90'>
                <div className='table-row'>
                  <div className='table-cell py-3'></div>
                  {excelData[0].map((cell, index) => (
                    <div key={index} className='table-cell py-3 px-3 text-sm text-left font-semibold'>{cell}</div>
                  ))}
                  <div className='table-cell w-[60px] py-3'></div>
                </div>
              </div>
              <div className='table-row-group'>
                {excelData.slice(1).map((row, rowIndex) => (
                  <Row key={rowIndex} rowIndex={rowIndex} handleGetRow={handleGetRow} selectedRows={selectedRows} row={row} rowToDelete={rowToDelete} cancelDelete={cancelDelete} confirmDeleteRow={confirmDeleteRow}/>
                ))}
              </div>
            </div>

          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col m-4">
            <h1>Pasos a Seguir</h1>
            <p>Haz click en el botón superior e inserta un archivo de excel</p>
          </div>
        </>
      )}
    </>
  );
}

export default function Home() {
  return (
    <>
      <Dropzone />
      <Table />
    </>
  );
}

