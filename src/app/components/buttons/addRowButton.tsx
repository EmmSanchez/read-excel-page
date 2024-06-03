import { AddIcon } from "../../../../public/icons/icons";

interface AddRowButtonProps {
  selectedRows: number[];
  setIsPopoverVisible: React.Dispatch<React.SetStateAction<boolean>>
  isPopoverVisible: boolean;
  handleGetNewIndex: () => void
}

export function AddRowButton ({selectedRows, setIsPopoverVisible, isPopoverVisible, handleGetNewIndex}: AddRowButtonProps) {
  return (
    <>
      <button disabled={selectedRows.length > 0} onClick={() => {setIsPopoverVisible(!isPopoverVisible); handleGetNewIndex()}} className={`px-4 py-[6px] rounded-md text-[#2563EB] font-semibold border-[1.4px] border-solid border-[#E2E8F0] transition-all ${selectedRows.length > 0 ? 'text-[#E2E8F0] cursor-not-allowed' : 'hover:bg-gray-100 '}`}>
        <div className="flex justify-center items-center gap-1">
          <AddIcon fill={`${selectedRows.length > 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18}/> 
          <p>Añadir</p>
        </div>
      </button>
    </>
  )
}