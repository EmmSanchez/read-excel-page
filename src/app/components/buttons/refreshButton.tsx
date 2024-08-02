import { RefreshIcon } from "../../../../public/icons/icons";
import { useTableLoading } from "@/app/store/tableLoading";
import { useParticipantsDataStore } from "@/app/store/participants";

export function RefreshButton () {
  const setParticipants = useParticipantsDataStore(state => state.setParticipants)

  // Refres table
  const isTableLoading = useTableLoading((state) => state.isTableLoading)
  const setIsTableLoading = useTableLoading((state) => state.setIsTableLoading)

  const getParticipants = async () => {
    try {
      const response = await fetch('/api/excelData/getData/participants', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const {sortedParticipants} = await response.json();
        setParticipants(sortedParticipants)
      } else {
        console.error('Error al obtener los datos de participantes')
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  const refreshData = async () => {
    setIsTableLoading(true)
    await getParticipants()
    setIsTableLoading(false)
    // Guardar searchValue
    
  }

  return (
    <>
      <button onClick={() => refreshData()} className="flex mb-4 sm:mt-[50px] h-11 items-center justify-around rounded-md ml-4 px-4 py-2 gap-2 text-md font-medium text-gray-900 dark:text-slate-50 border-[1px] border-solid border-[#2564ebe5] hover:bg-gray-100 dark:hover:bg-slate-800">
        <div className={`${isTableLoading ? 'animate-spin' : ''}`}>
          <RefreshIcon className="dark:invert"/>
        </div>
        <p>Actualizar</p>
      </button>
    </>
  )
}