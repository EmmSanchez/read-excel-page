import { useState } from "react";
import { RemoveIcon } from "../../../../public/icons/icons";

interface RemoveRowsButtonProps {
  selectedRows: number[];
  deleteSelectedRows: () => void;
  isPopoverVisible: boolean;
  setIsPopoverVisible: React.Dispatch<React.SetStateAction<boolean>>
  setRowToDelete: React.Dispatch<React.SetStateAction<number | null>>
}

export function RemoveRowsButton({ selectedRows, deleteSelectedRows, isPopoverVisible, setIsPopoverVisible, setRowToDelete }: RemoveRowsButtonProps) {
  const handleDeleteClick = () => {
    if (selectedRows.length > 0) {
      setRowToDelete(null)
      setIsPopoverVisible(true);
    }
  };

  const handleCancelClick = () => {
    setIsPopoverVisible(false);
  };

  const handleConfirmDelete = () => {
    deleteSelectedRows();
    setIsPopoverVisible(false);
  };

  return (
    <>
      <button onClick={handleDeleteClick} disabled={selectedRows.length === 0} className={`w-[140px] px-4 py-[6px] rounded-md text-[#2563EB] font-semibold border-[1.4px] border-solid border-gray-300 transition-all ${selectedRows.length === 0 ? 'text-[#E2E8F0] cursor-not-allowed' : 'hover:bg-gray-100'}`}>
        <div className="flex justify-center items-start gap-1">
          <RemoveIcon fill={`${selectedRows.length === 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18} />
          <p>Eliminar</p>
        </div>
      </button>
      <div className="relative">

      <div className={`absolute w-[300px] -left-[300px] top-11 bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md p-4 text-xs transition-all ease-in-out duration-100 transform ${isPopoverVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 pointer-events-none scale-[.98] -translate-y-1'}`}>
        <div className="flex flex-col gap-4">
          <p>¿Desea borrar los siguientes <span className="font-bold">{selectedRows.length} elementos?</span></p>
          <div className="flex justify-end gap-2">
            <button onClick={handleCancelClick} className='p-2 rounded-md border-[1px] border-solid border-[#cecbcb] hover:bg-gray-200'>Cancelar</button>
            <button onClick={handleConfirmDelete} className='bg-red-600 text-white p-2 rounded-md hover:bg-red-800'>Eliminar</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}