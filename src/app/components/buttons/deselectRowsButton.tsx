import { XSquareIcon } from "../../../../public/icons/icons";

interface DeselectRowsButtonProps {
  selectedRows: number[]
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>
}

export function DeselectRowsButton ({selectedRows, setSelectedRows}: DeselectRowsButtonProps) {
  return (
    <>
      <button onClick={() => setSelectedRows([])} className="flex justify-center mb-4 items-center text-md rounded-md text-white bg-[#2563EB] cursor-pointer transition-all ease-in-out hover:bg-[#2564ebe5]">
        <XSquareIcon stroke="#fff"/>
      </button>
    </>
  );
}