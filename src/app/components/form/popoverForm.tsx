import { useState, useEffect } from "react"
import { useDataStore } from "@/app/store/dataStore"
import { ErrorIcon, AddIcon } from "../../../../public/icons/icons"
import React, { Dispatch, SetStateAction} from "react"

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

  // AVOID e, E, +, -
  const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

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

    if (id !== null && name !== null && age !== null && jump !== null && strength !== null && speed !== null && time !== null && score !== null) {
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
                  <div className="flex gap-6 align-middle">
                    {/* TIEMPO */}
                    <div className="flex flex-col-reverse w-[250px]">
                        <input value={time?.toString() || ''} min="0" type="number" name="time" id="time" onChange={(e) => handleInput(e, "time")} onKeyDown={preventInvalidChars} placeholder='Ingresa el tiempo' className='personalized-text-input'/>
                        <label htmlFor="time" className='pb-[2px] text-[10px] text-black font-medium label-default'>Tiempo</label>
                    </div>

                    <div className="flex justify-evenly w-[250px] gap-4">
                      <div className="w-[80px] flex flex-col justify-center items-center rounded-md border-solid border-[1px] border-gray-400">
                        <p className="pb-[2px] text-[10px] text-black font-medium">Puntuación</p>
                        <p>{score}</p>
                      </div>

                      <div className="w-[80px] flex flex-col justify-center items-center rounded-md border-solid border-[1px] border-[#2563EB]">
                        <p className="pb-[2px] text-[10px] text-black font-medium">Total</p>
                        <p>{total ? <>{total}</> : <>-</>}</p>
                      </div>
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