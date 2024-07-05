import Image from 'next/image';
import { ToggleTheme } from '../toggle/toggleTheme';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from "next/navigation"
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useUserStore } from '@/app/store/userStore';
import { useNavLinksStore } from '@/app/store/navLinks';

interface IUser {
  username: string;
  password: string;
}

async function submitUser(credentials: IUser, router: AppRouterInstance) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  if (res.status === 200) {
    router.push('/dashboard/table')
    return res
  }
}

export function Login() {
  const setUserProfile = useUserStore(state => state.setUserProfile)
  const setLinks = useNavLinksStore(state => state.setLinks)

  // Password  show controller
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Info submitted logic
  const [credentials, setCredentials] = useState<IUser>({
    username: '',
    password: ''
  })
  
  const router = useRouter()
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await submitUser(credentials, router)

    if (res?.ok) {
      const { user, links } = await res?.json()
  
      // Save in cache cause it's losted btw refreshes
      localStorage.setItem('userProfile', JSON.stringify(user.rol));
      localStorage.setItem('links', JSON.stringify(links));
  
      setUserProfile(user.rol)
      setLinks(links)
    } else {
      console.error('Error: Credenciales incorrectas')
    }
  }

  return (
    <div className='flex w-screen h-screen'>
    
      <div className="w-full m-auto text-[16px]">
          <div className="flex justify-center items-center w-full">
            <div className="w-[600px] h-[600px] px-6 py-10 bg-white rounded-md border-solid border-[1px] border-gray-400 dark:bg-zinc-900 dark:border-gray-800">
              <div className="relative w-72 h-20 m-auto mb-8">
                <Image  
                  src={'/images/fod_logo_dark.png'}
                  alt='Logotipo oficial de la Facultad de Organización Deportiva'
                  fill
                  className='object-contain invert dark:invert-0'
                />
              </div>

              <div className="flex flex-col w-full px-6">
                <h1 className='w-full text-center font-bold text-gray-900 text-4xl dark:text-white'>Inicia sesión en tu cuenta</h1>
                <h4 className='w-full text-center text-gray-500 text-lg mt-2 font-semibold dark:text-gray-300'>¡Bienvenido de nuevo!</h4>

                <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col py-4'>
                  <label htmlFor="username" className="input-title mt-4 mb-1 font-semibold text-gray-800 dark:text-gray-100">
                    Usuario
                  </label>
                  <input 
                    onChange={(e) => handleChange(e)}
                    autoComplete='off'
                    id="username"
                    name='username'
                    type="text"
                    placeholder="Ingresa el nombre de usuario"
                    className="bg-transparent text_placeholder-input dark:outline-gray-500 dark:focus:outline-gray-100 dark:text-white"
                  />

                  <label htmlFor="password" className="input-title mt-3 mb-1 font-semibold text-gray-800 dark:text-gray-100">
                    Contraseña
                  </label>
                  <div className="flex gap-2">
                    <input 
                      onChange={(e) => handleChange(e)}
                      autoComplete='off'
                      id="password"
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa la contraseña"
                      className="bg-transparent text_placeholder-input w-[460px] dark:outline-gray-500 dark:focus:outline-gray-100 dark:text-white"
                    />

                    <div className="flex flex-grow justify-center items-center">
                      <button
                        type='button'
                        onClick={toggleShowPassword}
                        className='relative w-[24px] h-[24px]'
                      >
                        {showPassword ? 
                          <>
                            <Image  
                              src={'/icons/eye-closedIcon.svg'}
                              alt='Habilitar Modo Obscuro'
                              layout='fill'
                              className='w-full dark:invert'
                            />
                          </>
                          : 
                          <>
                            <Image  
                              src={'/icons/eyeIcon.svg'}
                              alt='Habilitar Modo Obscuro'
                              layout='fill'
                              className='w-full dark:invert'
                            />
                          </>
                        }
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button type='submit' className='w-full button-login font-normal dark:bg-gray-100'>
                      <p className='dark:text-gray-950'>
                        Iniciar sesión
                      </p>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
      </div>
          <ToggleTheme />
   </div>
  )
}