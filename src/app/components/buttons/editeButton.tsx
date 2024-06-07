import React, { useState, useEffect } from "react";
import { FormInputs } from "../form/inputs/formInputs";
import { useDataStore } from "@/app/store/dataStore";
import { useFilteredDataStore } from "@/app/store/filteredData";
import { EditIcon } from "../../../../public/icons/icons";

type ExcelData = (string | number | boolean | null)[][] | null;

interface FormData {
  id: number | null;
  name: string;
  age: number | null;
  jump: number | null;
  strength: number | null;
  speed: number | null;
  score: number | null;
  time: number | null;
  total: number | null;
}

interface EditButtonProps {
  handleGetRow: (rowIndex: number, action: string) => void
  rowIndex: number
}

export function EditButton ({handleGetRow, rowIndex}: EditButtonProps) {
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(true)

  const excelData = useDataStore((state) => state.excelData)
  const setExcelData = useDataStore((state) => state.setExcelData)
  const filteredExcelData = useFilteredDataStore((state) => state.filteredExcelData)

  // VARIABLE
  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<number | null>(null)
  const [jump, setJump] = useState<number | null>(null)
  const [strength, setStrength] = useState<number | null>(null)
  const [speed, setSpeed] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(70)
  const [time, setTime] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const [id, setId] = useState<number | null>(null)
  const [idError, setIdError] = useState<boolean>(false)

  // SAVE ORIGINAL VALUES
  const [formData, setFormData] = useState<FormData>({
    id: null,
    name: '',
    age: null,
    jump: null,
    strength: null,
    speed: null,
    score: 70,
    time: null,
    total: null,
  });

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
      const editedName = newName.replace(/[^a-zA-Z\s]/g, ''); // Allow only (a-z and A-Z) and spaces between words
      setName(editedName)
    }
    
    if (action === "age") {
      const newAge = parseFloat(e.target.value)
      setAge(newAge)
    }

    if (action === "jump") {
      const newJump = parseFloat(e.target.value)
      setJump(newJump)
    }

    if (action === "strength") {
      const newStrength = parseFloat(e.target.value)
      setStrength(newStrength)
    }

    if (action === "speed") {
      const newSpeed = parseFloat(e.target.value)
      setSpeed(newSpeed)
    }

    if (action === "time") {
      const newTime = parseFloat(e.target.value)
      setTime(newTime)
    }
  }

  const handleGetNewIndex = () => {
    setIdError(false)
    // LOGIC IF THERE IS NO LIST
    if (excelData) {
      const lastEntry = excelData[excelData.length - 1]
      if (typeof lastEntry[0] === "number") {
        const lastId = lastEntry[0]
        const newId = lastId + 1
        setId(newId)
      }
    }

    if (excelData && excelData?.length <= 1) {
      setId(1)
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
    setTime(null)
    setTotal(null)
  }

  useEffect(() => {
    // Even when there is no valid ID the total value will be showed
    if (age !== null && jump !== null && strength !== null && speed !== null && time !== null && score !== null) {
      const newTotal = jump + strength + speed + score + time
      setTotal(newTotal)
    }

    if (id !== null && name !== '' && age && jump && strength && speed && time && score) {
      setIsSaveButtonDisabled(false)
    } else {
      setIsSaveButtonDisabled(true)
    }
  }, [id, name, age, jump, strength, speed, time, score])

  const fixDecimals = (value: number) => {
    const num = Number(value);
    if (isNaN(num)) {
      return
    }
    return parseFloat(num.toFixed(2));
  }

  const getRowInfo = (rowIndex: number) => {
    resetInputs()
    setFormData({
      id: null,
      name: '',
      age: null,
      jump: null,
      strength: null,
      speed: null,
      score: 70,
      time: null,
      total: null,
    });

    if (filteredExcelData && excelData) {
      const rowId = filteredExcelData[rowIndex + 1][0];
      const rowToEdit = excelData.filter((row, rowIndex) => rowIndex > 0 && row[0] === rowId) as ExcelData
      
      if (rowToEdit) {
        
        // Save original values in FormData
        // setFormData({
        //   id: id as number,
        //   name: name as string,
        //   age: age as number,
        //   jump: fixDecimals(jump as number),
        //   strength: fixDecimals(strength as number),
        //   speed: fixDecimals(speed as number),
        //   score: fixDecimals(score as number),
        //   time: fixDecimals(time as number),
        //   total: fixDecimals(total as number),
        // });

        // setId(id as number);
        // setName(name as string);
        // setAge(age as number);
        // setJump(fixDecimals(jump as number));
        // setStrength(fixDecimals(strength as number));
        // setSpeed(fixDecimals(speed as number));
        // setTime(fixDecimals(time as number));
        // setScore(fixDecimals(score as number));
        // setTotal(fixDecimals(total as number));
      }
    }
  }
  
  const handleEditeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsPopoverVisible(!isPopoverVisible)
    handleGetRow(rowIndex, 'edit')
    getRowInfo(rowIndex)
  }

  // const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
  //   e.preventDefault();
  
  //   // Actualizar los nuevos valores en excelData
  //   if (excelData) {
  //     const editedRow: (string | number | boolean | null)[] = [
  //       id,
  //       name,
  //       age,
  //       jump,
  //       strength,
  //       speed,
  //       score,
  //       time,
  //       total !== null ? fixDecimals(total) : null
  //     ];

  //     if (filteredExcelData) {
  //       const rowId = filteredExcelData[rowIndex + 1][0];
        
  //       const updatedExcelData = excelData.map((row) => {
  //         if (rowId === row[0] ) {
  //           return editedRow;
  //         } else {
  //           return row;
  //         }
  //       });

  //       // Sort to avoid problems when the ID's user is changed and is not sorted
  //       const sortedExcelData = updatedExcelData.slice(1).sort((a, b) => {
  //         return (a[0] as number) - (b[0] as number);
  //       });
  
  //       // Agregar la fila de encabezado nuevamente
  //       sortedExcelData.unshift(updatedExcelData[0]);

  //       setExcelData(sortedExcelData);
  //     }
  //   }
  //   setIsPopoverVisible(false);
  // };

  const handleCancelChanges = () => {
    setIsPopoverVisible(false);
    resetInputs()
    setFormData({
      id: null,
      name: '',
      age: null,
      jump: null,
      strength: null,
      speed: null,
      score: 70,
      time: null,
      total: null,
    });
  }

  return (
    <>
      <button onClick={(e) => handleEditeClick(e)} className='w-[24px] h-full'>
        <EditIcon fill="#00890" className='p-1 rounded-md transition-all hover:bg-zinc-50'/>
      </button>
      {/* POPOVER FORM */}
      <div onClick={(e) => e.stopPropagation()} className={`fixed top-0 left-0 w-full h-full z-10 bg-gray-600/60 transition-opacity duration-200 ${isPopoverVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative m-auto top-[10%] w-[600px] px-6 py-4 bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md transform transition-transform duration-100 ${isPopoverVisible ? 'scale-100' : 'scale-95'}`}>
          <div className="flex flex-col gap-2">
            <form autoComplete='off' className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                  <h1 className='font-bold text-lg'>Editar Registro</h1>
                  <p className="text-gray-500">Ingresa los datos nuevos abajo.</p>
              </div>
              <div className="flex flex-col gap-5">
                <FormInputs handleInput={handleInput} handleGetNewIndex={handleGetNewIndex} formData={formData} id={id} idError={idError} name={name} age={age} jump={jump} strength={strength} speed={speed} time={time} score={score} total={total} />   
              </div>
              <div className="flex justify-end mt-3 gap-4">
                <button type='button' 
                    onClick={handleCancelChanges} className='flex h-9 justify-center items-center px-4 py-2 rounded-md border-[1.4px] border-solid border-[#E2E8F0] transition-all hover:bg-gray-100'
                >
                  Cancelar
                </button>

                <button
                  disabled={isSaveButtonDisabled}  
                  type='button'
                  // onClick={(e) => handleSaveChanges(e, rowIndex) } 
                  className={`flex h-9 justify-center items-center bg-[#2563EB] text-white font-semibold px-4 py-2 rounded-md transition-all hover:opacity-90 ${isSaveButtonDisabled ? 'bg-slate-400 cursor-not-allowed hover:opacity-100' : ''}`}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}