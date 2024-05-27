'use client'
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react'
import { Dropzone } from './components/dropzone'
import { useFileStore } from './store/fileStore'

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

  

  return (
    <>
      {
        excelData ? 
        <>
          <div className="flex justify-start w-full">
            <div className='table table-auto m-4 bg-slate-50 w-[1200px] rounded-md border-solid border-[1px] border-black/20 overflow-hidden'>
              <div className='table-header-group bg-slate-100/80'>
                <div className='table-row'>
                  <div className='table-cell py-3'></div>
                  {excelData[0].map((cell, index) => (
                    <div key={index} className='table-cell py-3 px-3 text-sm text-left font-semibold'>{cell}</div>
                  ))}
                  <div className='table-cell py-3'></div>
                </div>
              </div>
              <div className='table-row-group'>
                {excelData.slice(1).map((row, rowIndex) => (
                  <div key={rowIndex} className='table-row hover:bg-gray-200'>
                    <div className="table-cell text-center pl-2 py-[6px] text-sm border-solid border-t-[1px] border-black/20"><input type="checkbox" className='appearance-none align-middle  w-4 h-4 rounded-full border-solid border-[1px] border-black/40 checked:bg-blue-700'/></div>
                    {row.map((cell, cellIndex) => (
                      <>
                        <div key={cellIndex} className='table-cell px-4 py-[6px] text-sm border-solid border-t-[1px] border-black/20'>{cell}</div>
                      </>
                    ))}
                    <div className='table-cell text-blue-700 text-sm font-medium border-solid border-t-[1px] border-black/20'><button className='w-full'>Editar</button></div>
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
