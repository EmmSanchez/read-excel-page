import { AddIcon } from "../../../../public/icons/icons";
import { useState } from "react";
import { useDataStore } from "@/app/store/dataStore";
import { PopoverForm } from "../form/popoverForm";

interface AddRowButtonProps {
  selectedRows: number[];
}

export function AddRowButton ({selectedRows}: AddRowButtonProps) {
  const excelData = useDataStore((state) => state.excelData)
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false)
  const [id, setId] = useState<number | null>(null)
  const [idError, setIdError] = useState<boolean>(false)

  // Get higher available nummber
  const handleGetNewIndex = () => {
    setIdError(false)
    // LOGIC IF THERE IS NO LIST
    if (excelData) {
      const lastEntry = excelData[excelData.length - 1]
      if (typeof lastEntry[0] === "number") {
        const lastId = lastEntry[0]
        const newId = lastId + 1
        setId(newId)
      }
    }

    if (excelData && excelData?.length <= 1) {
      setId(1)
    }
  }

  return (
    <>
      <button disabled={selectedRows.length > 0} onClick={() => {setIsPopoverVisible(!isPopoverVisible); handleGetNewIndex()}} className={`h-full w-[140px] px-4 py-[6px] rounded-md text-xl text-[#2563EB] font-semibold border-[1.4px] border-solid border-gray-300 transition-all ${selectedRows.length > 0 ? 'text-[#E2E8F0] cursor-not-allowed' : 'hover:bg-gray-100 '}`}>
        <div className="flex justify-center items-center gap-1">
          <AddIcon fill={`${selectedRows.length > 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18}/> 
          <p>Añadir</p>
        </div>
      </button>
      <PopoverForm id={id} setId={setId} idError={idError} setIdError={setIdError} setIsPopoverVisible={setIsPopoverVisible} isPopoverVisible={isPopoverVisible} handleGetNewIndex={handleGetNewIndex}/>
    </>
  )
}