'use client'
import { useDataUsersStore } from "@/app/store/dataUsers"
import { useTestOptionsStore } from "@/app/store/testOptions"
import React, { useState } from "react"
import { ArrowDropdwonIcon } from "../../../../public/icons/icons";
import { useAgesStore } from "@/app/store/agesStore";
import { useParticipantsDataStore } from "@/app/store/participants";
import { useFilteredParticipantsDataStore } from "@/app/store/filteredParticipants";
import { filterParticipantsValues, sortParticipantsByColumn } from "@/app/components/table/table";

interface User {
  username: string;
  password: string;
  rol: string;
}

export interface Range {
  minAge: number | null;
  maxAge: number | null;
  value: number | null;
}

interface AgeRange {
  minAge: number | null;
  maxAge: number | null;
}

interface Participant {
  _id: string;
  '#': number;
  'Apellido paterno': string;
  'Apellido materno': string;
  Nombre: string;
  Prueba: string;
  '# Empleado': string;
  Edad: number;
  Genero: string;
  Categoria: number;
  'Altura [cm]': number;
  'Peso [kg]': number;
  'Grasa [%]': number;
  IMC: number;
  'Cintura [cm]': number;
  BMI: number;
  BMR: number;
  Fatmass: number;
  FFM: number;
  TBW: number;
  Agarre: number;
  Puntos: number;
  Salto: number;
  Puntos_1: number;
  Agilidad: number;
  Puntos_2: number;
  Resistencia: string;
  Puntos_3: number;
  Total: number;
}


