import { DeleteIcon } from "../../../../public/icons/icons";

interface DeleteButtonProps {
  handleGetRow: (rowIndex: number, action: string) => void;
  rowIndex: number;
  rowToDelete: number | null; 
  cancelDelete: () => void;
  confirmDeleteRow: () => void;
}

export function DeleteButton ({handleGetRow, rowIndex, rowToDelete, cancelDelete, confirmDeleteRow}: DeleteButtonProps) {
  return (
    <>
      <button className='w-[24px] h-full rounded-md transition-all hover:bg-zinc-50' onClick={(e) => {e.stopPropagation(); handleGetRow(rowIndex, 'delete')}}>
        <DeleteIcon width={24} height={24} fill='#00890' className='p-1'/>
      </button>
      {rowToDelete === rowIndex && (
        <div className='fixed w-[500px] text-base right-5 bottom-10 bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md p-4'>
          <div className="flex flex-col gap-4">
            <p>¿Estás seguro de que deseas eliminar este elemento?</p>
            <div className="flex justify-end gap-4">
              <button onClick={(e) => {e.stopPropagation(); cancelDelete()}} className="px-4 py-2 rounded-md text-lg border-[1px] border-solid border-[#cecbcb] hover:bg-gray-200">Cancelar</button>
              <button onClick={(e) => {e.stopPropagation(); confirmDeleteRow()}} className="bg-red-600 text-lg text-white px-4 py-2 rounded-md hover:bg-red-800">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}