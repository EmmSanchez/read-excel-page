import { useFileStore } from "@/app/store/fileStore";
import { useDataStore } from "@/app/store/dataStore";
import React, {useState, useEffect, ChangeEvent} from "react";
import * as XLSX from "xlsx"
import { AddRowButton } from "../buttons/addRowButton";
import { RemoveRowsButton } from "../buttons/removeRowsButton";
import { Row } from "./row";
import { Searchbar } from "../searchbar/searchbar";
import { useFilteredDataStore } from "@/app/store/filteredData";
import { DeselectRowsButton } from "../buttons/deselectRowsButton";

type ExcelData = (string | number | boolean | null)[][] | null;

export function Table() {
  const file = useFileStore((state) => state.file);
  const excelData = useDataStore((state) => state.excelData)
  const setExcelData = useDataStore((state) => state.setExcelData)
  const filteredExcelData = useFilteredDataStore((state) => state.filteredExcelData)
  const setFilteredExcelData = useFilteredDataStore((state) => state.setFilteredExcelData)
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([])  

  // deleteRowsPopover
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  // Searchbar
  const [searchValue, setSearchValue] = useState<string>('')

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

    // DELETE A ROW WITH ROW TRASH BUTTON
    if(action === 'delete') {
      setSelectedRows([rowIndex])
      setRowToDelete(rowIndex)
      setIsPopoverVisible(false) // rows
    }

    if(action === "edit") {
      setSelectedRows([rowIndex])
      setRowToDelete(null)
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
  // - Print user
  // - Pagination to see 100 results

  return (
    <>
      {excelData ? (
        <>
          <div className="flex flex-col justify-start w-full my-11">
            <div className="flex items-end w-[1200px] mx-3 pr-2 gap-4">
              {/* SEARCHBAR */}
              <Searchbar handleSearchbar={handleSearchbar}/>
              {/* QUIT SELECTED ROW BUTTON */}
              {
                selectedRows.length > 0 && (
                  <DeselectRowsButton selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>
                )
              }

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
