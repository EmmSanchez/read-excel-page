import { ExportToExcelButton } from "../buttons/exportToExcelButton"
import { useFileStore } from "@/app/store/fileStore"
import { useUserStore } from "@/app/store/userStore"
import { Dropzone } from "../dropzone/dropzone"
import { PrintButton } from "../buttons/printButton"
import { LogOutIcon } from "../../../../public/icons/icons"
import { useRouter } from "next/navigation"
import { ToggleTheme } from "../toggle/toggleTheme"


export function HeaderButtons () {
  const file = useFileStore((state) => state.file)
  const setFile = useFileStore((state) => state.setFile)
  
  const userProfile = useUserStore((state) => state.userProfile)
  const router = useRouter()

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setFile(null)

      router.push('/')
    } catch (error) {
      console.log(error);
      router.push('/')
    }

  }

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
        {
          userProfile && (
            <>
              <div className="absolute right-28 top-7">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-600 px-4 py-1 rounded-md">
                    <p className="text-gray-100 font-semibold">{userProfile}</p>
                  </div>
                  <div className="">
                    <button onClick={() => logout()} className="flex items-center">
                      <LogOutIcon className="invert dark:invert-0"/>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )
        }
        <ToggleTheme />
      </div>
    </>
  )
}