export default function Settings () {
  // FIXING
  const participants = useParticipantsDataStore(state => state.participants)
  const setParticipants = useParticipantsDataStore(state => state.setParticipants)

  const setFilteredParticipants = useFilteredParticipantsDataStore(state => state.setFilteredParticipants)


  const options = useTestOptionsStore(state => state.options)
  const users = useDataUsersStore(state => state.users)
  const setUsers = useDataUsersStore(state => state.setUsers)

  // USERS
  const [newUser, setNewUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const roles = ["Administrador", "Invitado"]

  // ADD USER
  const handleRolClick = (option: string) => {
    if (newUser) {
      const modifiedUser = { ...newUser, rol: option }
      setNewUser(modifiedUser)
    }
    setIsDropdownOpen(false);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleCreateUser = () =>{ 
    setNewUser({ rol: '', username: '', password: '' })
    setNewOption(null)
    setNewRange(null)
  }
  const postUser = async (user: User) => {
    try {
      const res = await fetch('/api/auth/users/postUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'applicaction/json'
        },
        body: JSON.stringify({user})
      })

      if (res.ok) {
        if (newUser) {
          const newUsers = [ ...users, newUser ]
          setUsers(newUsers)
          setNewUser(null)
          setIsDropdownOpen(false)
        }      
      }

    } catch (error) {
      console.error('Error al subir usuario', error)
    }
  }
  const handleSaveUser = async () => {
    if (newUser && newUser.password && newUser.username && newUser.rol) {
      await postUser(newUser)
    }
  }
  const handleCancelUser = () => {
    setNewUser(null)
    setIsDropdownOpen(false)
  }

  // DELETE USER
  const deleteUser = async (username: string) => {
    try {
      const res = await fetch('/api/auth/users/deleteUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'applicaction/json'
        },
        body: JSON.stringify({ username })
      })

      if (!res.ok) {
        throw new Error('Error al borrar usuario')
      } else {
        console.log('Usuario eliminado correctamente')
      }
      
    } catch (error) {
      console.error('Error al solicitar eliminar el usuarios', error)
    }
  }

  const handleDeleteUser = async (username: string) => {
    try {
      await deleteUser(username)
      const newUsers = users.filter(user => user.username !== username)
      setUsers(newUsers)
    } catch (error) {
      console.error('Error al eliminar usuario', error)  
    }
  }
  
  // TESTS
  const setOptions = useTestOptionsStore(state => state.setOptions)
  const [newOption, setNewOption] = useState<string | null>(null);

  const handleCreateOption = () => {
    setNewOption('')
    setNewUser(null)
    setNewRange(null)
    setIsDropdownOpen(false)
  }
  const handleCancelOption = () => {
    setNewOption(null)
  }
  const handleChangeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newValue = e.target.value
    setNewOption(newValue)
  }
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

      if (res.ok) {
        if (newOption && newOption.trim() !== '') {
          if (options) {
            const newOptions = [...options, newOption]
            const sortedOptions = newOptions.sort((a, b) => {
              return a.localeCompare(b)
            })
            setOptions(sortedOptions);
            setNewOption(null);
          } else {
            setOptions([newOption])
          }
        }
      }
    } catch (error) {
      console.error('Error al agregar opción')
    }
  }
  const handleSaveOption = async () => {
    if (newOption && newOption.trim() !== '') {
      try {
        await addNewOption(newOption)
      } catch (error) {
        console.error('Error al agregar nueva opción', error)
      }
    } 
  }
  // DELETE TEST
  const deleteTest = async (option: string) => {
    try {
      const res = await fetch('/api/excelData/testOptions/deleteOption', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'applicaction/json'
        },
        body: JSON.stringify({ option })
      })

      if (!res.ok) {
        throw new Error('Error al borrar prueba')
      } else {
        console.log('Prueba eliminada correctamente')
      }
      
    } catch (error) {
      console.error('Error al solicitar eliminar la prueba', error)
    }
  }
  const handleDeleteTest = async (option: string) => {
    try {
      if (option) {
        await deleteTest(option)
        if (options) {
          const newOptions = options.filter(value => value !== option)
          setOptions(newOptions)
        } else {
          setOptions([option])
        }
      }
    } catch (error) {
      console.error('Error al eliminar', error)
    }
  }

  // RANGES
  const ageRanges = useAgesStore(state => state.ageRanges)
  const setAgeRanges = useAgesStore(state => state.setAgeRanges)
  const [newRange, setNewRange] = useState<Range | null>(null)

  // VERIFY RANGE
  const isMinAgeValid = (age: number | null): boolean => {
    if (age === null) return false;
    // minAge is more than maxAge
    if (newRange && newRange?.minAge !== null && newRange?.maxAge !== null) {
      if (newRange.minAge > newRange.maxAge) return false;
    }
    // Check if the number is between registered ranges
    const range = ageRanges.some(range => 
      range.minAge !== null && 
      range.maxAge !== null && 
      age >= range.minAge && 
      age <= range.maxAge
    );
    return range ? false : true
  };
  const isMaxAgeValid = (age: number | null): boolean => {
    if (age === null) return false;
    // Check if the number is between registered ranges
    const range = ageRanges.some(range => 
      range.minAge !== null && 
      range.maxAge !== null && 
      age >= range.minAge && 
      age <= range.maxAge
    );
    return range ? false : true
  };
  const isRangeInvalid = (newRange: AgeRange): boolean => {
    if (newRange.minAge === null || newRange.maxAge === null) return false;

    // minAge is more than maxAge
    if (newRange.minAge > newRange.maxAge) return true;

    const overlap = ageRanges.some(range => 
      (newRange.minAge! >= range.minAge! && newRange.minAge! <= range.maxAge!) ||
      (newRange.maxAge! >= range.minAge! && newRange.maxAge! <= range.maxAge!) ||
      (newRange.minAge! <= range.minAge! && newRange.maxAge! >= range.maxAge!)
    );
    
    return overlap
  }

  // CREATE NEW RANGE
  const handleCreateRange = () => {
    setNewRange({
      minAge: 1,
      maxAge: 1,
      value: 1
    })
    setNewUser(null)
    setNewOption(null)
  }
  const handleCancelRange = () => {
    setNewRange(null)
  }
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>, action: string) => {
    const newValue = e.target.value
    const rangeCopy = {...newRange}

    switch (action) {
      case 'minAge':
      case 'maxAge':
        const newAge = parseInt(newValue)
        rangeCopy[action] = isNaN(newAge) ? null : newAge;
        break;
    
      case 'value':
        const newData = parseFloat(newValue)
        rangeCopy[action] = isNaN(newData) ? null : newData
        
        break;
    }
    setNewRange(rangeCopy as Range)
  }
  const handleAddRange = async () => {
    if (!newRange) return

    
    try {
      const res = await fetch('/api/excelData/ages/uploadRange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newRange })
      })
      
      
      if (res.ok) {
        // After save range
        if (ageRanges) {
          const newRanges = [ ...ageRanges, newRange ]
          const sortedRanges = newRanges.sort((a, b) => {
            if (a.minAge === null) return 1;
            if (b.minAge === null) return -1;
            return a.minAge - b.minAge
          })

          setAgeRanges(sortedRanges)
          setNewRange(null)
    
          const response = await res.json()
          const updatedParticipants: Participant[] = response.updatedParticipants

          if (updatedParticipants.length > 0) {
            const dataCopy = participants ? [...participants] : [];

            // Dictionary of id and total
            const updatedParticipantsMap = updatedParticipants.reduce<{ [key: number]: number }>((acc, participant) => {
              acc[participant['#']] = participant.Total;
              return acc;
            }, {});

            // Mapping of lines and saving new values
            const updatedExcel = dataCopy.map(row => {
              const participantId = row["#"];
              if (typeof participantId === 'number' && updatedParticipantsMap[participantId] !== undefined) {
                row.Total = updatedParticipantsMap[participantId];
              }
              return row;
            });

            setParticipants(updatedExcel)

            const updatedCopy = [...updatedExcel]
            const sortedUpdatedExcel = sortParticipantsByColumn(updatedCopy, '#', 'asc')
            setFilteredParticipants(filterParticipantsValues(sortedUpdatedExcel))
          }
        }
      }
    } catch (error) {
      console.error('Error', error)
    }
  }
  const handleDeleteRange = async (minAge: number | null, maxAge: number | null) => {
    if (!minAge) return
    try {
      const res = await fetch('/api/excelData/ages/deleteRange', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'applicaction/json'
        },
        body: JSON.stringify({ minAge, maxAge })
      })

      if (res.ok) {
        const response = await res.json()
        const updatedParticipants: Participant[] = response.updatedParticipants
        
        if (ageRanges) {
          const newRanges = ageRanges.filter(ageRange => ageRange.minAge !== minAge)

          if (updatedParticipants.length > 0) {
            const dataCopy = participants ? [...participants] : [];

            // Dictionary of id and total
            const updatedParticipantsMap = updatedParticipants.reduce<{ [key: number]: number }>((acc, participant) => {
              acc[participant['#']] = participant.Total;
              return acc;
            }, {});

            // Mapping of lines and saving new values
            const updatedExcel = dataCopy.map(row => {
              const participantId = row["#"];
              if (typeof participantId === 'number' && updatedParticipantsMap[participantId] !== undefined) {
                row.Total = updatedParticipantsMap[participantId];
              }
              return row;
            });
            
            setParticipants(updatedExcel)

            const updatedCopy = [...updatedExcel]
            const sortedUpdatedExcel = sortParticipantsByColumn(updatedCopy, '#', 'asc')
            setFilteredParticipants(filterParticipantsValues(sortedUpdatedExcel))
          }

          setAgeRanges(newRanges)
          setNewRange(null)
        }
      }
    } catch (error) {
      console.error('Error', error)
    }
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-8 m-4">

        {/* LISTA DE PRUEBAS  */}
        <div className="w-full xl:w-[1200px] h-fit p-4 rounded-lg dark:bg-neutral-900 border-[1px] border-solid border-gray-300 dark:border-zinc-700">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">Pruebas</h2>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Crea o elimina pruebas.</p>
            </div>
            <button onClick={handleCreateOption} className="h-fit px-4 py-1 text-sm font-medium text-gray-700 dark:text-gray-100 rounded border-[1px] border-solid border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <p>Nueva prueba</p>
            </button>
          </div>

           {/* TABLE */}
           <div className="flex overflow-auto mt-5 max-h-[400px] overflow-y-auto">
              <div className='table table-auto w-full rounded-xl border-collapse border-[1px] border-solid border-gray-300 dark:border-zinc-800'>
                <div className='table-header-group'>
                  <div className='table-row sticky -top-1 bg-gray-900 dark:bg-neutral-950 text-gray-50'>
                    <div className='table-cell p-3'>
                      <p>Prueba</p>
                    </div>
                    <div className='table-cell p-3'>
                    </div>
                  </div>
                </div>
                <div className='table-row-group'>
                  {options && (options.map((option, rowIndex) => (
                    <div key={rowIndex} className="table-row">
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <p>{option}</p>
                      </div>
                      <div className="w-10 table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <div className="flex justify-end gap-4">
                          <button onClick={() => handleDeleteTest(option)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-800">
                            <p className="text-white">Eliminar</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )))}
                  {
                    newOption !== null && (
                      <>
                        <div className="table-row">
                        <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                            <input type="text" value={newOption} onChange={(e) => handleChangeOption(e)}  className="w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400" />
                        </div>
                        <div className="w-10 table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                          <div className="flex gap-4">
                            <button onClick={handleSaveOption} className="px-3 py-1 bg-[#2563EB] text-gray-100 rounded hover:bg-[#244488]">
                              <p>Guardar</p>
                            </button>
                            <button onClick={handleCancelOption} className="text-black dark:text-gray-100 rounded hover:underline hover:decoration-solid decoration-slate-900">
                              <p>Cancelar</p>
                            </button>
                          </div>
                        </div>
                      </div>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
        </div>

        {/* LISTA DE RANGOS  */}
        <div className="w-full xl:w-[1200px] h-fit p-4 rounded-lg dark:bg-neutral-900 border-[1px] border-solid border-gray-300 dark:border-zinc-700">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">Rangos de Edades</h2>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Maneja los rangos y sus valores</p>
            </div>
            <button onClick={handleCreateRange} className="h-fit px-4 py-1 text-sm font-medium text-gray-700 dark:text-gray-100 rounded border-[1px] border-solid border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <p>Nuevo rango</p>
            </button>
          </div>

           {/* TABLE */}
           <div className="flex overflow-auto">
              <div className='table table-auto mt-5 w-full rounded-xl border-collapse border-[1px] border-solid border-gray-300 dark:border-zinc-800'>
                <div className='table-header-group bg-gray-900 dark:bg-neutral-950 text-gray-50'>
                  <div className='table-row'>
                    <div className='table-cell p-3'>
                      <p>Mínima</p>
                    </div>
                    <div className='table-cell p-3'>
                      <p>Máxima</p>
                    </div>
                    <div className='table-cell p-3'>
                      <p>Valor</p>
                    </div>
                    <div className='table-cell p-3'>
                    </div>
                  </div>
                </div>
                <div className='table-row-group'>
                  {ageRanges && (ageRanges.map((range, rowIndex) => (
                    <div key={rowIndex} className="table-row">
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <p>{range.minAge}</p>
                      </div>
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <p>{range.maxAge}</p>
                      </div>
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <p>{range.value}</p>
                      </div>
                      <div className="w-10 table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <div className="flex justify-end gap-4">
                          <button onClick={() => handleDeleteRange(range.minAge, range.maxAge)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-800">
                            <p className="text-white">Eliminar</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )))}
                  {
                    newRange && (
                      <>
                        <div className="table-row">
                          {/* INPUTS */}
                          <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                            <input type="number" value={newRange.minAge?.toString() || ''} min={1} onChange={(e) => handleAgeChange(e, 'minAge')} className={`w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400 ${isMinAgeValid(newRange?.minAge) ? '' : 'bg-red-500/20'} ${isRangeInvalid({ minAge: newRange.minAge, maxAge: newRange.maxAge }) ? 'bg-red-500/20 outline-red-400' : ''}`} />
                          </div>
                          <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                            <input type="number" value={newRange.maxAge?.toString() || ''} min={1} onChange={(e) => handleAgeChange(e, 'maxAge')} className={`w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400 ${isMaxAgeValid(newRange?.maxAge) ? '' : 'bg-red-500/20'} ${isRangeInvalid({ minAge: newRange.minAge, maxAge: newRange.maxAge }) ? 'bg-red-500/20  outline-red-400' : ''}`} />
                          </div>
                          <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                            <input type="number" min={0} onChange={(e) => handleAgeChange(e, 'value')} className={`w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400 ${newRange.value === 0 || newRange.value === null ? 'bg-red-500/20  outline-red-400' : ''}`} />
                          </div>
                          <div className="w-10 table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                            <div className="flex gap-4">
                              <button disabled={isRangeInvalid({ minAge: newRange.minAge, maxAge: newRange.maxAge }) || !newRange.value} onClick={() => handleAddRange()} className={`px-3 py-1 bg-[#2563EB] text-gray-100 rounded hover:bg-[#244488] cursor-pointer ${isRangeInvalid({ minAge: newRange.minAge, maxAge: newRange.maxAge }) || !newRange.value ? 'opacity-10 pointer-events-none' : ''}`}>
                                <p>Guardar</p>
                              </button>
                              <button onClick={handleCancelRange} className="text-black dark:text-gray-100 rounded hover:underline hover:decoration-solid decoration-slate-900">
                                <p>Cancelar</p>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
        </div>

        {/* LISTA DE USUARIOS */}
        <div className="flex flex-col w-full xl:w-[1200px] p-4 rounded-lg dark:bg-neutral-900 border-collapse border-[1px] border-solid border-gray-300 dark:border-zinc-700">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">Usuarios</h2>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Gestiona la cantidad de usuarios, su rol, nombre y contraseña.</p>
            </div>
            <button onClick={handleCreateUser} className="h-fit px-4 py-1 text-sm font-medium text-gray-700 dark:text-gray-100 rounded border-[1px] border-solid border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <p>Crear usuario</p>
            </button>
          </div>
          {/* TABLE */}
          <div className="flex overflow-auto">
              <div className='table table-auto mt-5 w-full rounded-xl border-[1px] border-solid border-gray-300 dark:border-zinc-800'>
                <div className='table-header-group bg-gray-900 dark:bg-neutral-950'>
                  <div className='table-row font-medium text-gray-50'>
                    <div className='table-cell whitespace-nowrap p-3'>
                      <p>Rol</p>
                    </div>
                    <div className='table-cell whitespace-nowrap p-3'>
                      <p>Nombre de usuario</p>
                    </div>
                    <div className='table-cell p-3'>
                      <p>Contraseña</p>
                    </div>
                    <div className='table-cell p-3'>
                    </div>
                  </div>
                </div>
                <div className='table-row-group'>
                  {users.map((user, rowIndex) => (
                    <div key={rowIndex} className="table-row">
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <p>{user.rol}</p>
                      </div>
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <p>{user.username}</p>
                      </div>
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <p>{user.password}</p>
                      </div>
                      <div className="w-10 table-cell p-3 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                        <div className="flex justify-end gap-4">
                          <button onClick={() => handleDeleteUser(user.username)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-800">
                            <p className="text-white">Eliminar</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {
                    newUser && (
                      <>
                        <div className="table-row">
                          {/* DROPDOWN */}
                          <div
                            className={`dropdown relative ml-2 my-2 w-[200px] ${isDropdownOpen ? 'outline outline-[1.4px] -outline-offset-1 outline-[#2563eb]' : ''}`
                            }
                          >
                            <div className="dropdown-header" onClick={toggleDropdown}>
                              <p className={`${newUser.rol ? 'text-black dark:text-gray-50 text-sm font-normal' : ''}`}>
                                {newUser.rol || 'Selecciona una opción'}
                              </p>
                              <span className={`dropdown-arrow transition-all ease-out ${isDropdownOpen ? '' : 'open'}`}>
                                <ArrowDropdwonIcon />
                              </span>
                            </div>
                            <div
                              className={`absolute bottom-[52px] w-[101%] rounded-md transition-all duration-100 ease-in-out shadow-lg bg-white dark:bg-zinc-800 border-solid border-[1px] border-[#ccc] dark:border-gray-700 overflow-hidden ${
                                isDropdownOpen ? 'opacity-100' : 'opacity-0 hidden pointer-events-none'
                              }`}
                            >
                              {roles.map((rol) => (
                                <div
                                  key={rol}
                                  className="dropdown-item font-semibold text-gray-600 dark:text-gray-100 dark:hover:bg-zinc-900"
                                  onClick={() => handleRolClick(rol)}
                                >
                                  {rol}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* INPUTS */}
                          <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                            <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400" />
                          </div>
                          <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                            <input type="text" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400" />
                          </div>
                          <div className="w-10 table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300 dark:border-neutral-800">
                            <div className="flex gap-4">
                              <button onClick={handleSaveUser} className="px-3 py-1 bg-[#2563EB] text-gray-100 rounded hover:bg-[#244488]">
                                <p>Guardar</p>
                              </button>
                              <button onClick={handleCancelUser} className="text-black dark:text-gray-100 rounded hover:underline hover:decoration-solid decoration-slate-900">
                                <p>Cancelar</p>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}