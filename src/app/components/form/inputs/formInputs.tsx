import { ErrorIcon, AddIcon } from "../../../../../public/icons/icons"

interface FormData {
  id: number | null;
  name: string;
  age: number | null;
  jump: number | null;
  strength: number | null;
  speed: number | null;
  score: number | null;
  time: number | null;
  total: number | null;
}

interface FormInputsProps {
  handleInput: (e: React.ChangeEvent<HTMLInputElement>, action: string) => void
  handleGetNewIndex: () => void
  idError: boolean
  id: number | null
  name: string
  age: number | null
  jump: number | null
  strength: number | null
  speed: number | null
  time: number | null
  score: number | null
  total: number | null
  formData?: FormData
}

export function FormInputs({handleInput, formData, idError, id, handleGetNewIndex, name, age, jump, strength, speed, time, score, total}: FormInputsProps) {
  // AVOID e, E, +, -
  const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

  return (
    <>
      {/* FILA 1*/}
      <div className="flex gap-6">
        {/* ID */}
        <div className="flex flex-col-reverse w-[250px]">
            {
              idError && 
              <>
                <div className="relative">
                  <p className='absolute flex items-center gap-1 w-[250px] text-red-500 text-[10px] font-medium mt-[1px]'>
                    <ErrorIcon fill="#EF4444" width={14} height={14}/><span>ID actualmente en uso</span>
                  </p>
                </div>
              </>
            }
            <input value={id?.toString()} onChange={(e) => handleInput(e, "id")} min="1" type="number" name="id" id="id" placeholder='Ingresa el ID' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.id !== id ? 'bg-gray-200' : 'bg-white' }`}`}/>
            <div onClick={handleGetNewIndex} className="relative">
              <div className="absolute top-[4.5px] right-2 rounded-[4px] p-[2px] hover:bg-slate-200 hover:cursor-pointer">
                <AddIcon fill='#2563EB' width={24} height={24}/>
              </div>
            </div>
            <label htmlFor="id" className='pb-[2px] text-[10px] text-black font-medium label-default'>ID</label>
        </div>
        {/* NOMBRE */}
        <div className="flex flex-col-reverse w-[250px]">
            <input value={name} type="text" name="name" id="name" onChange={(e) => handleInput(e, "name")} placeholder='Ingresa el nombre' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.name !== name ? 'bg-gray-200' : 'bg-white' }`}`}/>
            <label htmlFor="name" className='pb-[2px] text-[10px] text-black font-medium label-default'>Nombre</label>
        </div>
      </div>

      {/* FILA 2*/}
      <div className="flex gap-6">
        {/* EDAD */}
        <div className="flex flex-col-reverse w-[250px]">
            <input value={age?.toString() || ''} min="0" type="number" name="age" id="age" onChange={(e) => handleInput(e, "age")} onKeyDown={preventInvalidChars} placeholder='Ingresa la edad' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.age !== age ? 'bg-gray-200' : 'bg-white' }`}`}/>
            <label htmlFor="age" className='pb-[2px] text-[10px] text-black font-medium label-default'>Edad</label>
        </div>
        {/* SALTO */}
        <div className="flex flex-col-reverse w-[250px]">
            <input value={jump?.toString() || ''} min="0" type="number" name="jump" id="jump" onChange={(e) => handleInput(e, "jump")} onKeyDown={preventInvalidChars} placeholder='Ingresa el salto' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.jump !== jump ? 'bg-gray-200' : 'bg-white' }`}`}/>
            <label htmlFor="jump" className='pb-[2px] text-[10px] text-black font-medium label-default'>Salto</label>
        </div>
      </div>

      {/* FILA 3*/}
      <div className="flex gap-6">
        {/* FUERZA */}
        <div className="flex flex-col-reverse w-[250px]">
            <input value={strength?.toString() || ''} min="0" type="number" name="strength" id="strength" onChange={(e) => handleInput(e, "strength")} onKeyDown={preventInvalidChars} placeholder='Ingresa la fuerza' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.strength !== strength ? 'bg-gray-200' : 'bg-white' }`}`}/>
            <label htmlFor="strength" className='pb-[2px] text-[10px] text-black font-medium label-default'>Fuerza</label>
        </div>
        {/* VELOCIDAD */}
        <div className="flex flex-col-reverse w-[250px]">
            <input value={speed?.toString() || ''} min="0" type="number" name="speed" id="speed" onChange={(e) => handleInput(e, "speed")} onKeyDown={preventInvalidChars} placeholder='Ingresa la velocidad' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.speed !== speed ? 'bg-gray-200' : 'bg-white' }`}`}/>
            <label htmlFor="speed" className='pb-[2px] text-[10px] text-black font-medium label-default'>Velocidad</label>
        </div>
      </div>

      {/* FILA 4*/}
      <div className="flex gap-6 align-middle">
        {/* TIEMPO */}
        <div className="flex flex-col-reverse w-[250px]">
            <input value={time?.toString() || ''} min="0" type="number" name="time" id="time" onChange={(e) => handleInput(e, "time")} onKeyDown={preventInvalidChars} placeholder='Ingresa el tiempo' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.time !== time ? 'bg-gray-200' : 'bg-white' }`}`}/>
            <label htmlFor="time" className='pb-[2px] text-[10px] text-black font-medium label-default'>Tiempo</label>
        </div>

        <div className="flex justify-evenly w-[250px] gap-4">
          <div className="w-[80px] flex flex-col justify-center items-center rounded-md border-solid border-[1px] border-gray-400">
            <p className="pb-[2px] text-[10px] text-black font-medium">Puntuación</p>
            <p>{score}</p>
          </div>

          <div className="w-[80px] flex flex-col justify-center items-center rounded-md border-solid border-[1px] border-[#2563EB]">
            <p className="pb-[2px] text-[10px] text-black font-medium">Total</p>
            <p>{total ? <>{total.toFixed(2)}</> : <>-</>}</p>
          </div>
        </div>

      </div>
    </>
  )
}