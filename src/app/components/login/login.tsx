import Image from 'next/image';
import Link from 'next/link';

export function Login() {
  return (
    <>
      <div className="w-full h-screen text-[16px]">
        <div className="flex w-full h-full">
          <div className="flex justify-center items-center w-[70%] bg-white card-bg">
            <div className="w-[50%] h-[80%] px-[4%] py-[2%] login-card">
              <div className="relative w-[25%] h-[20%]">
                <Image  
                  src={'/images/fod_logo.png'}
                  alt='Logotipo oficial de la Facultad de Organización Depotiva'
                  layout='fill'
                  objectFit='contain'
                />
              </div>
              <div className="flex flex-col w-full h-[70%] mt-[2%]">
                <h4 className='w-full text-gray-500 text-sub'>¡Bienvenido de nuevo!</h4>
                <h1 className='w-full font-semibold text-gray-900 text-title'>Iniciar sesión</h1>

                <label htmlFor="user" className="input-title mt-[5%] mb-[1%] font-semibold text-gray-800">
                  Usuario
                </label>
                <input
                  autoComplete='off'
                  id="user"
                  type="user"
                  placeholder="Ingresa el nombre de usuario"
                  className="bg-transparent text_placeholder-input"
                />

                <label htmlFor="password" className="input-title mt-[3%] mb-[1%] font-semibold text-gray-800">
                  Contraseña
                </label>
                <input
                  autoComplete='off'
                  id="password"
                  type="password"
                  placeholder="Ingresa la contraseña"
                  className="bg-transparent text_placeholder-input"
                />

                <div className="flex justify-center">
                  <button className='w-full button-login font-normal'>
                    Ingresar
                  </button>
                </div>

              </div>
            </div>
          </div>
          <div className="w-[30%] bg-[#a2d2ff]"></div>
        </div>
      </div>
    </>
  )
}