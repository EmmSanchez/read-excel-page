import * as XLSX from "xlsx"
import { FileSpreadsheetIcon } from "../../../../public/icons/icons"
import { useDataStore } from "@/app/store/dataStore"
import { useFileStore } from "@/app/store/fileStore"
import { useParticipantsDataStore } from "@/app/store/participants"

export function ExportToExcelButton () {
  const excelData = useDataStore((state) => state.excelData)
  const participants = useParticipantsDataStore(state => state.participants)

  const file = useFileStore((state) => state.file)

  
  const handleExportToExcel = () => {
    if (excelData && file) {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Ensure file.name is not null or undefined
      const fileName = file.name || 'excel_data'; // Default name if file.name is null or undefined
      XLSX.writeFile(workbook, `${fileName}`);
    }
  }

  

  return (
    <>
      <button onClick={handleExportToExcel} className="flex mb-4 sm:mt-[50px] h-11 items-center justify-around rounded-md bg-[#107C10] ml-4 px-4 py-2 gap-2 text-sm font-medium text-white drop-shadow-md hover:bg-[#0B6A0B]" >
        <FileSpreadsheetIcon/>
        <p>Exportar a Excel</p>
      </button>
    </>
  )
}