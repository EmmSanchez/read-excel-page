import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export function ToggleTheme () {
  const {theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      { 
        mounted && (
          <div  className={`absolute w-[3vw] right-0 mr-[2vw] mt-[1vw] py-[.6vw] rounded-full hover:cursor-pointer ${theme === 'dark' ? 'bg-[#fff]' : 'bg-[#2b2b2b]'}`}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
            <div className="relative w-[3vw] h-[1.8vw]">
              <button 
                className='w-[3vw] h-full'
              >
                {theme === 'dark' ? 
                  <>
                    <Image  
                      src={'/icons/lightIcon.svg'}
                      alt='Habilidar Modo Obscuro'
                      layout='fill'
                      className='invert w-[3vw] h-[1.8vw]'
                    />
                  </>
                  : 
                  <>
                    <Image  
                      src={'/icons/darkIcon.svg'}
                      alt='Habilidar Modo Obscuro'
                      layout='fill'
                      className='w-[3vw] h-[1.8vw]'
                    />
                  </>
                }
              </button>
            </div>
          </div>
        )
      }
    </>
  )
}