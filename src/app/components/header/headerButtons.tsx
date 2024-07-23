import { ExportToExcelButton } from "../buttons/exportToExcelButton"
import { useFileStore } from "@/app/store/fileStore"
import { Dropzone } from "../dropzone/dropzone"
import { PrintButton } from "../buttons/printButton"
import { RefreshButton } from "../buttons/refreshButton"


export function HeaderButtons () {
  const file = useFileStore((state) => state.file)
  return (
    <>
      <div className="flex justify-between mx-4 flex-wrap">
        <div className="flex flex-wrap">
          <Dropzone />
          {
            file && (
              <>

                <ExportToExcelButton />
                {/* <PrintButton /> */}
              </>
            )
          }
        </div>
        <div className="flex">
          {
            file && (
              <RefreshButton />
            )
          }
        </div>
      </div>
    </>
  )
}