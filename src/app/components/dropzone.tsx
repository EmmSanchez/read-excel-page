import { TrashIcon, UploadIcon } from "../../../public/icons/icons"
import React, { useState, ChangeEvent } from 'react'
import { useFileStore } from "../store/fileStore"

export function Dropzone() {
  const file = useFileStore((state) => state.file)
  const setFile = useFileStore((state) => state.setFile)


  const [isDragging, setIsDragging] = useState<boolean>(false)
  
  const handleDragOver = (e:  React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    const extension = e.dataTransfer?.files[0].name
    if (extension.endsWith('.xlsx')) {
      const droppedFile = e.dataTransfer?.files[0]
      if (droppedFile) {
        setFile(droppedFile)
      }
    }
    setIsDragging(false)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const selectedFile= e.target.files?.[0]
    if (selectedFile !== undefined) {
      setFile(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
  }

  return (
    <>
      <div className="flex flex-col gap-2 m-4">
        <div className="flex w-[500px] justify-between items-end">
          <p className='font-bold text-sm'>Archivo</p>
          {
            file && <p className='text-[10px] text-black/60'>{(file?.size / 1024).toFixed(2)} KB</p>
          }
        </div>
        <div className="flex justify-center w-[500px] p-[6px] rounded-lg bg-white drop-shadow-md outline outline-1 outline-gray-300">
        {
          file ?
          <>
          <div className="flex flex-row gap-1 justify-between items-center w-[500px] h-[45px] px-4 py-2 bg-blue-100 text-black text-sm rounded-lg border-blue-500 border-solid border-[1px]">
            <p>
              <span className='font-bold'>{file.name}</span><span className='font-light'> cargado correctamente</span>
            </p>
            <TrashIcon className='cursor-pointer' onClick={handleRemoveFile}/>
          </div>
          </>
            :
          <>
            <label htmlFor="file-upload" className={`flex flex-row gap-4 bg-gray-100 justify-center items-center w-[500px] h-[45px] text-black text-sm cursor-pointer rounded-lg border-gray-400 border-dashed border-[1px] transition-all hover:bg-blue-100 hover:border-blue-500 ${isDragging ? 'bg-slate-200 border-blue-500 border-solid' : ''}`}
            onDragOver={(e) => handleDragOver(e)}
            onDragLeave={(e) => handleDragLeave(e)}
            onDrop={(e) => handleDrop(e)}
            >  
            {
              isDragging ?
              <p className='font-bold pointer-events-none'>¡Suelta aquí!</p>
              :
              <>
                <span>
                  <UploadIcon/>
                </span>
                <span className='font-light'>
                  Arrastra el archivo .xlsx o <span className='font-bold'>Click para buscar</span>
                </span>
              </>
            }
          </label>
          <input type="file" accept='.xlsx' id='file-upload' className='hidden' onChange={(e) => handleFileChange(e)}/>
        </>
      }
        </div>
      </div>
    </>
  )
}
