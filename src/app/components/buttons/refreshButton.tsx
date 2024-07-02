import { useDataStore } from "@/app/store/dataStore";
import { RefreshIcon } from "../../../../public/icons/icons";
import { useFilteredDataStore } from "@/app/store/filteredData";
import { useTableLoading } from "@/app/store/tableLoading";

export function RefreshButton () {
  const setExcelData = useDataStore((state) => state.setExcelData)
  const setFilteredExcelData = useFilteredDataStore((state) => state.setFilteredExcelData)

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
        next: { revalidate: 5 }
      });

      if (response.ok) {
        const {participantsArray} = await response.json();
        setExcelData(participantsArray)
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
  }

  return (
    <>
      <button onClick={() => refreshData()} className="flex mb-4 sm:mt-[50px] h-11 items-center justify-around rounded-md ml-4 px-4 py-2 gap-2 text-md font-medium text-[#2564ebe5] border-[1px] border-solid border-[#2564ebe5] hover:bg-gray-100">
        <div className={`${isTableLoading ? 'animate-spin' : ''}`}>
          <RefreshIcon/>
        </div>
        <p>Actualizar</p>
      </button>
    </>
  )
}