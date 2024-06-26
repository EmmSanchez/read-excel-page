import { AddIcon } from "../../../../public/icons/icons";
import { useState } from "react";
import { useDataStore } from "@/app/store/dataStore";
import { PopoverForm } from "../form/popoverForm";

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

interface AddRowButtonProps {
  selectedRows: number[];
}

export function AddRowButton ({selectedRows}: AddRowButtonProps) {
  const excelData = useDataStore((state) => state.excelData)
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false)
  const [idError, setIdError] = useState<boolean>(false)

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
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState<boolean>(true)

  // Get higher available nummber
  const handleGetNewIndex = () => {
    setIdError(false)
    setIsAddButtonDisabled(false)
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

  return (
    <>
      <button disabled={selectedRows.length > 0} onClick={() => {setIsPopoverVisible(!isPopoverVisible); handleGetNewIndex()}} className={`h-full w-[140px] px-4 py-[6px] rounded-md text-xl text-[#2563EB] font-semibold border-[1.4px] border-solid border-gray-300 transition-all ${selectedRows.length > 0 ? 'text-[#E2E8F0] cursor-not-allowed' : 'hover:bg-gray-100 '}`}>
        <div className="flex justify-center items-center gap-1">
          <AddIcon fill={`${selectedRows.length > 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18}/> 
          <p>Añadir</p>
        </div>
      </button>
      <PopoverForm idError={idError} setIdError={setIdError} setIsPopoverVisible={setIsPopoverVisible} isPopoverVisible={isPopoverVisible} handleGetNewIndex={handleGetNewIndex} formData={formData} setFormData={setFormData} isAddButtonDisabled={isAddButtonDisabled} setIsAddButtonDisabled={setIsAddButtonDisabled}/>
    </>
  )
}