import { useSearchParams } from "next/navigation";
import { SearchIcon, InfoIcon } from "../../../../public/icons/icons"
import { useState, useRef, ChangeEvent } from "react";

interface SearchbarProps {
  handleSearchbar: (e: ChangeEvent<HTMLInputElement>) => void
}

export function Searchbar ({handleSearchbar}: SearchbarProps) {
  const searchParams = useSearchParams()


  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const hideTooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tooltipToggle = (action: string) => {
    if (action === "enter") {
      if (hideTooltipTimeoutRef.current) {
        clearTimeout(hideTooltipTimeoutRef.current);
      }
      setShowTooltip(true);
    } else if (action === "leave") {
      hideTooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 300);
    }
  };

  return (
    <>
      <div className="flex bg-gray-200 dark:bg-[#3B4758] h-full py-2 pl-3 gap-4 border-solid border-[1px] border-gray-300 dark:border-slate-800 rounded-lg items-center transition-all duration-300 ease-in-out outline outline-2 outline-transparent focus-within:outline-gray-400 focus-within:outline-offset-2 focus-within:bg-white dar">
        <SearchIcon width={14} height={14} stroke='#6c757d'/>
        <input type="text" placeholder="Buscar..." onChange={(e) => handleSearchbar(e)} defaultValue={searchParams.get('search')?.toString()} className="appearance-none w-72 bg-transparent text-lg text-gray-600 dark:text-gray-100 focus:outline-none placeholder:text-lg placeholder:text-gray-500 dark:placeholder:text-slate-300  placeholder:align-bottom"/>
        {/* TOOLTIP */}
        <InfoIcon width={12} height={12} stroke='#6c757d' onMouseEnter={() => tooltipToggle("enter")} onMouseLeave={() => tooltipToggle("leave")} className="hover:cursor-pointer" />
        <div onMouseEnter={() => tooltipToggle("enter")} onMouseLeave={() => tooltipToggle("leave")} className="relative">
          <div className={`absolute w-96 p-2 -top-14 left-2 text-sm bg-white dark:bg-zinc-900 rounded-md outline outline-gray-300 dark:outline-zinc-700 outline-1 drop-shadow-md transition-all ease-in-out duration-150 transform  ${showTooltip ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 pointer-events-none scale-[.98] -translate-x-1'}`}>
            <ul className="text-[12px] text-gray-600 dark:text-zinc-300">
              <li><span className="font-bold">ID:</span> Escribe un ID específico (e.g., &quot;5&quot;).</li>
              <li><span className="font-bold">Rango:</span> Escribe un rango de IDs (e.g., &quot;5-10&quot;).</li>
              <li><span className="font-bold">Nombre:</span> Escribe un nombre completo o parcial (e.g., &quot;Luis&quot;).</li>
              <li><span className="font-bold">Búsqueda personalizada:</span> Escribe varios IDs separados por comas (e.g., &quot;2,5,3&quot;).</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}