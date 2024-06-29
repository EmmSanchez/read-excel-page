import * as XLSX from "xlsx"
import { FileSpreadsheetIcon } from "../../../../public/icons/icons"
import { useDataStore } from "@/app/store/dataStore"

export function ExportToExcelButton () {
  const excelData = useDataStore((state) => state.excelData)

  const handleExportToExcel = () => {
    if (excelData) {
      const workbook = XLSX.utils.book_new()
      // transform array to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData)
      // Add sheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, 'datos.xlsx')
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