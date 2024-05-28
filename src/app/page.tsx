'use client'
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react'
import { Dropzone } from './components/dropzone'
import { useFileStore } from './store/fileStore'
import { EditIcon, PrintIcon, TrashIcon } from '../../public/icons/icons';

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
  const file = useFileStore((state) => state.file)
  const [excelData, setExcelData] = useState<ExcelData>(null)

  useEffect(() => {
    if (!file) {
      setExcelData(null)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (result instanceof ArrayBuffer) {
        const data = new Uint8Array(result)
        const workbook = XLSX.read(data, { type: 'array' })      
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as ExcelData
        setExcelData(jsonData)        
      }
    }
    reader.readAsArrayBuffer(file)
  }, [file])

  const handleDeleteRow = (rowIndex: number) => {
    const id = rowIndex + 1    
    const newExcelData = excelData?.filter((e, index) => index !== id) as ExcelData
    setExcelData(newExcelData)
  }
  

  return (
    <>
      {
        excelData ? 
        <>
          <div className="flex justify-start w-full">
            <div className='table table-auto m-4 bg-slate-50 w-[1200px] rounded-md border-solid border-[1px] border-black/20 overflow-hidden'>
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
                  <div key={rowIndex} className='table-row hover:bg-gray-200'>
                    <div className="table-cell align-middle pl-1 py-[6px] text-center text-sm border-solid border-t-[1px] border-black/20">
                      <input type="checkbox" className="appearance-none w-4 h-4 align-middle border-solid border-[1.4px] border-zinc-500 rounded-sm cursor-pointer checked:bg-blue-600 checked:border-blue-600 checked:bg-[url('../../public/icons/checkIcon.svg')] checked:bg-center checked:bg-cover"/>
                    </div>
                    {row.map((cell, cellIndex) => (
                      <>
                        <div key={cellIndex} className='table-cell align-middle px-4 py-[6px] text-sm border-solid border-t-[1px] border-black/20'>{cell}</div>
                      </>
                    ))}
                    <div className='table-cell align-middle py-[6px] border-solid border-t-[1px] border-black/20'>
                      <div className="flex gap-[2px] pr-1">
                        <button className='w-full h-full'>
                          <PrintIcon className='bg-cyan-800 p-1 rounded-md active:bg-cyan-950 transition-all'/>
                        </button>
                        <button className='w-full h-full'>
                          <EditIcon className='bg-slate-800 p-1 rounded-md active:bg-slate-950 transition-all'/>
                        </button>
                        <button popoverTarget='delete-popover' className='w-full h-full' onClick={(e) => handleDeleteRow(rowIndex)}>
                          <TrashIcon width={24} height={24} fill='#e8eaed' className='bg-red-800 p-1 rounded-md active:bg-red-950 transition-all'/>
                          <div id='delete-popover' popover='auto'>
                            <p>¿Estás seguro de que deseas eliminar este elemento?</p>
                            <p>Eliminar usuario</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
        : 
        <p>Inserta el excel</p>

      }
    </>
  )
}


export default function Home() {
  return (
    <>
      <Dropzone />
      <Table />
    </>
  )
}
