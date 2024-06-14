import React from "react";
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
  grip_points: number | null;
  jump: number | null;
  jump_points: number | null;
  agility: number | null;
  agility_points: number | null;
  resistance: string;
  resistance_points: number | null;
  total: number | null;
}

interface FormInputsProps {
  handleInput: (e: React.ChangeEvent<HTMLInputElement>, action: string) => void;
  handleGetNewIndex?: () => void;
  idError?: boolean;
  formData: FormData;
  originalFormData?: FormData;
  activeSection?: string;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, action: string) => void
}

export function FormInputs({ handleInput, formData, originalFormData, idError, handleGetNewIndex, activeSection, handleSelectChange }: FormInputsProps) {
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
          <div className="grid custom-grid-form gap-x-8 gap-y-3 w-full">
            {/* ID */}
            <div className="flex flex-col-reverse gap-[2px]">
              <input value={formData.id?.toString()} onChange={(e) => handleInput(e, "id")} min="1" type="number" name="id" id="id" placeholder='Ingresa el ID' className={`${idError ? 'error-input' : ''} personalized-text-input ${!formData ? 'bg-white' : `${formData.id !== originalFormData?.id ? 'bg-gray-200' : 'bg-white'}`}`} />
              <div onClick={handleGetNewIndex} className="relative">
                <div className="absolute top-[10px] right-2 rounded-[4px] p-[2px] hover:bg-slate-200 hover:cursor-pointer">
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
              <input value={formData.p_surname} type="text" name="p_surname" id="p_surname" onChange={(e) => handleInput(e, "p_surname")} placeholder='Ingresa el apellido paterno' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.p_surname !== originalFormData?.p_surname ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="p_surname" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Apellido Paterno</label>
            </div>
            {/* APELLIDO MATERNO */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.m_surname} type="text" name="m_surname" id="m_surname" onChange={(e) => handleInput(e, "m_surname")} placeholder='Ingresa el apellido materno' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.m_surname !== originalFormData?.m_surname ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="m_surname" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Apellido Materno</label>
            </div>
            {/* NOMBRE */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.name} type="text" name="name" id="name" onChange={(e) => handleInput(e, "name")} placeholder='Ingresa el nombre' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.name !== originalFormData?.name ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="name" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Nombre</label>
            </div>

            {/* PRUEBA */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <select 
                  value={formData.test} 
                  name="test" 
                  id="test" 
                  onChange={(e) => handleSelectChange(e, "test")} 
                  className={`select-custom ${!formData ? 'bg-white' : `${formData.test !== originalFormData?.test ? 'bg-gray-200' : 'bg-white'}`}`}
              >
                  <option value="" disabled className="option-custom">Selecciona la prueba</option>
                  <option value="Prueba 1" className="option-custom">AP2023</option>
                  <option value="Prueba 2" className="option-custom">SS2023</option>
                  <option value="Prueba 3" className="option-custom">Policía Monterrey</option>
                  {/* Agrega más opciones según sea necesario */}
              </select>
              <label htmlFor="test" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Prueba</label>
            </div>

            {/* # EMPLEADO */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.employeeNumber} type="text" name="employeeNumber" id="employeeNumber" onChange={(e) => handleInput(e, "employeeNumber")} placeholder='Ingresa el número de empleado' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.employeeNumber !== originalFormData?.employeeNumber ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="employeeNumber" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Número de Empleado</label>
            </div>
            {/* EDAD */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.age?.toString() || ''} type="number" name="age" id="age" min="1" onChange={(e) => handleInput(e, "age")} onKeyDown={preventInvalidChars} placeholder='Ingresa la edad del participante' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.age !== originalFormData?.age ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="age" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Edad</label>
            </div>
            {/* GENERO */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.genre} type="text" name="genre" id="genre" onChange={(e) => handleInput(e, "genre")} placeholder='Selecciona el género' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.genre !== originalFormData?.genre ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="genre" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Género</label>
            </div>
            {/* CATEGORÍA */}
            <div className="flex flex-col-reverse gap-1 w-full">
              <input value={formData.category} type="text" name="category" id="category" onChange={(e) => handleInput(e, "category")} placeholder='Ingresa la categoría del participante' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.category !== originalFormData?.category ? 'bg-gray-200' : 'bg-white'}`}`} />
              <label htmlFor="category" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Categoría</label>
            </div>
          </div>
        </>
        :
        <>
          {activeSection === "Datos Corporales" ?
            <>
              <div className="grid custom-grid-form gap-x-8 gap-y-3 w-full">
                {/* HEIGHT */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.height?.toString() || ''} type="number" name="height" id="height" min="0" onChange={(e) => handleInput(e, "height")} onKeyDown={preventInvalidChars} placeholder='Ingresa la altura del participante' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.height !== originalFormData?.height ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="height" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Altura (cm)</label>
                </div>
                {/* WEIGHT */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.weight?.toString() || ''} type="number" name="weight" id="weight" min="0" onChange={(e) => handleInput(e, "weight")} onKeyDown={preventInvalidChars} placeholder='Ingresa el peso del participante' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.weight !== originalFormData?.weight ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="weight" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Peso (kg)</label>
                </div>
                {/* IMC */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.imc?.toString() || ''} type="number" name="imc" id="imc" min="0" onChange={(e) => handleInput(e, "imc")} onKeyDown={preventInvalidChars} placeholder='Ingresa el índice de masa corporal' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.imc !== originalFormData?.imc ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="imc" className='pb-[2px] text-base text-gray-800 font-medium label-default'>IMC</label>
                </div>
                {/* WAIST */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.waist?.toString() || ''} type="number" name="waist" id="waist" min="0" onChange={(e) => handleInput(e, "waist")} onKeyDown={preventInvalidChars} placeholder='Ingresa la medida de la cintura' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.waist !== originalFormData?.waist ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="waist" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Cintura</label>
                </div>
                {/* BMI */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.bmi?.toString() || ''} type="number" name="bmi" id="bmi" min="0" onChange={(e) => handleInput(e, "bmi")} onKeyDown={preventInvalidChars} placeholder='Ingresa el índice de masa corporal' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.bmi !== originalFormData?.bmi ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="bmi" className='pb-[2px] text-base text-gray-800 font-medium label-default'>BMI</label>
                </div>
                {/* BMR */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.bmr?.toString() || ''} type="number" name="bmr" id="bmr" min="0" onChange={(e) => handleInput(e, "bmr")} onKeyDown={preventInvalidChars} placeholder='Ingresa la tasa metabólica basal' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.bmr !== originalFormData?.bmr ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="bmr" className='pb-[2px] text-base text-gray-800 font-medium label-default'>BMR</label>
                </div>
                {/* GREASE */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.grease?.toString() || ''} type="number" name="grease" id="grease" min="0" onChange={(e) => handleInput(e, "grease")} onKeyDown={preventInvalidChars} placeholder='Ingresa el procentaje de grasa' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.grease !== originalFormData?.grease ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="grease" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Grasa</label>
                </div>
                {/* FAT MASS */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.fat_mass?.toString() || ''} type="number" name="fat_mass" id="fat_mass" min="0" onChange={(e) => handleInput(e, "fat_mass")} onKeyDown={preventInvalidChars} placeholder='Ingresa el valor de la masa grasa' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.fat_mass !== originalFormData?.fat_mass ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="fat_mass" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Fat mass</label>
                </div>
                {/* FFM */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.ffm?.toString() || ''} type="number" name="ffm" id="ffm" min="0" onChange={(e) => handleInput(e, "ffm")} onKeyDown={preventInvalidChars} placeholder='Ingresa la masa libre de grasa' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.ffm !== originalFormData?.ffm ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="ffm" className='pb-[2px] text-base text-gray-800 font-medium label-default'>FFM</label>
                </div>
                {/* TBW */}
                <div className="flex flex-col-reverse gap-1 w-full">
                  <input value={formData.tbw?.toString() || ''} type="number" name="tbw" id="tbw" min="0" onChange={(e) => handleInput(e, "tbw")} onKeyDown={preventInvalidChars} placeholder='Ingresa el agua corporal total' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.tbw !== originalFormData?.tbw ? 'bg-gray-200' : 'bg-white'}`}`} />
                  <label htmlFor="tbw" className='pb-[2px] text-base text-gray-800 font-medium label-default'>TBW</label>
                </div>
              </div>
            </>
            :
            <>
              {
                activeSection === "Rendimiento" && (
                  <>
                    <div className="grid custom-grid-form_rendimiento gap-y-3 w-full">
                      <div className="grid gap-x-8 gap-y-2 custom-grid-form_rendimiento-sections">
                        {/* GRIP */}
                        <div className="flex flex-col-reverse gap-1 w-full">
                          <input value={formData.grip?.toString() || ''} type="number" name="grip" id="grip" min="0" onChange={(e) => handleInput(e, "grip")} onKeyDown={preventInvalidChars} placeholder='Ingresa el agarre' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.grip !== originalFormData?.grip ? 'bg-gray-200' : 'bg-white'}`}`} />
                          <label htmlFor="grip" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Agarre</label>
                        </div>
                        {/* GRIP POINTS */}
                        <div className="flex flex-col-reverse gap-1 w-full">
                          <input value={formData.grip_points?.toString() || ''} type="number" name="grip_points" id="grip_points" min="0" onChange={(e) => handleInput(e, "grip_points")} onKeyDown={preventInvalidChars} placeholder='Puntos de agarre' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.grip_points !== originalFormData?.grip_points ? 'bg-gray-200' : 'bg-white'}`}`} />
                          <label htmlFor="p" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Puntos</label>
                        </div>
                      </div>
                        
                      <div className="grid gap-x-8 gap-y-1 custom-grid-form_rendimiento-sections">
                        {/* JUMP*/}
                        <div className="flex flex-col-reverse gap-1 w-full">
                          <input value={formData.jump?.toString() || ''} type="number" name="jump" id="jump" min="0" onChange={(e) => handleInput(e, "jump")} onKeyDown={preventInvalidChars} placeholder='Ingresa el salto' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.jump !== originalFormData?.jump ? 'bg-gray-200' : 'bg-white'}`}`} />
                          <label htmlFor="p" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Salto</label>
                        </div>
                        {/* JUMP POINTS */}
                        <div className="flex flex-col-reverse gap-1 w-full">
                          <input value={formData.jump_points?.toString() || ''} type="number" name="jump_points" id="jump_points" min="0" onChange={(e) => handleInput(e, "jump_points")} onKeyDown={preventInvalidChars} placeholder='Puntos de salto' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.jump_points !== originalFormData?.jump_points ? 'bg-gray-200' : 'bg-white'}`}`} />
                          <label htmlFor="p" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Puntos</label>
                        </div>
                      </div>

                      <div className="grid gap-x-8 gap-y-1 custom-grid-form_rendimiento-sections">
                        {/* AGILITY*/}
                        <div className="flex flex-col-reverse gap-1 w-full">
                          <input value={formData.agility?.toString() || ''} type="number" name="agility" id="agility" min="0" onChange={(e) => handleInput(e, "agility")} onKeyDown={preventInvalidChars} placeholder='Ingresa la agilidad' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.agility !== originalFormData?.agility ? 'bg-gray-200' : 'bg-white'}`}`} />
                          <label htmlFor="p" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Agilidad</label>
                        </div>
                        {/* AGILITY POINTS*/}
                        <div className="flex flex-col-reverse gap-1 w-full">
                          <input value={formData.agility_points?.toString() || ''} type="number" name="agility_points" id="agility_points" min="0" onChange={(e) => handleInput(e, "agility_points")} onKeyDown={preventInvalidChars} placeholder='Puntos de agilidad' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.agility_points !== originalFormData?.agility_points ? 'bg-gray-200' : 'bg-white'}`}`} />
                          <label htmlFor="p" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Puntos</label>
                        </div>
                      </div>

                      <div className="grid gap-x-8 gap-y-1 custom-grid-form_rendimiento-sections">
                        {/* RESISTANCE*/}
                        <div className="flex flex-col-reverse gap-1 w-full">
                          <input value={formData.resistance?.toString() || ''} type="text" name="resistance" id="resistance" min="0" onChange={(e) => handleInput(e, "resistance")} onKeyDown={preventInvalidChars} placeholder='Ingresa el tiempo' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.resistance !== originalFormData?.resistance ? 'bg-gray-200' : 'bg-white'}`}`} />
                          <label htmlFor="p" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Resistencia</label>
                        </div>
                        {/* RESISTANCE POINTS*/}
                        <div className="flex flex-col-reverse gap-1 w-full">
                          <input value={formData.resistance_points?.toString() || ''} type="number" name="resistance_points" id="resistance_points" min="0" onChange={(e) => handleInput(e, "resistance_points")} onKeyDown={preventInvalidChars} placeholder='Puntos por tiempo' className={`personalized-text-input ${!formData ? 'bg-white' : `${formData.resistance_points !== originalFormData?.resistance_points ? 'bg-gray-200' : 'bg-white'}`}`} />
                          <label htmlFor="p" className='pb-[2px] text-base text-gray-800 font-medium label-default'>Puntos</label>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }
            </>
          }
        </>
      }
    </>
  )
}
