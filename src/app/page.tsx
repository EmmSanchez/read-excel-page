'use client'
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import { Dropzone } from './components/dropzone';
import { useFileStore } from './store/fileStore';
import { AddIcon, EditIcon, PrintIcon, RemoveIcon, TrashIcon } from '../../public/icons/icons';

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
  const [excelData, setExcelData] = useState<ExcelData>(null);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([])

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
  }, [file]);

  const handleGetRow = (rowIndex: number, action: string) => {
    if(!action) return

    
    if (action === 'select') {
      setSelectedRows(prev => {
        if (prev?.includes(rowIndex)) {
          return prev.filter(index => index !== rowIndex); // Deselect if already selected
        } else {
          return [...prev, rowIndex]; // Select if not already selected
        }
      });
    }

    if(action === 'delete') setRowToDelete(rowIndex)
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
    setRowToDelete(null);
  };
  // --------

  // DELETE MORE THAN 2 ROWS
  const deleteSelectedRows = () => {
    if(!selectedRows || !excelData) return
    const newData = excelData.filter((_, index) => !selectedRows.includes(index - 1)) as ExcelData
    setExcelData(newData)
    setSelectedRows([])
  }

  // ADD NEW ROW
  const handleNewRow = () => {

  }

  // TO DO LIST
  // - Popover for remove rows
  // - Add rows
  // - Edit rows
  // - Search for ID

  return (
    <>
      {excelData ? (
        <>
          <div className="flex flex-col justify-start w-full">
            <div className="flex mx-3 pr-2 w-[1200px] justify-end gap-3 text-sm">
              <button disabled={selectedRows.length > 0} onClick={handleNewRow} className={`px-4 py-[6px] rounded-md text-[#2563EB] font-semibold border-[1.4px] border-solid border-[#E2E8F0] transition-all ${selectedRows.length > 0 ? 'text-[#E2E8F0] cursor-not-allowed' : ''}`}>
                <div className="flex justify-center items-center gap-1">
                  <AddIcon fill={`${selectedRows.length > 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18}/> 
                  <p>Añadir</p>
                </div>
              </button>
              <button disabled={selectedRows.length === 0} onClick={() => deleteSelectedRows()} className={`px-4 py-[6px] rounded-md text-[#2563EB] font-semibold border-[1.4px] border-solid border-[#E2E8F0] transition-all ${selectedRows.length === 0 ? 'text-[#E2E8F0] cursor-not-allowed' : ''}`}>
                <div className="flex justify-center items-start gap-1">
                  <RemoveIcon fill={`${selectedRows.length === 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18}/>
                  <p>Eliminar</p>
                </div> 
              </button>
            </div>
            <div className='table table-auto m-3 bg-slate-50 w-[1200px] rounded-md border-solid border-[1px] border-black/20 overflow-hidden'>
              <div className='table-header-group bg-slate-200/90'>
                <div className='table-row'>
                  <div className='table-cell py-3'></div>
                  {excelData[0].map((cell, index) => (
                    <div key={index} className='table-cell py-3 px-3 text-sm text-left font-semibold'>{cell}</div>
                  ))}
                  <div className='table-cell w-[100px] py-3'></div>
                </div>
              </div>
              <div className='table-row-group'>
                {excelData.slice(1).map((row, rowIndex) => (
                  <div key={rowIndex} onClick={(e) => {e.stopPropagation(); handleGetRow(rowIndex, 'select')}} className='table-row hover:bg-gray-200'>
                    <div className="table-cell align-middle pl-1 py-[6px] text-center text-sm border-solid border-t-[1px] border-black/20">
                      <input type="checkbox" 
                        checked={selectedRows.includes(rowIndex)} 
                        onClick={(e) =>{ 
                            e.stopPropagation()
                            handleGetRow(rowIndex, 'select');
                          }} 
                        className="appearance-none w-4 h-4 align-middle border-solid border-[1.4px] border-zinc-500 rounded-sm cursor-pointer checked:bg-blue-600 checked:border-blue-600 checked:bg-[url('../../public/icons/checkIcon.svg')] checked:bg-center checked:bg-cover"/>
                    </div>
                    {row.map((cell, cellIndex) => (
                      <div key={cellIndex} className='table-cell align-middle px-4 py-[6px] text-sm border-solid border-t-[1px] border-black/20'>{cell}</div>
                    ))}
                    <div className='table-cell align-middle py-[6px] border-solid border-t-[1px] border-black/20'>
                      <div className="flex gap-[2px] pr-1">
                        <button className='w-full h-full'>
                          <PrintIcon className='bg-cyan-800 p-1 rounded-md active:bg-cyan-950 transition-all'/>
                        </button>
                        <button className='w-full h-full'>
                          <EditIcon className='bg-slate-800 p-1 rounded-md active:bg-slate-950 transition-all'/>
                        </button>
                        <button className='w-full h-full' onClick={(e) => {e.stopPropagation(); handleGetRow(rowIndex, 'delete')}}>
                          <TrashIcon width={24} height={24} fill='#e8eaed' className='bg-red-800 p-1 rounded-md active:bg-red-950 transition-all'/>
                        </button>
                        {rowToDelete === rowIndex && (
                          <div id='delete-popover' className='fixed w-[30%] right-5 bottom-10 bg-zinc-50 shadow-lg rounded-md p-4 text-xs'>
                            <div className="flex flex-col gap-2">
                              <p>¿Estás seguro de que deseas eliminar este elemento?</p>
                                <hr />
                              <div className="flex justify-end gap-4">
                                <button onClick={(e) => {e.stopPropagation(); cancelDelete()}} className="p-2 rounded-md hover:bg-gray-200">Cancelar</button>
                                <button onClick={(e) => {e.stopPropagation(); confirmDeleteRow()}} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-800">Eliminar</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Inserta el excel</p>
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

