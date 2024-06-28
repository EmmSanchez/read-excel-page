'use client'
import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon, TableIcon } from "../../../../public/icons/icons";
import { useRouter } from "next/navigation"
import { useFileStore } from "@/app/store/fileStore";
import { useTheme } from "next-themes";
import { useState, useEffect, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import { useNavLinksStore } from "@/app/store/navLinks";

export function NavBar () {
  const setFile = useFileStore((state) => state.setFile) 
  const links = useNavLinksStore(state => state.links)
  const setLinks = useNavLinksStore(state => state.setLinks)
  const {theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname()

  useEffect(() => {
    setMounted(true);
    const storedNewLinks = sessionStorage.getItem('links')

    if (storedNewLinks){
      const newLinks = JSON.parse(storedNewLinks)

      setLinks(newLinks)
    }
  }, []);

  const router = useRouter()

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      router.push('/')
      setFile(null)
      setLinks([])
      sessionStorage.clear()
    } catch (error) {
      console.log(error);
    }

  }

  const iconMapping: { [key: string]: (props: SVGProps<SVGSVGElement>) => JSX.Element } = {
    'Dasboard': TableIcon,
    'Settings': SettingsIcon
  }
  

  return (
    <>
      <div className="flex justify-between items-center px-4 py-1 bg-gray-100 border-b-[1px] border-solid border-gray-200">
        <div className="">
          {
            links.map((link) => {
              return(
                <div key={link.name} className="font-bold">
                  {
                    pathname === link.href ? <p>{link.name}</p> : <></>
                  }
                </div>
              )
            })
          }
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="px-2">
            {
              theme === 'dark' ?
              <>
                <SunIcon />
              </>
              :
              <>
                <MoonIcon />  
              </>
            }
          </button>

         
              {
                links.map((link) => {
                  const LinkIcon = iconMapping[link.name]
                  return (
                    <Link 
                      key={link.name}
                      href={link.href}
                      className={`py-2 px-2 rounded-md ${pathname === link.href ? 'bg-[#2563EB]' : ''}`}
                    >
                      <LinkIcon className={`${pathname === link.href ? 'invert' : ''}`}/>
                    </Link>
                  )
                })
              }

          <button onClick={logout} className="px-2">
            <LogOutIcon className="invert dark:invert-0"/>
          </button>
        </div>
      </div>
    </>
  )
}
