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
  grip_points: number | null;
  jump: number | null;
  jump_points: number | null;
  agility: number | null;
  agility_points: number | null;
  resistance: string;
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
    grip_points: null,
    jump: null,
    jump_points: null,
    agility: null,
    agility_points: null,
    resistance: '',
    resistance_points: null,
    total: null
  };

  const [idError, setIdError] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [originalFormData, setOriginalFormData] = useState<FormData>(initialFormData);

   // DROPDOWN CHOOSE
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('')


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
        case "m_surname" :
        case "name" :
          const newInfo = newValue.trimStart().replace(/[^a-zA-Z\s]/g, '');
          newFormData[action] = newInfo
          break;

        case "test":
        case "employeeNumber":
        case "genre":
        case "category":
        case "resistance":
          newFormData[action] = newValue; 
          break;
    
        case "age":
          const newAge = parseInt(newValue);
          newFormData.age = isNaN(newAge) ? null : newAge;
          break;
    
        case "height":
        case "weight":
        case "imc":
        case "waist":
        case "bmi":
        case "bmr":
        case "grease":
        case "fat_mass":
        case "ffm":
        case "tbw":
        case "grip":
        case "grip_points":
        case "jump":
        case "jump_points":
        case "agility":
        case "agility_points":
        case "resistance_points":
          const newData = parseFloat(newValue);
          newFormData[action] = isNaN(newData) ? null : newData;
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
          grease: rowToEdit[11] !== null ? Number(rowToEdit[11]) : null,
          imc: rowToEdit[12] !== null ? Number(rowToEdit[12]) : null,
          waist: rowToEdit[13] !== null ? Number(rowToEdit[13]) : null,
          bmi: rowToEdit[14] !== null ? Number(rowToEdit[14]) : null,
          bmr: rowToEdit[15] !== null ? Number(rowToEdit[15]) : null,
          fat_mass: rowToEdit[16] !== null ? Number(rowToEdit[16]) : null,
          ffm: rowToEdit[17] !== null ? Number(rowToEdit[17]) : null,
          tbw: rowToEdit[18] !== null ? Number(rowToEdit[18]) : null,
          grip: rowToEdit[19] !== null ? Number(rowToEdit[19]) : null,
          grip_points: rowToEdit[20] !== null ? Number(rowToEdit[20]) : null,
          jump: rowToEdit[21] !== null ? Number(rowToEdit[21]) : null,
          jump_points: rowToEdit[22] !== null ? Number(rowToEdit[22]) : null,
          agility: rowToEdit[23] !== null ? Number(rowToEdit[23]) : null,
          agility_points: rowToEdit[24] !== null ? Number(rowToEdit[24]) : null,
          resistance: rowToEdit[25] as unknown  as string,
          resistance_points: rowToEdit[26] !== null ? Number(rowToEdit[26]) : null,
          total: rowToEdit[27] !== null ? Number(rowToEdit[27]) : null,
        };
          setOriginalFormData(rowInfo);
          setFormData(rowInfo);
          setIsSaveButtonDisabled(false)
          setSelectedOption(rowToEdit[4] as unknown  as string)
          setSelectedGenre(rowToEdit[7] as unknown as string)
        }
      }
  }

  const resetInputs = () => {
    setFormData(initialFormData)
    setOriginalFormData(initialFormData)
  }

  // EDIT -------------------
  const handleEditeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsPopoverVisible(!isPopoverVisible)
    handleGetRow(rowIndex, 'edit')
    getRowInfo(rowIndex)
  }

  const updateRowInDatabase = async (formData: FormData, id: number, selectedOption: string, selectedGenre: string) => {
    try {
      const response = await fetch('/api/excelData/editData/editRow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({formData, id, selectedGenre, selectedOption}),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
    } catch (error) {
      console.error('Failed to update row in database:', error);
      throw error;
    }
  };
  
  // CANCEL BUTTON 
  const handleCancelChanges = () => {
    setIsPopoverVisible(false);
    resetInputs()
    setFormData(initialFormData)
    setIsSaveButtonDisabled(false)
    setIdError(false)
    setActiveSection("Información")
    handleGetRow(rowIndex, 'cancel-edit')
    setSelectedOption('')
    setIsTestOpen(false)
    setSelectedGenre('')
    setIsGenreOpen(false)
  }

  // APROVE CHANGES
  const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsPopoverVisible(false);
    setActiveSection("Información");

    try {
      if(!originalFormData.id) return
      const originalId = originalFormData.id
      await updateRowInDatabase(formData, originalId, selectedOption, selectedGenre)
      
      if (excelData) {
        const updatedExcelData = excelData.map(row => {
          if (row[0] === originalFormData.id) {
            return [
              formData.id,
              formData.p_surname,
              formData.m_surname,
              formData.name,
              selectedOption,
              formData.employeeNumber,
              formData.age,
              selectedGenre,
              formData.category,
              formData.height,
              formData.weight,
              formData.grease,
              formData.imc,
              formData.waist,
              formData.bmi,
              formData.bmr,
              formData.fat_mass,
              formData.ffm,
              formData.tbw,
              formData.grip,
              formData.grip_points,
              formData.jump,
              formData.jump_points,
              formData.agility,
              formData.agility_points,
              formData.resistance,
              formData.resistance_points,
              formData.total
            ];
          }
          return row;
        });
  
        // SORT AGAIN
        updatedExcelData.sort((a, b) => {
          const idA = Number(a[0]);
          const idB = Number(b[0]);
          if (idA === null || idB === null) {
            return 0;
          }
          return idA - idB;
        });
  
        setExcelData(updatedExcelData);
        setSelectedOption('')
        setIsTestOpen(false)
        setSelectedGenre('')
        setIsGenreOpen(false)
      }
      
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

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
        <div className={`relative overflow-auto m-auto top-[10%] w-[80%] h-[80%] px-10 py-6 bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md transform transition-transform duration-100 ${isPopoverVisible ? 'scale-100' : 'scale-95'}`}>
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

            <div className="flex flex-col flex-grow">
              <FormInputs idError={idError} handleInput={handleInput} handleGetNewIndex={handleGetNewIndex} formData={formData} originalFormData={originalFormData} activeSection={activeSection} selectedOption={selectedOption} setSelectedOption={setSelectedOption} isTestOpen={isTestOpen} setIsTestOpen={setIsTestOpen} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} isGenreOpen={isGenreOpen} setIsGenreOpen={setIsGenreOpen}/>   
            </div>


            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl text-gray-900 px-4 py-2 rounded-md">
                  Total acumulado: 
                  <span className="text-2xl text-gray-700 text-transparent font-bold bg-gradient-to-br from-blue-900 via-sky-700 to-sky-900 bg-clip-text"> {originalFormData.total} </span> 
                  puntos
                </p>
              </div>

              <div className="flex gap-4">
                <button type='button' 
                    onClick={handleCancelChanges} className='flex h-9 justify-center items-center px-4 py-2 rounded-md border-[1.4px] border-solid border-[#E2E8F0] transition-all hover:bg-gray-100'
                >
                  Cancelar
                </button>

                <button
                  disabled={isSaveButtonDisabled}  
                  type='button'
                  onClick={(e) => handleSaveChanges(e) } 
                  className={`flex h-9 justify-center items-center bg-[#2563EB] text-white font-semibold px-4 py-2 rounded-md transition-all hover:opacity-90 ${isSaveButtonDisabled ? 'bg-slate-400 cursor-not-allowed hover:opacity-100' : ''}`}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
