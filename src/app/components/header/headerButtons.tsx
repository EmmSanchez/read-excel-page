import { ExportToExcelButton } from "../buttons/exportToExcelButton"
import { useFileStore } from "@/app/store/fileStore"
import { Dropzone } from "../dropzone/dropzone"
import { PrintButton } from "../buttons/printButton"


export function HeaderButtons () {
  const file = useFileStore((state) => state.file)
  return (
    <>
      <div className="flex w-[1200px]">
        <Dropzone />
        {
          file && (
            <>
              <ExportToExcelButton />
              <PrintButton />
            </>
          )
        }
      </div>
    </>
  )
}