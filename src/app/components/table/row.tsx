import { PrintIcon, EditIcon } from "../../../../public/icons/icons";
import { DeleteButton } from "../buttons/deleteButton";
import React, { useEffect } from "react";
import { EditButton } from "../buttons/editeButton";
import { useUserStore } from "@/app/store/userStore";
import { filteredParticipant } from "@/app/types/filteredParticipant";

interface RowProps {
  rowIndex: number; 
  handleGetRow: (rowIndex: number, action: string) => void; 
  selectedRows: number[]
  item: filteredParticipant
  rowToDelete: number | null;
  cancelDelete: () => void;
  confirmDeleteRow: () => void
}

export function Row ({rowIndex, handleGetRow, selectedRows, item, rowToDelete, cancelDelete, confirmDeleteRow}: RowProps) {
  const isSelected = selectedRows.includes(rowIndex);
  
  // Get rol every table refresh
  const setUserProfile = useUserStore(state => state.setUserProfile)
  const userProfile = useUserStore(state => state.userProfile)



  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    handleGetRow(rowIndex, 'select');
  };

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    handleGetRow(rowIndex, 'select');
  };

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <div onClick={(e) => {e.stopPropagation(); handleGetRow(rowIndex, 'select')}} className={`table-row hover:bg-gray-300 dark:hover:bg-neutral-950 ${rowIndex % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-slate-200/90 dark:bg-neutral-900'}`}>
        <div className="table-cell align-middle pl-1 py-[6px] text-center text-sm border-solid border-t-[1px] border-black/20 dark:border-gray-700/50">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onClick={handleCheckboxClick} 
            readOnly
            className="appearance-none w-4 h-4 align-middle bg-white dark:bg-gray-500 border-solid border-[1.4px] border-neutral-500 rounded-xl cursor-pointer checked:bg-blue-600 dark:checked:bg-blue-800 checked:border-blue-600 checked:bg-[url('../../public/icons/checkIcon.svg')] checked:bg-center checked:bg-cover"
          />
        </div>
        {Object.values(item).map((value, cellIndex) => (
          <div key={item["#"]} className={`table-cell align-middle px-3 py-[8px] text-base dark:text-slate-200 border-solid border-t-[1px] border-black/20 dark:border-gray-700/50 ${(cellIndex === 3 || cellIndex === 2 || cellIndex === 1) ? 'whitespace-nowrap' : ''} ${cellIndex === 0 ? 'font-semibold text-center pl-0' : ''}`}>{value}</div>
        ))}
        <div className='table-cell align-middle py-[4px] border-solid border-t-[1px] border-black/20 dark:border-gray-700/50'>
          <div className="flex gap-1 pr-3">
            {/* <button onClick={handlePrint} className='flex justify-center w-[24px] h-full'>
              <PrintIcon className='p-1 rounded-md transition-all hover:bg-neutral-50'/>
            </button> */}
            <EditButton handleGetRow={handleGetRow} rowIndex={rowIndex}/>
            {
              userProfile === 'Administrador' && (
                <DeleteButton handleGetRow={handleGetRow} rowIndex={rowIndex} rowToDelete={rowToDelete} cancelDelete={cancelDelete} confirmDeleteRow={confirmDeleteRow}/>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
