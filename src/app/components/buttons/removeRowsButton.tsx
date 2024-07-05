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
      <button onClick={handleDeleteClick} disabled={selectedRows.length === 0} className={`w-[140px] px-4 py-[6px] rounded-md text-xl text-[#2563EB] dark:text-slate-100 font-semibold border-[1.4px] border-solid border-gray-300 dark:border-slate-700 transition-all ${selectedRows.length === 0 ? 'opacity-40 cursor-not-allowed' : 'dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
        <div className="flex justify-center items-center gap-1">
          <RemoveIcon fill={`${selectedRows.length === 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18} />
          <p className={`${selectedRows.length === 0  ? '' : 'dark:text-white'}`}>Eliminar</p>
        </div>
      </button>
      <div className="relative">

      <div className={`absolute w-[500px] -left-[500px] top-16 bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md p-4 text-base transition-all ease-in-out duration-100 transform ${isPopoverVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 pointer-events-none scale-[.98] -translate-y-1'}`}>
        <div className="flex flex-col gap-4">
          <p>¿Desea borrar los siguientes <span className="font-bold">{selectedRows.length} elementos?</span></p>
          <div className="flex justify-end gap-2">
            <button onClick={handleCancelClick} className='px-4 py-2 rounded-md text-lg border-[1px] border-solid border-[#cecbcb] hover:bg-gray-200'>Cancelar</button>
            <button onClick={handleConfirmDelete} className='bg-red-600 text-lg text-white px-4 py-2 rounded-md hover:bg-red-800'>Eliminar</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}