import React, { useState, useEffect } from "react";
import { FormInputs } from "../form/inputs/formInputs";
import { useDataStore } from "@/app/store/dataStore";
import { useFilteredDataStore } from "@/app/store/filteredData";
import { EditIcon } from "../../../../public/icons/icons";
import { log } from "console";

type ExcelData = (string | number | boolean | null)[][] | null;

interface FormData {
  id: number | null;
  p_surname: string;
  m_surname: string;
  name: string;
  test: string;
  employeeNumber: string;
  age: number | null;
  genre: string;
  category: string;
  height: number | null;
  weight: number | null;
  imc: number | null;
  waist: number | null;
  bmi: number | null;
  bmr: number | null;
  grease: number | null;
  fat_mass: number | null;
  ffm: number | null;
  tbw: number | null;
  grip: number | null;
  points: number | null;
  jump: number | null;
  jump_points: number | null;
  agility: number | null;
  agility_points: number | null;
  resistance: number | null;
  resistance_points: number | null;
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

  // SECTIONS FORM
  const [activeSection, setActiveSection] = useState<string>("Información")

  // VARIABLE
  const initialFormData = {
    id: null,
    p_surname: '',
    m_surname: '',
    name: '',
    test: '',
    employeeNumber: '',
    age: null,
    genre: '',
    category: '',
    height: null,
    weight: null,
    imc: null,
    waist: null,
    bmi: null,
    bmr: null,
    grease: null,
    fat_mass: null,
    ffm: null,
    tbw: null,
    grip: null,
    points: null,
    jump: null,
    jump_points: null,
    agility: null,
    agility_points: null,
    resistance: null,
    resistance_points: null,
    total: null
  };

