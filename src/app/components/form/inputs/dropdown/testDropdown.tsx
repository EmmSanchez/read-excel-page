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

interface TestControlledDropdownProps {
  isTestOpen: boolean;
  setIsTestOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption?: string;
  setSelectedOption?: React.Dispatch<React.SetStateAction<string>>;
  originalFormData: FormData | undefined;
}

export const TestControlledDropdown = ({
  isTestOpen,
  setIsTestOpen,
  selectedOption,
  setSelectedOption,
  originalFormData,
}: TestControlledDropdownProps) => {
  const [isAddTestActive, setIsAddTestActive] = useState<boolean>(false);
  const [newOption, setNewOption] = useState<string>('');
  const options = useTestOptionsStore(state => state.options)
  const setOptions = useTestOptionsStore(state => state.setOptions)

  const handleOptionClick = (option: string) => {
    if (setSelectedOption) {
      setSelectedOption(option);
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
        selectedOption === originalFormData?.test ? '' : `${selectedOption ? 'bg-gray-200' : ''}`
      }`}
    >
      <div className="dropdown-header" onClick={toggleDropdown}>
        <p className={`${selectedOption ? 'text-black text-sm font-normal' : ''}`}>
          {selectedOption || 'Selecciona una opción'}
        </p>
        <span className={`dropdown-arrow transition-all ease-out ${isTestOpen ? 'open' : ''}`}>
          <ArrowDropdwonIcon />
        </span>
      </div>
      <div
        className={`dropdown-menu transition-all duration-100 ease-in-out shadow-lg ${
          isTestOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {options?.map((option) => (
          <div
            key={option}
            className="dropdown-item font-semibold text-gray-600"
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
              className="border border-gray-300 rounded-l-md p-2 w-full focus:outline-none"
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