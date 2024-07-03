'use client'
import { useDataUsersStore } from "@/app/store/dataUsers"
import { useTestOptionsStore } from "@/app/store/testOptions"
import React, { useState } from "react"
import { ArrowDropdwonIcon } from "../../../../public/icons/icons";
import { log } from "console";

interface User {
  username: string;
  password: string;
  rol: string;
}


export default function Settings () {
  const options = useTestOptionsStore(state => state.options)
  const users = useDataUsersStore(state => state.users)
  const setUsers = useDataUsersStore(state => state.setUsers)

  // USERS
  const [newUser, setNewUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const roles = ["Administrador", "Invitado"]
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
  const [editingOption, setEditingOption] = useState(null);

  const addTest = async (option: string) => {
    try {
      const res = await fetch('/api/excelData/testOptions/addOption', {
        method: 'POST',
        headers: {
          'Content-Type': 'applicaction/json'
        },
        body: JSON.stringify({option})
      })

      if (!res.ok) {
        console.error('Error al agregar prueba')
      } else {
        console.log('Prueba agregada correctamente')

      }
    } catch (error) {
      console.error('Error al agregar prueba', error)
    }
  }
  const handleCreateOption = () => {
    setNewOption('')
    setNewUser(null)
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
            setOptions([...options, newOption]);
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


  return (
    <>
      <div className="flex flex-wrap justify-center md:grid-cols-3 gap-8 m-4">
        <div className="flex-grow p-4 rounded-lg border-collapse border-[1px] border-solid border-gray-300">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">Lista de Usuarios</h2>
              <p className="text-lg text-gray-500">Gestiona la cantidad de usuarios, su rol, nombre y contraseña.</p>
            </div>
            <button onClick={handleCreateUser} className="h-fit px-4 py-1 text-lg font-medium text-gray-700 rounded border-[1px] border-solid border-gray-300 hover:bg-gray-100">
              <p>Crear usuario</p>
            </button>
          </div>
          {/* TABLE */}
          <div className="flex">
              <div className='table table-auto mt-5 w-full rounded-xl border-[1px] border-solid border-gray-300'>
                <div className='table-header-group bg-gray-900'>
                  <div className='table-row font-medium text-gray-50'>
                    <div className='table-cell p-3'>
                      <p>Rol</p>
                    </div>
                    <div className='table-cell p-3'>
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
                    <div key={user.username} className="table-row">
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300">
                        <p>{user.rol}</p>
                      </div>
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300">
                        <p>{user.username}</p>
                      </div>
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300">
                        <p>{user.password}</p>
                      </div>
                      <div className="w-10 table-cell p-3 border-b-[1px] border-solid border-gray-300">
                        <div className="flex justify-end gap-4">
                          <button className="px-3 py-1 bg-[#2563EB] text-gray-100 rounded transition-all ease-in-out hover:bg-[#244488]">
                            <p>Editar</p>
                          </button>
                          <button onClick={() => handleDeleteUser(user.username)} className="hover:underline hover:decoration-solid decoration-slate-900">
                            <p>Eliminar</p>
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
                            className={`dropdown ml-2 my-2 w-[190px] ${isDropdownOpen ? 'outline outline-[1.4px] -outline-offset-1 outline-[#2563eb]' : ''}`
                            }
                          >
                            <div className="dropdown-header" onClick={toggleDropdown}>
                              <p className={`${newUser.rol ? 'text-black text-sm font-normal' : ''}`}>
                                {newUser.rol || 'Selecciona una opción'}
                              </p>
                              <span className={`dropdown-arrow transition-all ease-out ${isDropdownOpen ? 'open' : ''}`}>
                                <ArrowDropdwonIcon />
                              </span>
                            </div>
                            <div
                              className={`dropdown-menu transition-all duration-100 ease-in-out shadow-lg ${
                                isDropdownOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                              }`}
                            >
                              {roles.map((rol) => (
                                <div
                                  key={rol}
                                  className="dropdown-item font-semibold text-gray-600"
                                  onClick={() => handleRolClick(rol)}
                                >
                                  {rol}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* INPUTS */}
                          <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300">
                            <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400" />
                          </div>
                          <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300">
                            <input type="text" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400" />
                          </div>
                          <div className="w-10 table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300">
                            <div className="flex gap-4">
                              <button onClick={handleSaveUser} className="px-3 py-1 bg-[#2563EB] text-gray-100 rounded hover:bg-[#244488]">
                                <p>Guardar</p>
                              </button>
                              <button onClick={handleCancelUser} className="text-black rounded hover:underline hover:decoration-solid decoration-slate-900">
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


        {/* LISTA DE PRUEBAS  */}
        <div className="w-full xl:w-[30%] p-4 rounded-lg border-[1px] border-solid border-gray-300">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">Lista de Pruebas</h2>
              <p className="text-lg text-gray-500">Crea o elimina pruebas.</p>
            </div>
            <button onClick={handleCreateOption} className="h-fit px-4 py-1 text-lg font-medium text-gray-700 rounded border-[1px] border-solid border-gray-300 hover:bg-gray-100">
                <p>Nueva prueba</p>
            </button>
          </div>

           {/* TABLE */}
           <div className="flex overflow-auto">
              <div className='table table-auto mt-5 w-full rounded-xl border-collapse border-[1px] border-solid border-gray-300'>
                <div className='table-header-group bg-gray-900 text-gray-50'>
                  <div className='table-row'>
                    <div className='table-cell p-3'>
                      <p>Prueba</p>
                    </div>
                    <div className='table-cell p-3'>
                    </div>
                  </div>
                </div>
                <div className='table-row-group'>
                  {options && (options.map((option, rowIndex) => (
                    <div key={option} className="table-row">
                      <div className="table-cell p-3 border-b-[1px] border-solid border-gray-300">
                        <p>{option}</p>
                      </div>
                      <div className="w-10 table-cell p-3 border-b-[1px] border-solid border-gray-300">
                        <div className="flex justify-end gap-4">
                          <button className="px-3 py-1 bg-[#2563EB] text-gray-100 rounded hover:bg-[#244488]">
                            <p>Editar</p>
                          </button>
                          <button onClick={() => handleDeleteTest(option)} className="text-black rounded hover:underline hover:decoration-solid decoration-slate-900">
                            <p>Eliminar</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )))}
                  {
                    newOption !== null && (
                      <>
                        <div className="table-row">
                        <div className="table-cell align-middle px-3 py-2 border-b-[1px] border-solid border-gray-300">
                            <input type="text" value={newOption} onChange={(e) => handleChangeOption(e)}  className="w-[80%] h-11 px-3 rounded outline outline-1 outline-slate-400" />
                        </div>
                        <div className="w-10 table-cell p-3 border-b-[1px] border-solid border-gray-300">
                          <div className="flex gap-4">
                            <button onClick={handleSaveOption} className="px-3 py-1 bg-[#2563EB] text-gray-100 rounded hover:bg-[#244488]">
                              <p>Guardar</p>
                            </button>
                            <button onClick={handleCancelOption} className="text-black rounded hover:underline hover:decoration-solid decoration-slate-900">
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