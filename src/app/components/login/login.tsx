import Image from 'next/image';
import Link from 'next/link';
import { ToggleTheme } from '../toggle/toggleTheme';
import { ChangeEvent, useState } from 'react';

export function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
    
  }
  return (
    <>
      <div className="w-full h-screen text-[16px]">
        <div className="flex w-full h-full">

          <div className="flex justify-center items-center w-[100%] bg-white card-bg dark:bg-zinc-950">
            <div className="w-[40%] h-[80%] px-[4%] py-[2%]">
              <div className="relative w-[45%] h-[15%] m-auto mb-[4vh]">
                <Image  
                  src={'/images/fod_logo_dark.png'}
                  alt='Logotipo oficial de la Facultad de Organización Depotiva'
                  layout='fill'
                  objectFit='contain'
                  className='invert dark:invert-0'
                />
              </div>
              <div className="flex flex-col w-full h-[70%] mt-[2%]">
                <h1 className='w-full text-center font-bold text-gray-900 text-title dark:text-white'>Inicia sesión en tu cuenta</h1>
                <h4 className='w-full text-center text-gray-500 text-sub dark:text-gray-300'>¡Bienvenido de nuevo!</h4>

                <form action="" className='flex flex-col'>
                  <label htmlFor="user" className="input-title mt-[5%] mb-[1%] font-semibold text-gray-800 dark:text-gray-100">
                    Usuario
                  </label>
                  <input 
                    onChange={(e) => handleChange(e)}
                    autoComplete='off'
                    id="user"
                    name='user'
                    type="text"
                    placeholder="Ingresa el nombre de usuario"
                    className="bg-transparent text_placeholder-input dark:outline-gray-500 dark:focus:outline-gray-100 dark:text-white"
                  />

                  <label htmlFor="password" className="input-title mt-[3%] mb-[1%] font-semibold text-gray-800 dark:text-gray-100">
                    Contraseña
                  </label>
                  <input 
                    onChange={(e) => handleChange(e)}
                    autoComplete='off'
                    id="password"
                    name='password'
                    type="password"
                    placeholder="Ingresa la contraseña"
                    className="bg-transparent text_placeholder-input dark:outline-gray-500 dark:focus:outline-gray-100 dark:text-white"
                  />

                  <div className="flex justify-center">
                    <button className='w-full button-login font-normal dark:bg-gray-100'>
                      <p className='input-title dark:text-gray-950 font-semibold'>
                        Iniciar sesión
                      </p>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>

          <ToggleTheme />
        </div>
      </div>
    </>
  )
}