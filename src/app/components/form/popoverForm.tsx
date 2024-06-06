import { useState, useEffect } from "react"
import { useDataStore } from "@/app/store/dataStore"
import React, { Dispatch, SetStateAction} from "react"
import { FormInputs } from "./inputs/formInputs"

interface PopoverForm {
  id: number | null;
  setId: Dispatch<SetStateAction<number | null>>;
  idError: boolean;
  setIdError: Dispatch<SetStateAction<boolean>>;
  setIsPopoverVisible: Dispatch<SetStateAction<boolean>>;
  isPopoverVisible: boolean; 
  handleGetNewIndex: () => void;
}

export function PopoverForm ({setId, id, setIdError, idError, setIsPopoverVisible, isPopoverVisible, handleGetNewIndex}: PopoverForm) {
  const excelData = useDataStore((state) => state.excelData)
  const setExcelData = useDataStore((state) => state.setExcelData)
  // constantes del FORM
  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<number | null>(null)
  const [jump, setJump] = useState<number | null>(null)
  const [strength, setStrength] = useState<number | null>(null)
  const [speed, setSpeed] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(70)
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

  // ADD NEW ROW
  const addRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (jump && strength && speed && time && score) {
      const newTotal = jump + strength + speed + score + time
      setTotal(newTotal)
      

      if (excelData) {
        const newRow = [id ,name, age, jump, strength, speed, score, time, total]
        const newExcelData = [...excelData, newRow]
        setExcelData(newExcelData)
        setTotal(null)
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
    setTime(null)
    setTotal(null)
    setIsAddButtonDisabled(true)
  }

  // Submit the form until all variables aren't null
  useEffect(() => {
    // Even when there is no valid ID the total value will be showed
    if (age !== null && jump !== null && strength !== null && speed !== null && time !== null && score !== null) {
      const newTotal = jump + strength + speed + score + time
      setTotal(newTotal)
    }

    if (id !== null && name !== '' && age && jump && strength && speed && time && score) {
      setIsAddButtonDisabled(false)
    } else {
      setIsAddButtonDisabled(true)
    }
  }, [id, name, age, jump, strength, speed, time, score])

  return (
    <>
      <div className={`fixed top-0 left-0 w-full h-full z-10 bg-gray-600/60 transition-opacity duration-200 ${isPopoverVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative m-auto top-[10%] w-[600px] px-6 py-4 bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md transform transition-transform duration-100 ${isPopoverVisible ? 'scale-100' : 'scale-95'}`}>
          <div className="flex flex-col gap-2">
            <form autoComplete='off' className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                  <h1 className='font-bold text-lg'>Nuevo Registro</h1>
                  <p className="text-gray-500">Ingresa los datos del nuevo registro abajo.</p>
              </div>
              <div className="flex flex-col gap-5">
                <FormInputs handleInput={handleInput} handleGetNewIndex={handleGetNewIndex} id={id} idError={idError} name={name} age={age} jump={jump} strength={strength} speed={speed} time={time} score={score} total={total} />                  
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
                      addRow(e)
                    }
                    } 
                  className={`bg-[#2563EB] text-white font-semibold px-4 py-2 rounded-md transition-all hover:opacity-90 ${isAddButtonDisabled ? 'bg-slate-400 cursor-not-allowed hover:opacity-100' : ''}`}>Añadir</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}