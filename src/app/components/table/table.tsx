import { useFileStore } from "@/app/store/fileStore";
import { useDataStore } from "@/app/store/dataStore";
import React, {useState, useEffect, useRef, ChangeEvent} from "react";
import * as XLSX from "xlsx"
import { InfoIcon, SearchIcon } from "../../../../public/icons/icons";
import { AddRowButton } from "../buttons/addRowButton";
import { RemoveRowsButton } from "../buttons/removeRowsButton";
import { Row } from "./row";

type ExcelData = (string | number | boolean | null)[][] | null;

export function Table() {
  const file = useFileStore((state) => state.file);
  const excelData = useDataStore((state) => state.excelData)
  const setExcelData = useDataStore((state) => state.setExcelData)
  const [filteredExcelData ,setFilteredExcelData] = useState<ExcelData>(null)
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([])  

  // deleteRowsPopover
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  // tooltip
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  // Searchbar
  const [searchValue, setSearchValue] = useState<string>('')
  const hideTooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // -----------------------------------------------------------------------------------------------

  // CONVERT EXCEL TO JSON
  useEffect(() => {
    if (!file) {
      setExcelData(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as ExcelData;
        setExcelData(jsonData);
      }
    };
    reader.readAsArrayBuffer(file);
    setSelectedRows([])
    setRowToDelete(null)
    setSearchValue('')
    setFilteredExcelData(null)
  }, [file, setExcelData])

  // GET ROW INDEX WITH ACTION
  const handleGetRow = (rowIndex: number, action: string) => {
    if(!action) return

    // IF ROWTODELETE HAS A NUMBER AND YOU CLICK OTHER ROW, THE ROWTODELETE WILLNOT BE SELECTED
    if (rowToDelete) {
      setSelectedRows([])
    }

    // SELECT 1 OR MORE ROWS
    if (action === 'select') {
      setIsPopoverVisible(false)
      setRowToDelete(null)
      setSelectedRows(prev => {
        if (prev?.includes(rowIndex)) {
          return prev.filter(index => index !== rowIndex); // Deselect if already selected
        } else {
          return [...prev, rowIndex]; // Select if not already selected
        }
      });
    }

    // DELETE A WITH ROW TRASH BUTTON
    if(action === 'delete') {
      setSelectedRows([rowIndex])
      setRowToDelete(rowIndex)
      setIsPopoverVisible(false) // rows
    }
  };

  // DELETE ROW
  const confirmDeleteRow = () => {
    if (rowToDelete !== null && filteredExcelData && excelData) {
        const rowToDeleteId = filteredExcelData[rowToDelete + 1][0]; // Obtener el ID de la fila a eliminar
        const newExcelData = excelData.filter((row, index) => index === 0 || row[0] !== rowToDeleteId) as ExcelData;
        setExcelData(newExcelData);
        setRowToDelete(null);
        setSelectedRows([]);
    }
};

  const cancelDelete = () => {
    setSelectedRows([])
    setRowToDelete(null);
  };
  // --------

  // DELETE MORE THAN 2 ROWS
  const deleteSelectedRows = () => {
    if (!selectedRows || !excelData || !filteredExcelData) return;
    const idsToDelete = selectedRows.map(rowIndex => filteredExcelData[rowIndex + 1][0]); // Obtener los IDs de las filas a eliminar
    const newData = excelData.filter((row, index) => index === 0 || !idsToDelete.includes(row[0])) as ExcelData;
    setExcelData(newData);
    setSelectedRows([]);
    setRowToDelete(null);
};

  const handleSearchbar = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newSearchValue = (e.target.value).trimStart()
    setSearchValue(newSearchValue)
  }

  // Determine the type of search
  const isID = (value: string) => /^\d+$/.test(value); // ID is a number
  const isRange = (value: string) => /^\d+-\d+$/.test(value); // Range is in the form "num1-num2"
  const isName = (value: string) => !isID(value) && !isRange(value); // Anything else is a name
  const isCustomSearch = (value: string) => /^(\d+,)*\d+,?$/.test(value); // Custom search in the form "num1,num2,num3,..."

  useEffect(() => {
    setSelectedRows([])
    setRowToDelete(null)
    setIsPopoverVisible(false)

    if (!searchValue) {
      setFilteredExcelData(excelData);
    } else {
      if (isID(searchValue)) {
        const filteredExcelData = excelData?.filter((row, index) => index === 0 || row[0]?.toString() === searchValue) as ExcelData
        setFilteredExcelData(filteredExcelData)

      } else if (isRange(searchValue)) {
        const [start, end] = searchValue.split('-').map(Number);
        const filteredExcelData = excelData?.filter((row, index) => {
            if (index === 0) return true; // Keep header row
            const cellValue = Number(row[0]);
            return cellValue >= start && cellValue <= end;
        }) as ExcelData;
        setFilteredExcelData(filteredExcelData);

      } else if (isCustomSearch(searchValue)) {
        const ids = searchValue.split(',').map(Number);
        const filteredExcelData = excelData?.filter((row, index) => {
            if (index === 0) return true; // Keep header row
            const cellValue = Number(row[0]);
            return ids.includes(cellValue);
        }) as ExcelData;
        setFilteredExcelData(filteredExcelData);
        
      } else if (isName(searchValue)) {
        const filteredExcelData = excelData?.filter((row, index) => index === 0 || row[1]?.toString().toLowerCase().includes(searchValue.toLowerCase())) as ExcelData;
        setFilteredExcelData(filteredExcelData);
      }
    }
  },[searchValue, excelData])

  // TO DO LIST
  // - Edit rows
  // - Export to excel
  // - Print user
  // - Pagination

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
      {excelData ? (
        <>
          <div className="flex flex-col justify-start w-full my-11">
            <div className="flex w-[1200px] mx-3 pr-2 ">
              {/* SEARCHBAR */}
              <div className="flex bg-gray-200 py-2 pl-3 gap-4 border-solid border-[1px] border-gray-300 rounded-lg items-center transition-all duration-300 ease-in-out outline outline-2 outline-transparent focus-within:outline-gray-400 focus-within:outline-offset-2 focus-within:bg-white">
                <SearchIcon width={14} height={14} stroke='#6c757d'/>
                <input type="text" placeholder="Buscar..." onChange={(e) => handleSearchbar(e)} className="appearance-none w-72 bg-transparent text-sm text-gray-600 focus:outline-none placeholder:text-sm placeholder:text-gray-500"/>
                {/* TOOLTIP */}
                <InfoIcon width={12} height={12} stroke='#6c757d' onMouseEnter={() => tooltipToggle("enter")} onMouseLeave={() => tooltipToggle("leave")} className="hover:cursor-pointer" />
                <div onMouseEnter={() => tooltipToggle("enter")} onMouseLeave={() => tooltipToggle("leave")} className="relative">
                  <div className={`absolute w-96 p-2 -top-14 left-2 text-sm bg-white rounded-md outline outline-gray-300 outline-1 drop-shadow-md transition-all ease-in-out duration-150 transform  ${showTooltip ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 pointer-events-none scale-[.98] -translate-x-1'}`}>
                    <ul className="text-[12px] text-gray-600">
                      <li><span className="font-bold">ID:</span> Escribe un ID específico (e.g., &quot;5&quot;).</li>
                      <li><span className="font-bold">Rango:</span> Escribe un rango de IDs (e.g., &quot;5-10&quot;).</li>
                      <li><span className="font-bold">Nombre:</span> Escribe un nombre completo o parcial (e.g., &quot;Luis&quot;).</li>
                      <li><span className="font-bold">Búsqueda personalizada:</span> Escribe varios IDs separados por comas (e.g., &quot;2,5,3&quot;).</li>
                    </ul>
                  </div>
                </div>
                  
              </div>
              {/* ADD - REMOVE */}
              <div className="flex w-full justify-end gap-3 text-sm">
                <AddRowButton selectedRows={selectedRows}/>
                <RemoveRowsButton selectedRows={selectedRows} deleteSelectedRows={deleteSelectedRows} isPopoverVisible={isPopoverVisible} setIsPopoverVisible={setIsPopoverVisible}  
                setRowToDelete={setRowToDelete}/>
              </div>
            </div>
            

            {/* TABLE */}
            <div className='table table-auto m-3 bg-slate-50 w-[1200px] rounded-md border-solid border-[1px] border-black/20 overflow-hidden'>
              <div className='table-header-group bg-slate-200/90'>
                <div className='table-row'>
                  <div className='table-cell py-3'></div>
                  {excelData[0].map((cell, index) => (
                    <div key={index} className='table-cell py-3 px-3 text-sm text-left font-semibold'>{cell}</div>
                  ))}
                  <div className='table-cell w-[60px] py-3'></div>
                </div>
              </div>
              <div className='table-row-group'>
                {filteredExcelData?.slice(1).map((row, rowIndex) => (
                  <Row key={rowIndex} rowIndex={rowIndex} handleGetRow={handleGetRow} selectedRows={selectedRows} row={row} rowToDelete={rowToDelete} cancelDelete={cancelDelete} confirmDeleteRow={confirmDeleteRow}/>
                ))}
              </div>
            </div>

          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col m-4">
            <h1>Pasos a Seguir</h1>
            <p>Haz click en el botón superior e inserta un archivo de excel</p>
          </div>
        </>
      )}
    </>
  );
}
