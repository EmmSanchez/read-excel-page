import { TrashIcon } from "../../../../public/icons/icons";

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
        <TrashIcon width={24} height={24} fill='#00890' className='p-1'/>
      </button>
      {rowToDelete === rowIndex && (
        <div className='fixed w-[30%] right-5 bottom-10 bg-zinc-50 shadow-lg rounded-md p-4 text-xs'>
          <div className="flex flex-col gap-2">
            <p>¿Estás seguro de que deseas eliminar este elemento?</p>
              <hr />
            <div className="flex justify-end gap-4">
              <button onClick={(e) => {e.stopPropagation(); cancelDelete()}} className="p-2 rounded-md hover:bg-gray-200">Cancelar</button>
              <button onClick={(e) => {e.stopPropagation(); confirmDeleteRow()}} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-800">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}