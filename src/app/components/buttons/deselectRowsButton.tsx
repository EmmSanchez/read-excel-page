import { DeselectIcon } from "../../../../public/icons/icons";

interface DeselectRowsButtonProps {
  selectedRows: number[]
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>
}

export function DeselectRowsButton ({selectedRows, setSelectedRows}: DeselectRowsButtonProps) {
  return (
    <>
      <button onClick={() => setSelectedRows([])} className="flex rounded-md hover:bg-gray-100">
        <DeselectIcon stroke="#fff"/>
      </button>
    </>
  );
}