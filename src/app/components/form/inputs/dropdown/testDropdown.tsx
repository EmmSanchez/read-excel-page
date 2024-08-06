import React, { useEffect, useState } from 'react';
import { ArrowDropdwonIcon } from '../../../../../../public/icons/icons';
import { useTestOptionsStore } from '@/app/store/testOptions';

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

interface TestControlledDropdownProps {
  isTestOpen: boolean;
  setIsTestOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption?: string;
  setSelectedOption?: React.Dispatch<React.SetStateAction<string>>;
  originalFormData: FormData | undefined;
  formData: FormData
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>
}

export const TestControlledDropdown = ({
  isTestOpen,
  setIsTestOpen,
  selectedOption,
  setSelectedOption,
  originalFormData,
  formData,
  setFormData
}: TestControlledDropdownProps) => {
  const [isAddTestActive, setIsAddTestActive] = useState<boolean>(false);
  const [newOption, setNewOption] = useState<string>('');
  const options = useTestOptionsStore(state => state.options)
  const setOptions = useTestOptionsStore(state => state.setOptions)

  const handleOptionClick = (option: string) => {
    if (setSelectedOption) {
      setSelectedOption(option);
      const newFormData = {...formData}
      newFormData.test = option
      if (setFormData) {
        setFormData(newFormData)
      }
    }
    setIsTestOpen(false);
  };

  const toggleDropdown = () => {
    setIsTestOpen(!isTestOpen);
  };

  const addToggle = () => {
    setIsAddTestActive(true);
  };

  const addNewOption = async (option: string) => {
    try {
      const res = await fetch('/api/excelData/testOptions/addOption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(option)
      })
      
      if (!res.ok) throw new Error('Dato inválido');
    } catch (error) {
      console.error('Error al agregar opción')
    }
  }

  const handleAddOption = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (newOption.trim() !== '') {
      try {
        await addNewOption(newOption)
        
        if (options) {
          setOptions([...options, newOption]);
        } else {
          setOptions([newOption])
        }
      } catch (error) {
        console.error('Error al agregar nueva opción', error)
      }

      if (setSelectedOption) {
        setSelectedOption(newOption);
      }
      setNewOption('');
      setIsAddTestActive(false);
    }
  };

  const handleCancelAddOption = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsAddTestActive(false)
    setNewOption('')
  }

  useEffect(() => {
    if (isTestOpen) {
      setIsAddTestActive(false)
    }
  }, [isTestOpen])

  return (
    <div
      className={`dropdown ${
        isTestOpen ? 'outline outline-[1.4px] -outline-offset-1 outline-[#2563eb]' : ''
      } ${
        selectedOption === originalFormData?.test ? '' : `${selectedOption ? 'bg-gray-200 dark:bg-zinc-700' : ''}`
      }`}
    >
      <div className="dropdown-header" onClick={toggleDropdown}>
        <p className={`${selectedOption ? 'text-black dark:text-gray-100 text-sm font-normal' : ''}`}>
          {selectedOption || 'Selecciona una opción'}
        </p>
        <span className={`dropdown-arrow transition-all ease-out dark:invert ${isTestOpen ? 'open' : ''}`}>
          <ArrowDropdwonIcon />
        </span>
      </div>
      <div
        className={`dropdown-menu transition-all duration-100 ease-in-out shadow-lg dark:border-gray-600 dark:bg-gray-800 ${
          isTestOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {options?.map((option) => (
          <div
            key={option}
            className="dropdown-item font-semibold text-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </div>
        ))}
        {isAddTestActive ? (
          <div className="flex mb-2 px-[8px] py-[6px]">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="border border-solid border-gray-300 dark:bg-gray-700 rounded-l-md p-2 w-full focus:outline-none"
              placeholder="Nueva opción"
            />
            <button
              onClick={(e) => handleCancelAddOption(e)}
              className="w-[15%] px-[10px] py-[6px] font-semibold text-white bg-gray-400 hover:cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={(e) => handleAddOption(e)}
              className="w-[15%] px-[10px] py-[6px] font-semibold text-white rounded-r-md bg-[#2563eb] hover:cursor-pointer"
            >
              Añadir
            </button>
          </div>
        ) : (
          <div
            onClick={addToggle}
            className="px-[10px] py-[6px] font-semibold text-white/90 bg-[#2563eb] hover:cursor-pointer"
          >
            + Añadir
          </div>
        )}
      </div>
    </div>
  );
};