import { ButtonPrintIcon } from "../../../../public/icons/icons"

export function PrintButton () {
  const handlePrint = () => {

  }

  return (
    <>
      <button className="flex mb-4 min-[848px]:mt-[50px] h-11 items-center justify-around rounded-md bg-[#2563EB] ml-4 px-4 py-2 gap-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-[#244488]" >
        <ButtonPrintIcon/>
        <p>Imprimir</p>
      </button>
    </>
  )
}