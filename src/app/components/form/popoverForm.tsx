import { useState, useEffect } from "react"
import React, { Dispatch, SetStateAction} from "react"
import { FormInputs } from "./inputs/formInputs"
import { useAgesStore } from "@/app/store/agesStore";
import { useParticipantsDataStore } from "@/app/store/participants";
import { ParticipantData } from "@/app/types/ClientParticipant";
import { sortParticipantsByColumn } from "../table/table";
import { filteredParticipant } from "@/app/types/filteredParticipant";
import { useFilteredParticipantsDataStore } from "@/app/store/filteredParticipants";

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

interface PopoverFormProps {
  idError: boolean;
  setIdError: Dispatch<SetStateAction<boolean>>;
  setIsPopoverVisible: Dispatch<SetStateAction<boolean>>;
  isPopoverVisible: boolean; 
  handleGetNewIndex: () => void;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  isAddButtonDisabled: boolean;
  setIsAddButtonDisabled: Dispatch<SetStateAction<boolean>>
  columnToSort: string;
  sortDirection: 'asc' | 'desc'
}

type ParticipantKeys = keyof filteredParticipant;  


export function PopoverForm ({setIdError, idError, setIsPopoverVisible, isPopoverVisible, handleGetNewIndex, formData, setFormData, isAddButtonDisabled, setIsAddButtonDisabled, columnToSort, sortDirection}: PopoverFormProps) {
  // FIXING
  const participants = useParticipantsDataStore(state => state.participants)
  const setParticipants = useParticipantsDataStore(state => state.setParticipants)

  const setFilteredParticipants = useFilteredParticipantsDataStore(state => state.setFilteredParticipants)

  const ageRanges = useAgesStore(state => state.ageRanges)


  // DATA INSERTED IN THE FORM
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
  const originalFormData = {...initialFormData}


  // SECTIONS FORM
  const [activeSection, setActiveSection] = useState<string>("Información")

  // DROPDOWN CHOOSE
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('')

  // IDENTIFY RANGE OF AGE INSERTED
  const getValueOfAge = (age: number) => {
    if (!age) return 1
    const range = ageRanges.find((range) => age >= range.minAge! && age <= range.maxAge!)
    return range ? range.value : 1
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, action: string) => {
    const newValue = e.target.value
    const newFormData = { ...formData }

    switch (action) {
      case "id":
        const newId = parseInt(newValue);   
        if (participants?.some((row, index) => row["#"] === newId) || !newId) {
          setIdError(true)
          setIsAddButtonDisabled(true)
        } else {
          setIdError(false)
          setIsAddButtonDisabled(false)
        }
        newFormData.id = newId;
        break;
        
        case "p_surname" :
        case "m_surname" :
        case "name" :
          const newInfo = newValue.trimStart().replace(/[^a-zA-Z\s]/g, '');
          newFormData[action] = newInfo
          break;

        case "employeeNumber":
        case "genre":
        case "category":
        case "resistance":
          newFormData[action] = newValue; 
          break;
    
        case "age":
          const newAge = parseInt(newValue);
          newFormData.age = isNaN(newAge) ? null: newAge;
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
        case "jump":
        case "agility":
          const newData = parseFloat(newValue);
          newFormData[action] = isNaN(newData) ? null : newData;
          break;
        
        case "grip_points":
        case "jump_points":
        case "agility_points":
        case "resistance_points":
          const newPoints = parseFloat(newValue);
          newFormData[action] = isNaN(newPoints) ? null : newPoints;
          break;
        
    
        default:
          break;
    }
    setFormData(newFormData)
  }

  // ENDPOINT TO ADD NEW ROW
  const sendNewRow = async (row: ParticipantData) => {
    try {
      const res = await fetch('/api/excelData/editData/addRow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({row})
      })
  
      if (!res.ok) {
        return {
          success: false,
          message: `Failed to upload data. Server responded with status: ${res.status} ${res.statusText}`,
        };
      }
    } catch (error) {
      console.error("Error uploading data to MongoDB:", error);
    }
  }

  // ADD NEW ROW
  const handleAddRow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
     // Ensure the formData has an id before adding
     if (formData.id !== null) {
      const newRow = {
          "#": formData.id!,
          "Apellido paterno": formData.p_surname,
          "Apellido materno": formData.m_surname,
          "Nombre": formData.name,
          "Prueba": selectedOption,
          "# Empleado": formData.employeeNumber,
          "Edad": formData.age,
          "Genero": selectedGenre,
          "Categoria": formData.category,
          "Altura [cm]": formData.height,
          "Peso [kg]": formData.weight,
          "IMC": formData.imc,
          "Cintura [cm]": formData.waist,
          "BMI": formData.bmi,
          "BMR": formData.bmr,
          "Grasa [%]": formData.grease,
          "Fatmass": formData.fat_mass,
          "FFM": formData.ffm,
          "TBW": formData.tbw,
          "Agarre": formData.grip,
          "Puntos": formData.grip_points,
          "Salto": formData.jump,
          "Puntos_1": formData.jump_points,
          "Agilidad": formData.agility,
          "Puntos_2": formData.agility_points,
          "Resistencia": formData.resistance,
          "Puntos_3": formData.resistance_points,
          "Total": formData.total,
      }

      try {
        const result = await sendNewRow(newRow)
        if (result?.success === false ) return
        
        // Add new row to the existing data
        const updatedData = participants ? [...participants, newRow] : [newRow]  
        const copyUpdatedData = [...updatedData]
        
        // Sort the data by id in ascending order ------------------------------------------------- PROBABLY THE REASON OF AUTO SORT BY ID
        // updatedData.sort((a, b) => (a["#"] as number) - (b["#"] as number));
        const sortedData = sortParticipantsByColumn(copyUpdatedData, columnToSort as ParticipantKeys, sortDirection)
        
        // Update the state with the new sorted data
        setParticipants(updatedData)
        setFilteredParticipants(sortedData)
      } catch (error) {
        console.error('Error al crear nuevo participante', error)
      }
      
      
      // Reset the form inputs
      resetInputs();
      setIsPopoverVisible(false);
      setIdError(false);
      setSelectedOption('')
      setIsTestOpen(false)
      setSelectedGenre('')
      setIsGenreOpen(false)
    }
  }

  const resetInputs = () => {
    setFormData(initialFormData)
    setActiveSection("Información")
  }
  const handleChangeSection = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    e.preventDefault()
    const newSection = e.currentTarget.innerHTML
    setActiveSection(newSection)
  }
  const handleCancelChanges = () => {
    setIsPopoverVisible(false);
    resetInputs()
    setIdError(false)
    setSelectedOption('')
    setIsTestOpen(false)
    setSelectedGenre('')
    setIsGenreOpen(false)
  }

  const fixDecimals = (value: number) => {
    const num = Number(value);
    if (isNaN(num)) {
      return
    }
    return parseFloat(num.toFixed(2));
  }


  useEffect(() => {
    const rangeValue = getValueOfAge(formData.age!)
    const newTotal = ((formData.grip_points ? formData.grip_points : 0) + (formData.jump_points ? formData.jump_points : 0) + (formData.agility_points ? formData.agility_points : 0) + (formData.resistance_points ? formData.resistance_points : 0)) * rangeValue!
    const newTotalFixed = fixDecimals(newTotal)!
    setFormData((prevData) => ({ ...prevData, total: newTotalFixed}))
    
  }, [formData.age, formData.grip_points, formData.jump_points, formData.agility_points, formData.resistance_points])

  return (
    <>
      <div className={`fixed top-0 left-0 w-full h-full z-10 bg-gray-600/60 transition-opacity duration-200 ${isPopoverVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative overflow-auto m-auto top-[10%] w-[80%] h-[80%] px-10 py-6 bg-white dark:bg-neutral-900 rounded-md outline outline-gray-300 dark:outline-zinc-700 outline-1 drop-shadow-md transform transition-transform duration-100 ${isPopoverVisible ? 'scale-100' : 'scale-95'}`}>
            <form autoComplete='off' className="flex flex-col justify-around gap-6 h-full">
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <h1 className='font-bold text-4xl'>Añadir Registro</h1>
                  <p className="text-gray-500 dark:text-gray-400">Escoge una sección e ingresa los datos del nuevo usuario abajo.</p>
                </div>
                <div className="flex justify-center">
                  <div className="flex text-gray-400 dark:text-gray-100 font-medium">
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
                <p className="text-xl text-gray-900 dark:text-gray-50 px-4 py-2 rounded-md">
                  Total acumulado: 
                  <span className="text-2xl text-gray-700 dark:text-gray-200 text-transparent font-bold bg-gradient-to-br from-blue-900 via-sky-700 to-sky-900 bg-clip-text"> {formData.total} </span> 
                  puntos
                </p>
              </div>

              <div className="flex gap-4 text-base">
                <button type='button' 
                    onClick={handleCancelChanges} className='flex h-9 justify-center items-center px-4 py-2 rounded-md border-[1.4px] border-solid border-[#E2E8F0] transition-all hover:bg-gray-100 dark:hover:bg-[#14151e]'
                >
                  Cancelar
                </button>

                <button
                  disabled={isAddButtonDisabled}  
                  type='button'
                  onClick={(e) => handleAddRow(e) } 
                  className={`flex h-9 justify-center items-center bg-[#2563EB] text-white font-semibold px-4 py-2 rounded-md transition-all hover:opacity-90 ${isAddButtonDisabled ? 'bg-slate-400 cursor-not-allowed hover:opacity-100' : ''}`}
                >
                  Añadir participante
                </button>
              </div>
            </div>

            </form>
          </div>
        </div>
    </>
  )
}