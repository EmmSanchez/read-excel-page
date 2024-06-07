import { PrintIcon, EditIcon } from "../../../../public/icons/icons";
import { DeleteButton } from "../buttons/deleteButton";
import React from "react";
import { EditButton } from "../buttons/editeButton";

interface RowProps {
  rowIndex: number; 
  handleGetRow: (rowIndex: number, action: string) => void; 
  selectedRows: number[]
  row: (string | number | boolean | null)[]
  rowToDelete: number | null;
  cancelDelete: () => void;
  confirmDeleteRow: () => void
}

export function Row ({rowIndex, handleGetRow, selectedRows, row, rowToDelete, cancelDelete, confirmDeleteRow}: RowProps) {
  const isSelected = selectedRows.includes(rowIndex);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    handleGetRow(rowIndex, 'select');
  };

  return (
    <>
      <div onClick={(e) => {e.stopPropagation(); handleGetRow(rowIndex, 'select')}} className='table-row hover:bg-gray-200'>
        <div className="table-cell align-middle pl-1 py-[6px] text-center text-sm border-solid border-t-[1px] border-black/20">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={handleCheckboxChange} 
            className="appearance-none w-4 h-4 align-middle border-solid border-[1.4px] border-zinc-500 rounded-xl cursor-pointer checked:bg-blue-600 checked:border-blue-600 checked:bg-[url('../../public/icons/checkIcon.svg')] checked:bg-center checked:bg-cover"
          />
        </div>
        {row.map((cell, cellIndex) => (
          <div key={cellIndex} className='table-cell align-middle px-4 py-[6px] text-sm border-solid border-t-[1px] border-black/20'>{cell}</div>
        ))}
        <div className='table-cell align-middle py-[4px] border-solid border-t-[1px] border-black/20'>
          <div className="flex gap-1 pr-3">
            <button className='w-[24px] h-full'>
              <PrintIcon fill="#00890" className='p-1 rounded-md transition-all hover:bg-zinc-50'/>
            </button>
            <EditButton handleGetRow={handleGetRow} rowIndex={rowIndex}/>
            <DeleteButton handleGetRow={handleGetRow} rowIndex={rowIndex} rowToDelete={rowToDelete} cancelDelete={cancelDelete} confirmDeleteRow={confirmDeleteRow}/>
          </div>
        </div>
      </div>
    </>
  )
}
