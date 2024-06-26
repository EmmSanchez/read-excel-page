'use client'
import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon, TableIcon } from "../../../../public/icons/icons";
import { useFileStore } from "@/app/store/fileStore";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar () {
  const setFile = useFileStore((state) => state.setFile) 
  const {theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname()

  useEffect(() => {
    setMounted(true);
  }, []);


  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setFile(null)
    } catch (error) {
      console.log(error);
    }

  }

  const links = [
    {
      name: 'Dasboard', href: '/dashboard/table', icon: TableIcon
    },
    {
      name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon
    }
  ]

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
              const LinkIcon = link.icon
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
