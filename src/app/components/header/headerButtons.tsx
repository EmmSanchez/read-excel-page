import { ExportToExcelButton } from "../buttons/exportToExcelButton"
import { useFileStore } from "@/app/store/fileStore"
import { useUserStore } from "@/app/store/userStore"
import { Dropzone } from "../dropzone/dropzone"
import { PrintButton } from "../buttons/printButton"


export function HeaderButtons () {
  const file = useFileStore((state) => state.file)
  const userProfile = useUserStore((state) => state.userProfile)

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