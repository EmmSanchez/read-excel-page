import { AddIcon } from "../../../../public/icons/icons";
import { useState } from "react";
import { PopoverForm } from "../form/popoverForm";
import { useParticipantsDataStore } from "@/app/store/participants";
import { ParticipantData } from "@/app/types/ClientParticipant";

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
  height: string | null;
  weight: string | null;
  imc: string | null;
  waist: string | null;
  bmi: string | null;
  bmr: string | null;
  grease: string | null;
  fat_mass: string | null;
  ffm: string | null;
  tbw: string | null;
  grip: string | null;
  grip_points: string | null;
  jump: string | null;
  jump_points: string | null;
  agility: string | null;
  agility_points: string | null;
  resistance: string;
  resistance_points: string | null;
  total: string | null;
}

interface AddRowButtonProps {
  selectedRows: number[];
  columnToSort: string;
  sortDirection: 'asc' | 'desc'
}

export const getMaxNumber = (participants: ParticipantData[]): number | null => {
  if (!participants || participants.length === 0) {
    return null;
  }

  const maxNumber = participants.reduce((max, participant) => {
    const current = participant["#"];
    if (current !== null && current > max!) { 
      return current;
    }
    return max;
  }, participants[0]["#"]);

  return maxNumber === Number.MIN_VALUE ? null : maxNumber;
}

export function AddRowButton ({selectedRows, columnToSort, sortDirection}: AddRowButtonProps) {
  // FIXING
  const participants = useParticipantsDataStore(state => state.participants)

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
    height: '',
    weight: '',
    imc: '',
    waist: '',
    bmi: '',
    bmr: '',
    grease: '',
    fat_mass: '',
    ffm: '',
    tbw: '',
    grip: '',
    grip_points: '',
    jump: '',
    jump_points: '',
    agility: '',
    agility_points: '',
    resistance: '',
    resistance_points: '',
    total: ''
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState<boolean>(true)

  // Get higher available nummber
  const handleGetNewIndex = () => {
    setIdError(false)
    setIsAddButtonDisabled(false)
    const newFormData = { ...formData }
    if (participants && participants.length > 0) {
      const participantsCopy = [...participants]

      const maxNumber = getMaxNumber(participantsCopy)
      
      
      if (typeof maxNumber === "number") {
        const lastId = maxNumber
        const newId = lastId + 1
        newFormData.id = newId
      }
    }
    
    // LOGIC IF THERE IS NO LIST
    if (participants && participants?.length === 0) {
      newFormData.id = 1
    }

    setFormData(newFormData)
  }

  return (
    <>
      <button disabled={selectedRows.length > 0} onClick={() => {setIsPopoverVisible(!isPopoverVisible); handleGetNewIndex()}} className={`h-full w-[140px] px-4 py-[6px] rounded-md text-xl text-[#2563EB] dark:text-slate-100 font-semibold border-[1.4px] border-solid border-gray-700 transition-all ${selectedRows.length > 0 ? 'opacity-15 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
        <div className="flex justify-center items-center gap-1">
          <AddIcon fill={`${selectedRows.length > 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18}/> 
          <p>Añadir</p>
        </div>
      </button>
      <PopoverForm idError={idError} setIdError={setIdError} setIsPopoverVisible={setIsPopoverVisible} isPopoverVisible={isPopoverVisible} handleGetNewIndex={handleGetNewIndex} formData={formData} setFormData={setFormData} isAddButtonDisabled={isAddButtonDisabled} setIsAddButtonDisabled={setIsAddButtonDisabled} columnToSort={columnToSort} sortDirection={sortDirection}/>
    </>
  )
}