  const [idError, setIdError] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [originalFormData, setOriginalFormData] = useState<FormData>(initialFormData);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, action: string) => {
    const newValue = e.target.value
    const newFormData = { ...formData }

    switch (action) {
      case "id":
        const newId = parseInt(newValue);

        // IS ID === ORIGINAL ID
        if (newId === originalFormData.id) {
          setIdError(false); 
        } else if (excelData?.some((row, index) => index > 0 && row[0] === newId)) {
          setIdError(true); // IF ALREADY EXISTS
        } else {
          setIdError(false);
          setIsSaveButtonDisabled(false);
        }
        
        newFormData.id = newId;
        break;
        
        case "p_surname" :
          const newP_surname = newValue.trimStart().replace(/[^a-zA-Z\s]/g, '');
          newFormData.p_surname = newP_surname
          break;
        
        case "m_surname" :
          const newM_surname = newValue.trimStart().replace(/[^a-zA-Z\s]/g, '');
          newFormData.m_surname = newM_surname
          break;
          
        case "name" :
          const newName = newValue.trimStart().replace(/[^a-zA-Z\s]/g, '');
          newFormData.name = newName
          break;

        case "test":
          newFormData.test = newValue; 
          break;
    
        case "employeeNumber":
          newFormData.employeeNumber = newValue;
          break;
    
        case "age":
          const newAge = parseInt(newValue);
          if (!isNaN(newAge)) {
            newFormData.age = newAge;
          }
          break;
    
        case "genre":
          newFormData.genre = newValue;
          break;
    
        case "category":
          newFormData.category = newValue;
          break;
    
        default:
          break;
    }
    setFormData(newFormData)
  }

  useEffect(() => {
    if (idError) {
      setIsSaveButtonDisabled(true)
    } else {
      setIsSaveButtonDisabled(false)
    }
  }, [idError])

  const handleGetNewIndex = () => {
    setIdError(false)
    setIsSaveButtonDisabled(false)
    const newFormData = { ...formData }
    // LOGIC IF THERE IS NO LIST
    if (excelData) {
      const lastEntry = excelData[excelData.length - 1]
      if (typeof lastEntry[0] === "number") {
        const lastId = lastEntry[0]
        const newId = lastId + 1
        newFormData.id = newId
      }
    }

    if (excelData && excelData?.length <= 1) {
      newFormData.id = 1
    }

    setFormData(newFormData)
  }

  const fixDecimals = (value: number) => {
    const num = Number(value);
    if (isNaN(num)) {
      return
    }
    return parseFloat(num.toFixed(2));
  }

  const getRowInfo = (rowIndex: number) => {
    resetInputs();
    if (filteredExcelData && excelData) {
      const rowId = filteredExcelData[rowIndex + 1][0];
      const rowToEdit = excelData.find((row) => row[0] === rowId) as unknown as ExcelData;
  
      if (rowToEdit && Array.isArray(rowToEdit)) {
        const rowInfo: FormData = {
          id: rowToEdit[0] !== null ? Number(rowToEdit[0]) : null,
          p_surname: rowToEdit[1] as unknown as string,
          m_surname: rowToEdit[2] as unknown as string,
          name: rowToEdit[3] as unknown as string,
          test: rowToEdit[4] as unknown as string,
          employeeNumber: rowToEdit[5] as unknown as string,
          age: rowToEdit[6] !== null ? Number(rowToEdit[6]) : null,
          genre: rowToEdit[7] as unknown as string,
          category: rowToEdit[8] as unknown as string,
          height: rowToEdit[9] !== null ? Number(rowToEdit[9]) : null,
          weight: rowToEdit[10] !== null ? Number(rowToEdit[10]) : null,
          imc: rowToEdit[11] !== null ? Number(rowToEdit[11]) : null,
          waist: rowToEdit[12] !== null ? Number(rowToEdit[12]) : null,
          bmi: rowToEdit[13] !== null ? Number(rowToEdit[13]) : null,
          bmr: rowToEdit[14] !== null ? Number(rowToEdit[14]) : null,
          grease: rowToEdit[15] !== null ? Number(rowToEdit[15]) : null,
          fat_mass: rowToEdit[16] !== null ? Number(rowToEdit[16]) : null,
          ffm: rowToEdit[17] !== null ? Number(rowToEdit[17]) : null,
          tbw: rowToEdit[18] !== null ? Number(rowToEdit[18]) : null,
          grip: rowToEdit[19] !== null ? Number(rowToEdit[19]) : null,
          points: rowToEdit[20] !== null ? Number(rowToEdit[20]) : null,
          jump: rowToEdit[21] !== null ? Number(rowToEdit[21]) : null,
          jump_points: rowToEdit[22] !== null ? Number(rowToEdit[22]) : null,
          agility: rowToEdit[23] !== null ? Number(rowToEdit[23]) : null,
          agility_points: rowToEdit[24] !== null ? Number(rowToEdit[24]) : null,
          resistance: rowToEdit[25] !== null ? Number(rowToEdit[25]) : null,
          resistance_points: rowToEdit[26] !== null ? Number(rowToEdit[26]) : null,
          total: rowToEdit[27] !== null ? Number(rowToEdit[27]) : null,
        };
        setOriginalFormData(rowInfo);
        setFormData(rowInfo);
        setIsSaveButtonDisabled(false)

      }
    }
  }

  const resetInputs = () => {
    setFormData(initialFormData)
    setOriginalFormData(initialFormData)
  }

  const handleEditeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsPopoverVisible(!isPopoverVisible)
    handleGetRow(rowIndex, 'edit')
    getRowInfo(rowIndex)
  }

  const handleCancelChanges = () => {
    setIsPopoverVisible(false);
    resetInputs()
    setFormData(initialFormData)
    setIsSaveButtonDisabled(false)
    setIdError(false)
  }
  const handleChangeSection = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    e.preventDefault()
    const newSection = e.currentTarget.innerHTML
    setActiveSection(newSection)
    
  }

  return (
    <>
      <button onClick={(e) => handleEditeClick(e)} className='w-[24px] h-full'>
        <EditIcon fill="#00890" className='p-1 rounded-md transition-all hover:bg-zinc-50'/>
      </button>
      {/* POPOVER FORM */}
      <div onClick={(e) => e.stopPropagation()} className={`fixed top-0 left-0 w-full h-full z-10 bg-gray-600/60 transition-opacity duration-200 ${isPopoverVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative  overflow-auto m-auto top-[10%] w-[80%] h-[80%] px-10 py-6 bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md transform transition-transform duration-100 ${isPopoverVisible ? 'scale-100' : 'scale-95'}`}>
          <form autoComplete='off' className="flex flex-col justify-around gap-6 h-full">
            <div className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <h1 className='font-bold text-4xl'>Editar Registro</h1>
                  <p className="text-gray-500">Escoge una sección e ingresa los datos nuevos abajo.</p>
                </div>
                <div className="flex justify-center">
                  <div className="flex text-gray-400 font-medium">
                    <h4 onClick={(e) => handleChangeSection(e)} className={`px-6 py-1 hover:cursor-pointer border-b-[2px] transition-all ease-in-out ${activeSection === "Información" ? 'text-[#2563EB] border-[#2563EB]' : ''}`}>Información</h4>
                    <h4 onClick={(e) => handleChangeSection(e)} className={`px-6 py-1 hover:cursor-pointer border-b-[2px] transition-all ease-in-out ${activeSection === "Datos Corporales" ? 'text-[#2563EB] border-[#2563EB]' : ''}`}>Datos Corporales</h4>
                    <h4 onClick={(e) => handleChangeSection(e)} className={`px-6 py-1 hover:cursor-pointer border-b-[2px] transition-all ease-in-out ${activeSection === "Rendimiento" ? 'text-[#2563EB] border-[#2563EB]' : ''}`}>Rendimiento</h4>
                  </div>
                </div>
            </div>
            <div className="flex flex-col">
              <FormInputs idError={idError} handleInput={handleInput} handleGetNewIndex={handleGetNewIndex} formData={formData} originalFormData={originalFormData} activeSection={activeSection} />   
            </div>
            <div className="flex justify-end pb-5 gap-4">
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
    </>
  )
}

