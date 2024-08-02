import React, { useState, useEffect } from "react";
import { FormInputs } from "../form/inputs/formInputs";
import { EditIcon, PrintIcon } from "../../../../public/icons/icons";
import { useAgesStore } from "@/app/store/agesStore";
import { filteredParticipant } from "@/app/types/filteredParticipant";
import { useParticipantsDataStore } from "@/app/store/participants";
import { useFilteredParticipantsDataStore } from "@/app/store/filteredParticipants";
import { ParticipantData } from "@/app/types/ClientParticipant";
import { sortParticipantsByColumn } from "../table/table";

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
  item: filteredParticipant
  columnToSort: string;
  sortDirection: 'asc' | 'desc'
}

type ParticipantKeys = keyof filteredParticipant;  


export function EditButton ({handleGetRow, rowIndex, item, columnToSort, sortDirection}: EditButtonProps) {
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false)
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(true)

  // FIXING
  const participants = useParticipantsDataStore(state => state.participants)
  const setParticipants = useParticipantsDataStore(state => state.setParticipants)

  const filteredParticipants = useFilteredParticipantsDataStore(state => state.filteredParticipants)
  const setFilteredParticipants = useFilteredParticipantsDataStore(state => state.setFilteredParticipants)

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

  // Ranges of ages
  const ageRanges = useAgesStore(state => state.ageRanges)


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, action: string) => {
    const newValue = e.target.value
    const newFormData = { ...formData }

    switch (action) {
      case "id":
        const newId = parseInt(newValue)
        // IS ID === ORIGINAL ID
        if (newId === originalFormData.id) {
          setIdError(false); 
        } else if (participants?.some((row, index) => row["#"] === newId)) {
          setIdError(true); // IF ALREADY EXISTS
        } else {
          setIdError(false);
          setIsSaveButtonDisabled(false);
        }
        
        if (!newId) {
          setIdError(false)
          setIsSaveButtonDisabled(true)
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
    if (participants) {
      const lastEntry = participants[participants.length - 1]["#"]
      if (typeof lastEntry === "number") {
        const lastId = lastEntry
        const newId = lastId + 1
        newFormData.id = newId
      }
    }

    if (participants && participants?.length === 1) {
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

  const getRowInfo = (id: number) => {
    resetInputs();
    if (filteredParticipants && participants) {
      const rowId = id
      const rowToEdit = participants.find((row) => row["#"] === rowId);
  
      if (rowToEdit) {
        const rowInfo: FormData = {
          id: rowToEdit["#"] !== null ? Number(rowToEdit["#"]) : null,
          p_surname: rowToEdit["Apellido paterno"] as unknown as string,
          m_surname: rowToEdit["Apellido materno"] as unknown as string,
          name: rowToEdit.Nombre as unknown as string,
          test: rowToEdit.Prueba as unknown as string,
          employeeNumber: rowToEdit["# Empleado"] as unknown as string,
          age: rowToEdit.Edad !== null ? Number(rowToEdit.Edad) : null,
          genre: rowToEdit.Genero as unknown as string,
          category: rowToEdit.Categoria as unknown as string,
          height: rowToEdit["Altura [cm]"] !== null ? Number(rowToEdit["Altura [cm]"]) : null,
          weight: rowToEdit["Peso [kg]"] !== null ? Number(rowToEdit["Peso [kg]"]) : null,
          grease: rowToEdit["Grasa [%]"] !== null ? Number(rowToEdit["Grasa [%]"]) : null,
          imc: rowToEdit.IMC !== null ? Number(rowToEdit.IMC) : null,
          waist: rowToEdit["Cintura [cm]"] !== null ? Number(rowToEdit["Cintura [cm]"]) : null,
          bmi: rowToEdit.BMI !== null ? Number(rowToEdit.BMI) : null,
          bmr: rowToEdit.BMR !== null ? Number(rowToEdit.BMR) : null,
          fat_mass: rowToEdit.Fatmass !== null ? Number(rowToEdit.Fatmass) : null,
          ffm: rowToEdit.FFM !== null ? Number(rowToEdit.FFM) : null,
          tbw: rowToEdit.TBW !== null ? Number(rowToEdit.TBW) : null,
          grip: rowToEdit.Agarre !== null ? Number(rowToEdit.Agarre) : null,
          grip_points: rowToEdit.Puntos !== null ? Number(rowToEdit.Puntos) : null,
          jump: rowToEdit.Salto !== null ? Number(rowToEdit.Salto) : null,
          jump_points: rowToEdit.Puntos_1 !== null ? Number(rowToEdit.Puntos_1) : null,
          agility: rowToEdit.Agilidad !== null ? Number(rowToEdit.Agilidad) : null,
          agility_points: rowToEdit.Puntos_2 !== null ? Number(rowToEdit.Puntos_2) : null,
          resistance: rowToEdit.Resistencia as unknown  as string,
          resistance_points: rowToEdit.Puntos_3 !== null ? Number(rowToEdit.Puntos_3) : null,
          total: rowToEdit.Total !== null ? Number(rowToEdit.Total) : null,
        };
        
          setOriginalFormData(rowInfo);
          setFormData(rowInfo);
          setIsSaveButtonDisabled(false)
          setSelectedOption(rowToEdit.Prueba as unknown  as string)
          setSelectedGenre(rowToEdit.Genero as unknown as string)
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
    handleGetRow(item["#"]!, 'edit')
    getRowInfo(item["#"]!)
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
    handleGetRow(item["#"]!, 'cancel-edit')
    setSelectedOption('')
    setIsTestOpen(false)
    setSelectedGenre('')
    setIsGenreOpen(false)
  }

  // APROVE CHANGES
  const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, action: string) => {
    e.preventDefault();
    
    try {
      if(!originalFormData.id) return
      const originalId = originalFormData.id
      await updateRowInDatabase(formData, originalId, selectedOption, selectedGenre)
      
      // CHECAR PARA ACEPTAR VALORES NULL AL MOMENTO DE ACTUALIZAR DATOS
      if (participants) {
        const updatedData = participants.map(row => {
          if (row["#"] === originalFormData.id) {
            return {
              "#": formData.id!,
              'Apellido paterno': formData.p_surname,
              'Apellido materno': formData.m_surname,
              Nombre: formData.name,
              Prueba: formData.test,
              '# Empleado': formData.employeeNumber,
              Edad: formData.age,
              Genero: formData.genre,
              Categoria: formData.category,
              'Altura [cm]': formData.height,
              'Peso [kg]': formData.weight,
              'Grasa [%]': formData.grease,
              IMC: formData.imc,
              'Cintura [cm]': formData.waist,
              BMI: formData.bmi,
              BMR: formData.bmr,
              Fatmass: formData.fat_mass,
              FFM: formData.ffm,
              TBW: formData.tbw,
              Agarre: formData.grip,
              Puntos: formData.grip_points,
              Salto: formData.jump,
              Puntos_1: formData.jump_points,
              Agilidad: formData.agility,
              Puntos_2: formData.agility_points,
              Resistencia: formData.resistance,
              Puntos_3: formData.resistance_points,
              Total: formData.total,
            }
          }
          return row as ParticipantData;
        });

        // Sort the data by id in ascending order ------------------------------------------------- PROBABLY THE REASON OF AUTO SORT BY ID
        const sortedData = sortParticipantsByColumn(updatedData, columnToSort as ParticipantKeys, sortDirection)

        if (action === 'exit') {
          setIsPopoverVisible(false);
          setSelectedOption('')
          setSelectedGenre('')
          setActiveSection("Información");
        }
        setParticipants(updatedData)
        setFilteredParticipants(sortedData)
        setIsTestOpen(false)
        setIsGenreOpen(false)
        setOriginalFormData(formData)
      }
      
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleChangeSection = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) => {
    e.preventDefault()
    const newSection = e.currentTarget.innerHTML
    setActiveSection(newSection)
    setIsTestOpen(false)
    setIsGenreOpen(false)
  }

  const printData = (formattedData: string) => {
    //Temporal element
    const printWindow = window.open('', '_blank', 'width=1000,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Datos para imprimir</title>
            <style>
              body { font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            ${formattedData}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert('No se pudo abrir la ventana de impresión. Asegúrate de permitir ventanas emergentes.');
    }
  }

  
  const handlePrintSection = (e: React.MouseEvent<HTMLButtonElement>, section: string, type: string) => {
    const currentDate = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    if (section === 'Información') {
      const { p_surname, m_surname, name, test, employeeNumber, age, genre, category } = formData;
  
      const formattedData = `
        <h1>Datos actualizados</h1>
        <p><strong>Usuario:</strong> ${p_surname} ${m_surname}, ${name}</p>
        <p><strong>Prueba:</strong> ${test}</p>
        <p><strong># Empleado:</strong> ${employeeNumber}</p>
        <p><strong>Edad:</strong> ${age}</p>
        <p><strong>Género:</strong> ${genre}</p>
        <p><strong>Categoría:</strong> ${category}</p>
        <p><strong>Fecha Actual:</strong> ${currentDate}</p>
      `;

      printData(formattedData)
    } 

    if (section === 'Datos Corporales') {
      const { p_surname, m_surname, name, test, employeeNumber, age, genre, height, weight, grease, waist, imc, bmi, bmr, fat_mass, ffm, tbw } = formData;
  
      const formattedData = `
        <h1>Datos actualizados</h1>
        <p><strong>Usuario:</strong> ${p_surname} ${m_surname}, ${name}</p>
        <p><strong>Prueba:</strong> ${test}</p>
        <p><strong># Empleado:</strong> ${employeeNumber}</p>
        <p><strong>Edad:</strong> ${age}</p>
        <p><strong>Género:</strong> ${genre}</p>
        <p><strong>Altura:</strong> ${height} [cm]</p>
        <p><strong>Peso:</strong> ${weight} [kg]</p>
        <p><strong>% Grasa:</strong> ${grease} [%]</p>
        <p><strong>Cintura:</strong> ${waist} [cm]</p>
        <p><strong>IMC:</strong> ${imc}</p>
        <p><strong>BMI:</strong> ${bmi}</p>
        <p><strong>BMR:</strong> ${bmr}</p>
        <p><strong>Fat mass:</strong> ${fat_mass}</p>
        <p><strong>FFM:</strong> ${ffm}</p>
        <p><strong>TBW:</strong> ${tbw}</p>
        <p><strong>Fecha Actual:</strong> ${currentDate}</p>
      `;

      printData(formattedData)
    }    

    if (section === 'Rendimiento') {
      const { p_surname, m_surname, name, test, employeeNumber, age, genre, grip, grip_points, jump, jump_points, agility, agility_points, resistance, resistance_points, total } = formData;
      switch (type) {
        case 'grip':
          const formattedGripData = `
            <h1>Agarre</h1>
            <p><strong>Usuario:</strong> ${p_surname} ${m_surname}, ${name}</p>
            <p><strong>Prueba:</strong> ${test}</p>
            <p><strong># Empleado:</strong> ${employeeNumber}</p>
            <p><strong>Edad:</strong> ${age}</p>
            <p><strong>Género:</strong> ${genre}</p>
            <p><strong>Agarre:</strong> ${grip} [kg/f]</p>
            <p><strong>Puntos de agarre:</strong> ${grip_points}</p>
            <p><strong>Total acumulado:</strong> ${total}</p>
            <p><strong>Fecha Actual:</strong> ${currentDate}</p>
          `;
          printData(formattedGripData)
          break;

        case 'jump':
          const formattedJumpData = `
            <h1>Agarre</h1>
            <p><strong>Usuario:</strong> ${p_surname} ${m_surname}, ${name}</p>
            <p><strong>Prueba:</strong> ${test}</p>
            <p><strong># Empleado:</strong> ${employeeNumber}</p>
            <p><strong>Edad:</strong> ${age}</p>
            <p><strong>Género:</strong> ${genre}</p>
            <p><strong>Salto:</strong> ${jump} [cm]</p>
            <p><strong>Puntos de salto:</strong> ${jump_points}</p>
            <p><strong>Total acumulado:</strong> ${total}</p>
            <p><strong>Fecha Actual:</strong> ${currentDate}</p>
          `;
          printData(formattedJumpData)
          break;

        case 'agility':
          const formattedAgilityData = `
            <h1>Agarre</h1>
            <p><strong>Usuario:</strong> ${p_surname} ${m_surname}, ${name}</p>
            <p><strong>Prueba:</strong> ${test}</p>
            <p><strong># Empleado:</strong> ${employeeNumber}</p>
            <p><strong>Edad:</strong> ${age}</p>
            <p><strong>Género:</strong> ${genre}</p>
            <p><strong>Agilidad:</strong> ${agility} [s]</p>
            <p><strong>Puntos de salto:</strong> ${agility_points}</p>
            <p><strong>Total acumulado:</strong> ${total}</p>
            <p><strong>Fecha Actual:</strong> ${currentDate}</p>
          `;
          printData(formattedAgilityData)
          break;

        case 'resistance':
          const formattedResistanceData = `
            <h1>Agarre</h1>
            <p><strong>Usuario:</strong> ${p_surname} ${m_surname}, ${name}</p>
            <p><strong>Prueba:</strong> ${test}</p>
            <p><strong># Empleado:</strong> ${employeeNumber}</p>
            <p><strong>Edad:</strong> ${age}</p>
            <p><strong>Género:</strong> ${genre}</p>
            <p><strong>Resistencia:</strong> ${resistance} [hh:mm:ss.mmm]</p>
            <p><strong>Puntos de salto:</strong> ${resistance_points}</p>
            <p><strong>Total acumulado:</strong> ${total}</p>
            <p><strong>Fecha Actual:</strong> ${currentDate}</p>
          `;
          printData(formattedResistanceData)
          break;
      }
    }    
  }


  // Deep comparison
  const isEqual = (obj1: FormData, obj2: FormData) => JSON.stringify(obj1) === JSON.stringify(obj2);

  // IDENTIFY RANGE OF AGE INSERTED
  const getValueOfAge = (age: number) => {
    if (!age) return 1
    const range = ageRanges.find((range) => age >= range.minAge! && age <= range.maxAge!)
    return range ? range.value : 1
  }

  useEffect(() => {
    const rangeValue = getValueOfAge(formData.age ? formData.age : 1)
    const newTotal = ((formData.grip_points ? formData.grip_points : 0) + (formData.jump_points ? formData.jump_points : 0) + (formData.agility_points ? formData.agility_points : 0) + (formData.resistance_points ? formData.resistance_points : 0)) * rangeValue!
    const newTotalFixed = fixDecimals(newTotal)!
    setFormData((prevData) => ({ ...prevData, total: newTotalFixed}))
  }, [formData.age, formData.grip_points, formData.jump_points, formData.agility_points, formData.resistance_points])

  return (
    <>
      <button onClick={(e) => handleEditeClick(e)} className='w-[24px] h-full'>
        <EditIcon fill="#00890" className='p-1 rounded-md transition-all hover:bg-zinc-50 dark:hover:bg-gray-700'/>
      </button>
      {/* POPOVER FORM */}
      <div onClick={(e) => e.stopPropagation()} className={`fixed top-0 left-0 w-full h-full z-10 bg-gray-600/60 transition-opacity duration-75 ${isPopoverVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative overflow-auto m-auto top-[10%] w-[80%] h-[80%] px-10 py-6 bg-white dark:bg-neutral-900 rounded-md outline outline-gray-300 dark:outline-zinc-700 outline-1 drop-shadow-md transform transition-transform duration-100 ${isPopoverVisible ? 'scale-100' : 'scale-95'}`}>
          <form autoComplete='off' className="flex flex-col justify-around gap-6 h-full">

            <div className="flex flex-wrap flex-row items-center justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <h1 className='font-bold text-4xl'>Editar Registro</h1>
                  <p className="text-gray-500 dark:text-gray-400">Escoge una sección e ingresa los datos nuevos abajo.</p>
                </div>
                {
                  !isEqual(formData, originalFormData) && (
                    <>
                      <div className="animate-pulse bg-red-900 px-6 py-2 rounded-md border-solid border-[1px] border-red-900">
                        <p className="text-red-50 font-semibold">Aviso: Datos no guardados</p>
                      </div>
                    </>
                  )
                }

                <div className="flex justify-center">
                  <div className="flex text-gray-400 dark:text-gray-100 font-medium">
                    <h4 onClick={(e) => handleChangeSection(e)} className={`px-6 py-1 hover:cursor-pointer border-b-[2px] transition-all ease-in-out ${activeSection === "Información" ? 'text-[#2563EB] border-[#2563EB]' : ''}`}>Información</h4>
                    <h4 onClick={(e) => handleChangeSection(e)} className={`px-6 py-1 hover:cursor-pointer border-b-[2px] transition-all ease-in-out ${activeSection === "Datos Corporales" ? 'text-[#2563EB] border-[#2563EB]' : ''}`}>Datos Corporales</h4>
                    <h4 onClick={(e) => handleChangeSection(e)} className={`px-6 py-1 hover:cursor-pointer border-b-[2px] transition-all ease-in-out ${activeSection === "Rendimiento" ? 'text-[#2563EB] border-[#2563EB]' : ''}`}>Rendimiento</h4>
                  </div>
                </div>
            </div>

            <div className="flex flex-col flex-grow">
              <FormInputs idError={idError} handleInput={handleInput} handleGetNewIndex={handleGetNewIndex} formData={formData} setFormData={setFormData} originalFormData={originalFormData} activeSection={activeSection} selectedOption={selectedOption} setSelectedOption={setSelectedOption} isTestOpen={isTestOpen} setIsTestOpen={setIsTestOpen} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} isGenreOpen={isGenreOpen} setIsGenreOpen={setIsGenreOpen}/>   
            </div>


            <div className="flex flex-wrap w-full items-end justify-between gap-2">
              <div>
                <p className="text-xl text-gray-900 dark:text-gray-50 px-4 py-2 rounded-md">
                  Total acumulado: 
                  <span className="text-2xl text-gray-700 text-transparent font-bold bg-gradient-to-br from-blue-900 dark:from-blue-500 via-sky-700 dark:via-sky-300 to-sky-900 dark:to-sky-500 bg-clip-text"> {formData.total} </span> 
                  puntos
                </p>
              </div>
              <div>
                {
                  activeSection !== 'Rendimiento' && (
                    <>
                      <button type='button' 
                          onClick={(e) => handlePrintSection(e, activeSection, '')} className='flex gap-2 h-9 justify-center items-center px-4 py-2 rounded-md bg-[#292C33] dark:bg-gray-100 transition-all hover:opacity-90'
                      >
                        <p className="text-white dark:text-gray-950">Imprimir</p>
                        <PrintIcon className="p-[1px] invert"/>
                      </button>
                    </>
                  )
                }
                {
                  activeSection === 'Rendimiento' && (
                    <>
                      <div className="flex flex-col flex-grow items-center gap-2">
                        <div>
                          <p className="text-lg font-bold text-gray-700 dark:text-gray-200">Imprimir</p>
                        </div>
                        <div className="flex gap-2">
                          <button type='button' onClick={(e) => handlePrintSection(e, activeSection, 'grip')} className='flex gap-2 w-32 h-9 justify-center items-center px-4 py-2 rounded-full bg-[#EBAF26] transition-all hover:'>
                            <p className="text-white">Agarre</p>
                          </button>

                          <button type='button' onClick={(e) => handlePrintSection(e, activeSection, 'jump')} className='flex gap-2 w-32 h-9 justify-center items-center px-4 py-2 rounded-full bg-[#EB267B] transition-all hover:'>
                            <p className="text-white">Salto</p>
                          </button>

                          <button type='button' onClick={(e) => handlePrintSection(e, activeSection, 'agility')} className='flex gap-2 w-32 h-9 justify-center items-center px-4 py-2 rounded-full bg-[#4A6296] transition-all hover:'>
                            <p className="text-white">Agilidad</p>
                          </button>

                          <button type='button' onClick={(e) => handlePrintSection(e, activeSection, 'resistance')} className='flex gap-2 w-32 h-9 justify-center items-center px-4 py-2 rounded-full bg-[#476B48] transition-all hover:'>
                            <p className="text-white">Resistencia</p>
                          </button>
                        </div>
                      </div>
                    </>
                  )
                }
              </div>

              <div className="flex flex-wrap gap-2">

                <button type='button' 
                    onClick={handleCancelChanges} className='flex h-9 justify-center items-center px-4 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-[#14151e]'
                >
                  Cancelar
                </button>
                <button
                  disabled={isSaveButtonDisabled}  
                  type='button'
                  onClick={(e) => handleSaveChanges(e, 'save') } 
                  className={`flex h-9 justify-center items-center px-4 py-2 rounded-md border-[1.4px] border-solid border-[#2626EB] transition-all hover:bg-gray-100 dark:hover:bg-[#14151e] ${isSaveButtonDisabled ? 'cursor-not-allowed opacity-30' : ''}`}
                >
                  Guardar
                </button>
                <button
                  disabled={isSaveButtonDisabled}  
                  type='button'
                  onClick={(e) => handleSaveChanges(e, 'exit') } 
                  className={`flex h-9 justify-center items-center bg-[#2626EB] text-white px-4 py-2 rounded-md transition-all ${isSaveButtonDisabled ? 'cursor-not-allowed opacity-30' : 'hover:opacity-90'}`}
                >
                  Guardar y salir
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
