'use client'
import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import { Dropzone } from './components/dropzone';
import { useFileStore } from './store/fileStore';
import { AddIcon, ErrorIcon} from '../../public/icons/icons';
import { Row } from './components/table/row';
import { RemoveRowsButton } from './components/buttons/removeRowsButton';

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
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false)

  // constantes del FORM
  const [id, setId] = useState<number | null>(null)
  const [idError, setIdError] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<number | null>(null)
  const [jump, setJump] = useState<number | null>(null)
  const [strength, setStrength] = useState<number | null>(null)
  const [speed, setSpeed] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [time, setTime] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState<boolean>(true)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, action: string) => {
    if (action === "id") {
      const newId = parseInt(e.target.value)
      
      if (excelData?.some((row, index) => index > 0 && row[0] === newId || newId === 0)) {
        setId(null)
        setIdError(true)
      } else {
        setId(newId)
        setIdError(false)
      }
    }

    if (action === "name") {
      const newName = (e.target.value).trimStart()
      setName(newName)
    }

    if (action === "age") {
      const newAge = parseInt(e.target.value)
      setAge(newAge)
    }

    if (action === "jump") {
      const newJump = parseInt(e.target.value)
      setJump(newJump)
    }

    if (action === "strength") {
      const newStrength = parseInt(e.target.value)
      setStrength(newStrength)
    }

    if (action === "speed") {
      const newSpeed = parseInt(e.target.value)
      setSpeed(newSpeed)
    }

    if (action === "time") {
      const newTime = parseInt(e.target.value)
      setTime(newTime)
    }
  }
  
  useEffect(() => {
    if (id && name && age && jump && strength && speed && time) {
      setIsAddButtonDisabled(false)
    } else {
      setIsAddButtonDisabled(true)
    }
  }, [id, name, age, jump, strength, speed, time])


  
  const handleGetNewIndex = () => {
    setIdError(false)
    if (excelData) {
      const lastEntry = excelData[excelData.length - 1]
      if (typeof lastEntry[0] === "number") {
        const lastId = lastEntry[0]
        const newId = lastId + 1
        setId(newId)
      }
    }
  }

  const resetInputs = () => {
    setId(null)
    setIdError(false)
    setName('')
    setAge(null)
    setJump(null)
    setStrength(null)
    setSpeed(null)
    setScore(null)
    setTime(null)
    setTotal(null)
    setIsAddButtonDisabled(true)
  }
  
  const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

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
  }, [file]);

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

  // ADD NEW ROW
  const addRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }

  // TO DO LIST
  // - Add rows
  // - Edit rows
  // - Search for ID

  return (
    <>
      {excelData ? (
        <>
          <div className="flex flex-col justify-start w-full">
            <div className="flex mx-3 pr-2 w-[1200px] justify-end gap-3 text-sm">

              <button disabled={selectedRows.length > 0} onClick={() => {setIsPopoverVisible(!isPopoverVisible); handleGetNewIndex()}} className={`px-4 py-[6px] rounded-md text-[#2563EB] font-semibold border-[1.4px] border-solid border-[#E2E8F0] transition-all ${selectedRows.length > 0 ? 'text-[#E2E8F0] cursor-not-allowed' : 'hover:bg-gray-100 '}`}>
                <div className="flex justify-center items-center gap-1">
                  <AddIcon fill={`${selectedRows.length > 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18}/> 
                  <p>Añadir</p>
                </div>
              </button>

              {/* POPOVER DEL FORMULARIO PARA AÑADIR */}
              <div className={`fixed top-0 left-0 w-full h-full z-10 bg-gray-600/60 transition-opacity duration-200 ${isPopoverVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`relative m-auto top-[10%] w-[600px] px-6 py-4 bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md transform transition-transform duration-100 ${isPopoverVisible ? 'scale-100' : 'scale-95'}`}>
                  <div className="flex flex-col gap-2">
                    <form autoComplete='off' className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                          <h1 className='font-bold text-lg'>Nuevo Registro</h1>
                          <p className="text-gray-500">Ingresa los datos del nuevo registro abajo.</p>
                      </div>
                      <div className="flex flex-col gap-5">
                          {/* FILA 1*/}
                          <div className="flex gap-6">
                            {/* ID */}
                            <div className="flex flex-col-reverse w-[250px]">
                                {
                                  idError && 
                                  <>
                                    <div className="relative">
                                      <p className='absolute flex items-center gap-1 w-[250px] text-red-500 text-[10px] font-medium mt-[1px]'>
                                        <ErrorIcon fill="#EF4444" width={14} height={14}/><span>ID actualmente en uso</span>
                                      </p>
                                    </div>
                                  </>
                                }
                                <input value={id?.toString()} onChange={(e) => handleInput(e, "id")} min="1" type="number" name="id" id="id" placeholder='Ingresa el ID' className='personalized-text-input'/>
                                <div onClick={handleGetNewIndex} className="relative">
                                  <div className="absolute top-[4.5px] right-2 rounded-[4px] p-[2px] hover:bg-slate-200 hover:cursor-pointer">
                                    <AddIcon fill='#2563EB' width={24} height={24}/>
                                  </div>
                                </div>
                                <label htmlFor="id" className='pb-[2px] text-[10px] text-black font-medium label-default'>ID</label>
                            </div>

                            {/* NOMBRE */}
                            <div className="flex flex-col-reverse w-[250px]">
                                <input value={name} type="text" name="name" id="name" onChange={(e) => handleInput(e, "name")} placeholder='Ingresa el nombre' className='personalized-text-input'/>
                                <label htmlFor="name" className='pb-[2px] text-[10px] text-black font-medium label-default'>Nombre</label>
                            </div>
                          </div>

                          {/* FILA 2*/}
                          <div className="flex gap-6">
                            {/* EDAD */}
                            <div className="flex flex-col-reverse w-[250px]">
                                <input value={age?.toString() || ''} min="0" type="number" name="age" id="age" onChange={(e) => handleInput(e, "age")} onKeyDown={preventInvalidChars} placeholder='Ingresa la edad' className='personalized-text-input'/>
                                <label htmlFor="age" className='pb-[2px] text-[10px] text-black font-medium label-default'>Edad</label>
                            </div>

                            {/* SALTO */}
                            <div className="flex flex-col-reverse w-[250px]">
                                <input value={jump?.toString() || ''} min="0" type="number" name="jump" id="jump" onChange={(e) => handleInput(e, "jump")} onKeyDown={preventInvalidChars} placeholder='Ingresa el salto' className='personalized-text-input'/>
                                <label htmlFor="jump" className='pb-[2px] text-[10px] text-black font-medium label-default'>Salto</label>
                            </div>
                          </div>

                          {/* FILA 3*/}
                          <div className="flex gap-6">
                            {/* FUERZA */}
                            <div className="flex flex-col-reverse w-[250px]">
                                <input value={strength?.toString() || ''} min="0" type="number" name="strength" id="strength" onChange={(e) => handleInput(e, "strength")} onKeyDown={preventInvalidChars} placeholder='Ingresa la fuerza' className='personalized-text-input'/>
                                <label htmlFor="strength" className='pb-[2px] text-[10px] text-black font-medium label-default'>Fuerza</label>
                            </div>

                            {/* VELOCIDAD */}
                            <div className="flex flex-col-reverse w-[250px]">
                                <input value={speed?.toString() || ''} min="0" type="number" name="speed" id="speed" onChange={(e) => handleInput(e, "speed")} onKeyDown={preventInvalidChars} placeholder='Ingresa la velocidad' className='personalized-text-input'/>
                                <label htmlFor="speed" className='pb-[2px] text-[10px] text-black font-medium label-default'>Velocidad</label>
                            </div>
                          </div>

                          {/* FILA 4*/}
                          <div className="flex gap-4">
                            {/* TIEMPO */}
                            <div className="flex flex-col-reverse w-[250px]">
                                <input value={time?.toString() || ''} min="0" type="number" name="time" id="time" onChange={(e) => handleInput(e, "time")} onKeyDown={preventInvalidChars} placeholder='Ingresa el tiempo' className='personalized-text-input'/>
                                <label htmlFor="time" className='pb-[2px] text-[10px] text-black font-medium label-default'>Tiempo</label>
                            </div>
                          </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type='button' 
                          onClick={() => {
                            setIsPopoverVisible(false);
                            resetInputs()
                          }} className='px-4 py-2 rounded-md border-[1.4px] border-solid border-[#E2E8F0] transition-all hover:bg-gray-100'>Cancelar</button>
                        <button
                          disabled={isAddButtonDisabled}  
                          type='button'
                          onClick={(e) => {
                            e.preventDefault()
                            setIsPopoverVisible(false)  
                            resetInputs()
                            }
                            } 
                          className={`bg-[#2563EB] text-white font-semibold px-4 py-2 rounded-md transition-all hover:opacity-90 ${isAddButtonDisabled ? 'bg-slate-400 cursor-not-allowed hover:opacity-100' : ''}`}>Añadir</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>


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

