import { DeselectIcon } from "../../../../public/icons/icons";

interface DeselectRowsButtonProps {
  selectedRows: number[]
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>
}

export function DeselectRowsButton ({selectedRows, setSelectedRows}: DeselectRowsButtonProps) {
  return (
    <>
      <button onClick={() => setSelectedRows([])} className="flex rounded-md">
        <p className="flex justify-center items-center w-9 h-9 rounded-full bg-blue-500 text-blue-50">{selectedRows.length}</p>
      </button>
    </>
  );
}