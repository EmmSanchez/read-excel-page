'use client'
import { useDataUsersStore } from "@/app/store/dataUsers"
import { useTestOptionsStore } from "@/app/store/testOptions"
import { useUserStore } from "@/app/store/userStore"

export default function Settings () {
  const options = useTestOptionsStore(state => state.options)
  const users = useDataUsersStore(state => state.users)
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 m-4">
        <div className="p-4 rounded-lg border-[1px] border-solid border-gray-300">
          <h2 className="text-lg font-semibold">Lista de Usuarios</h2>
          <p className="text-xs text-gray-500">Gestiona la cantidad de usuarios, su rol, nombre y contraseña.</p>

          {/* TABLE */}
          <div className="flex">
              <div className='table table-auto mt-5 p-3 bg-slate-50 w-full rounded-md border-solid border-[1px] border-black/20'>
                <div className='table-header-group'>
                  <div className='table-row'>
                    <div className='table-cell'>
                      <p>Usuario</p>
                    </div>
                    <div className='table-cell'>
                      <p>Contraseña</p>
                    </div>
                    <div className='table-cell'>
                      <p>Rol</p>
                    </div>
                    <div className='table-cell'>
                    </div>
                  </div>
                </div>
                <div className='table-row-group'>
                  {users.map((user, rowIndex) => (
                    <div key={user.username} className="table-row">
                      <div className="table-cell">
                        <p>{user.username}</p>
                      </div>
                      <div className="table-cell">
                        <p>{user.password}</p>
                      </div>
                      <div className="table-cell">
                        <p>{user.rol}</p>
                      </div>
                      <div className="table-cell">
                        <p>Eliminar</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

        </div>

        <div className="p-4 rounded-lg border-[1px] border-solid border-gray-300">
          <h2 className="text-lg font-semibold">Lista de Pruebas</h2>
          <p className="text-xs text-gray-500">Crea o elimina pruebas.</p>

           {/* TABLE */}
           <div className="flex">
              <div className='table table-auto mt-5 p-3 bg-slate-50 w-full rounded-md border-solid border-[1px] border-black/20'>
                <div className='table-header-group'>
                  <div className='table-row'>
                    <div className='table-cell'>
                      <p>Prueba</p>
                    </div>
                    <div className='table-cell'>
                    </div>
                  </div>
                </div>
                <div className='table-row-group'>
                  {options && (options.map((option, rowIndex) => (
                    <div key={option} className="table-row">
                      <div className="table-cell">
                        <p>{option}</p>
                      </div>
                    </div>
                  )))}
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}