import { RemoveIcon } from "../../../../public/icons/icons"

interface RemoveRowsButtonProps {
  selectedRows: number[];
  deleteSelectedRows: () => void
}

export function RemoveRowsButton ({selectedRows, deleteSelectedRows}: RemoveRowsButtonProps) {
  return (
    <>
      <button popoverTarget='deleteRows-popover' disabled={selectedRows.length === 0} className={`px-4 py-[6px] rounded-md text-[#2563EB] font-semibold border-[1.4px] border-solid border-[#E2E8F0] transition-all ${selectedRows.length === 0 ? 'text-[#E2E8F0] cursor-not-allowed' : 'hover:bg-gray-100'}`}>
        <div className="flex justify-center items-start gap-1">
          <RemoveIcon fill={`${selectedRows.length === 0 ? '#E2E8F0' : '#2563EB'}`} width={18} height={18}/>
          <p>Eliminar</p>
        </div> 
      </button>
      <div id='deleteRows-popover' popover='auto' className="w-[400px] gap-2 bottom-[20%] bg-zinc-50 shadow-lg rounded-md p-4 text-xs">
        <div className="flex flex-col gap-2">
          <p>¿Desear borrar los siguientes <span className="font-bold">{selectedRows.length} elementos?</span></p>
          <hr />
          <div className="flex justify-end gap-2">
            <button popoverTarget='deleteRows-popover' popoverTargetAction='hide' className='p-2 rounded-md hover:bg-gray-200'>Cancelar</button>
            <button popoverTarget='deleteRows-popover' popoverTargetAction='hide' onClick={deleteSelectedRows} className='bg-red-600 text-white p-2 rounded-md hover:bg-red-800'>Eliminar</button>
          </div>
        </div>
      </div>
    </>
  )
}