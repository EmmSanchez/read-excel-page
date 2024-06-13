import { ErrorIcon, AddIcon } from "../../../../../public/icons/icons"

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
  points: number | null;
  jump: number | null;
  jump_points: number | null;
  agility: number | null;
  agility_points: number | null;
  resistance: number | null;
  resistance_points: number | null;
  total: number | null;
}

interface FormInputsProps {
  handleInput: (e: React.ChangeEvent<HTMLInputElement>, action: string) => void;
  handleGetNewIndex?: () => void;
  idError?: boolean;
  formData: FormData;
  originalFormData: FormData;
  activeSection: string;
}

export function FormInputs({ handleInput, formData, originalFormData, idError, handleGetNewIndex, activeSection }: FormInputsProps) {
  // AVOID e, E, +, -
  const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

  return (
    <>
      {activeSection === "Información" ?
        <>
          {/* FILA 1 */}
          <div className="grid custom-grid-form gap-x-8 gap-y-3 w-full">
            {/* ID */}
            <div className="flex flex-col-reverse gap-[2px]">
              <input value={formData.id?.toString()} onChange={(e) => handleInput(e, "id")} min="1" type="number" name="id" id="id" placeholder='Ingresa el ID' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.id !== originalFormData.id ? 'bg-gray-200' : 'bg-white'}`}`} />
              <div onClick={handleGetNewIndex} className="relative">
                <div className="absolute top-[12px] right-2 rounded-[4px] p-[2px] hover:bg-slate-200 hover:cursor-pointer">
                  <AddIcon fill='#2563EB' width={28} height={28} />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <label htmlFor="id" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Número de ID</label>
                {idError &&
                  <div className="relative w-48">
                    <p className='absolute flex h-full items-center pb-1 gap-1 w-full text-red-500 text-xs font-medium mt-[2px]'>
                      <ErrorIcon fill="#EF4444" width={14} height={14} /><span>ID actualmente en uso</span>
                    </p>
                  </div>
                }
              </div>
            </div>
            {/* APELLIDO PATERNO */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.p_surname} type="text" name="p_surname" id="p_surname" onChange={(e) => handleInput(e, "p_surname")} placeholder='Ingresa el apellido paterno' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.p_surname !== originalFormData.p_surname ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="p_surname" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Apellido Paterno</label>
            </div>
            {/* APELLIDO MATERNO */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.m_surname} type="text" name="m_surname" id="m_surname" onChange={(e) => handleInput(e, "m_surname")} placeholder='Ingresa el apellido materno' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.m_surname !== originalFormData.m_surname ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="m_surname" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Apellido Materno</label>
            </div>
            {/* NOMBRE */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.name} type="text" name="name" id="name" onChange={(e) => handleInput(e, "name")} placeholder='Ingresa el nombre' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.name !== originalFormData.name ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="name" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Nombre</label>
            </div>
            {/* PRUEBA */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.test} type="text" name="test" id="test" onChange={(e) => handleInput(e, "test")} placeholder='Selecciona la prueba' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.test !== originalFormData.test ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="test" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Prueba</label>
            </div>
            {/* # EMPLEADO */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.employeeNumber} type="text" name="employeeNumber" id="employeeNumber" onChange={(e) => handleInput(e, "employeeNumber")} placeholder='Ingresa el número de empleado' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.employeeNumber !== originalFormData.employeeNumber ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="employeeNumber" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Número de Empleado</label>
            </div>
            {/* EDAD */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.age?.toString() || ''} type="number" name="age" id="age" min="1" onChange={(e) => handleInput(e, "age")} onKeyDown={preventInvalidChars} placeholder='Ingresa la edad del participante' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.age !== originalFormData.age ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="age" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Edad</label>
            </div>
            {/* GENERO */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.genre} type="text" name="genre" id="genre" onChange={(e) => handleInput(e, "genre")} placeholder='Selecciona el género' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.genre !== originalFormData.genre ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="genre" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Género</label>
            </div>
            {/* CATEGORÍA */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.category} type="text" name="category" id="category" onChange={(e) => handleInput(e, "category")} placeholder='Ingresa la categoría del participante' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.category !== originalFormData.category ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="category" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Categoría</label>
            </div>
          </div>
        </>
        :
        <>
        </>
      }
    </>
  )
}
