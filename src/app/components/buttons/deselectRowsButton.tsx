interface DeselectRowsButtonProps {
  selectedRows: number[]
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>
}

export function DeselectRowsButton ({selectedRows, setSelectedRows}: DeselectRowsButtonProps) {
  return (
    <>
      <button onClick={() => setSelectedRows([])} className="flex justify-center items-center text-xs h-full w-60 rounded-md text-white bg-[#2563EB] cursor-pointer transition-all ease-in-out hover:bg-[#2564ebe5]">
        <p className="">Deseleccionar todo</p>
      </button>
    </>
  );
}