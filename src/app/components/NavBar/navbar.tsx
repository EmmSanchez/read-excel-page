'use client'
import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon, TableIcon } from "../../../../public/icons/icons";
import { useRouter } from "next/navigation";
import { useFileStore } from "@/app/store/fileStore";
import { useTheme } from "next-themes";
import { useState, useEffect, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import { useNavLinksStore } from "@/app/store/navLinks";

export function NavBar() {
  const setFile = useFileStore((state) => state.setFile);
  const links = useNavLinksStore(state => state.links);
  const setLinks = useNavLinksStore(state => state.setLinks);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const storedNewLinks = localStorage.getItem('links');

    if (storedNewLinks) {
      const newLinks = JSON.parse(storedNewLinks);
      setLinks(newLinks);
    }
  }, []);

  const router = useRouter();

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await router.push('/');
      setFile(null);
      localStorage.clear();
      setLinks([]);
    } catch (error) {
      console.log(error);
    }
  };

  const iconMapping: { [key: string]: (props: SVGProps<SVGSVGElement>) => JSX.Element } = {
    'Dashboard': TableIcon,
    'Settings': SettingsIcon
  };

  return (
    <div className="flex flex-grow justify-between items-center mx-4 my-4 px-4 py-2 bg-gray-200 border-solid border-[1px] border-gray-300 dark:bg-[#1D232C] dark:border-slate-800 rounded-lg">
      <div>
        {links.map((link) => (
          <div key={link.name} className="text-3xl text-gray-950 font-bold dark:text-white">
            {pathname === link.href ? <p>{link.name}</p> : null}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="px-2">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        {links.map((link) => {
          const LinkIcon = iconMapping[link.name];
          if (!LinkIcon) return null; // if there is no link
          return (
            <Link key={link.name} href={link.href} className={`py-2 px-2 rounded-md ${pathname === link.href ? 'bg-[#2563EB]' : ''}`}>
              <LinkIcon className={`${pathname === link.href ? 'invert' : ''}`} />
            </Link>
          );
        })}
        <button onClick={logout} className="px-2">
          <LogOutIcon className="invert dark:invert-0"/>
        </button>
      </div>
    </div>
  );
}