// // {/* FILA 2*/}
// <div className="flex gap-6">
// {/* EDAD */}
// <div className="flex flex-col-reverse w-[30%]">
//     <input value={age?.toString() || ''} min="0" type="number" name="age" id="age" onChange={(e) => handleInput(e, "age")} onKeyDown={preventInvalidChars} placeholder='Ingresa la edad' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.age !== age ? 'bg-gray-200' : 'bg-white' }`}`}/>
//     <label htmlFor="age" className='pb-[2px] text-[10px] text-black font-medium label-default'>Edad</label>
// </div>
// {/* SALTO */}
// <div className="flex flex-col-reverse w-[30%]">
//     <input value={jump?.toString() || ''} min="0" type="number" name="jump" id="jump" onChange={(e) => handleInput(e, "jump")} onKeyDown={preventInvalidChars} placeholder='Ingresa el salto' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.jump !== jump ? 'bg-gray-200' : 'bg-white' }`}`}/>
//     <label htmlFor="jump" className='pb-[2px] text-[10px] text-black font-medium label-default'>Salto</label>
// </div>
// </div>

// {/* FILA 3*/}
// <div className="flex gap-6">
// {/* FUERZA */}
// <div className="flex flex-col-reverse w-[30%]">
//     <input value={strength?.toString() || ''} min="0" type="number" name="strength" id="strength" onChange={(e) => handleInput(e, "strength")} onKeyDown={preventInvalidChars} placeholder='Ingresa la fuerza' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.strength !== strength ? 'bg-gray-200' : 'bg-white' }`}`}/>
//     <label htmlFor="strength" className='pb-[2px] text-[10px] text-black font-medium label-default'>Fuerza</label>
// </div>
// {/* VELOCIDAD */}
// <div className="flex flex-col-reverse w-[30%]">
//     <input value={speed?.toString() || ''} min="0" type="number" name="speed" id="speed" onChange={(e) => handleInput(e, "speed")} onKeyDown={preventInvalidChars} placeholder='Ingresa la velocidad' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.speed !== speed ? 'bg-gray-200' : 'bg-white' }`}`}/>
//     <label htmlFor="speed" className='pb-[2px] text-[10px] text-black font-medium label-default'>Velocidad</label>
// </div>
// </div>

// {/* FILA 4*/}
// <div className="flex gap-6 align-middle">
// {/* TIEMPO */}
// <div className="flex flex-col-reverse w-[30%]">
//     <input value={time?.toString() || ''} min="0" type="number" name="time" id="time" onChange={(e) => handleInput(e, "time")} onKeyDown={preventInvalidChars} placeholder='Ingresa el tiempo' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.time !== time ? 'bg-gray-200' : 'bg-white' }`}`}/>
//     <label htmlFor="time" className='pb-[2px] text-[10px] text-black font-medium label-default'>Tiempo</label>
// </div>

// <div className="flex justify-evenly w-[30%] gap-4">
//   <div className="w-[80px] flex flex-col justify-center items-center rounded-md border-solid border-[1px] border-gray-400">
//     <p className="pb-[2px] text-[10px] text-black font-medium">Puntuación</p>
//     <p>{score}</p>
//   </div>

//   <div className="w-[80px] flex flex-col justify-center items-center rounded-md border-solid border-[1px] border-[#2563EB]">
//     <p className="pb-[2px] text-[10px] text-black font-medium">Total</p>
//     <p>{total ? <>{total.toFixed(2)}</> : <>-</>}</p>
//   </div>
// </div>