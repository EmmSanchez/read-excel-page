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

  // SORT FUNCTION
  const sortArrayByColumn = (arr: ExcelData, column: string) => {
    if (arr) {
      const columnIndex = arr[0].indexOf(column);

      if (columnIndex === -1) {
        throw new Error(`La columna "${column}" no existe en los encabezados.`);
      }

      const dataCopy = [...arr];
      const sortedData = dataCopy.slice(1).sort((a, b) => {
        const aValue = a[columnIndex];
        const bValue = b[columnIndex];

        if (typeof aValue !== 'number' || typeof bValue !== 'number') {
          throw new Error(`Los valores en la columna "${column}" no son números.`);
        }

        return aValue - bValue;
      });

      return [dataCopy[0], ...sortedData];
    }

  };

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
        const sortedData = sortArrayByColumn(jsonData, '#') as ExcelData;
        setExcelData(sortedData)
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

    if(action === "cancel-edit") {
      setSelectedRows([])
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

  const filterColumns = (arr: ExcelData, columns: string[]) => {
    if (arr) {
      const headerRow = arr[0];
      const columnIndexes = columns.map(column => headerRow.indexOf(column));
      return arr.map(row => columnIndexes.map(index => row[index]));
    }
  };

  useEffect(() => {
    setSelectedRows([]);
    setRowToDelete(null);
    setIsPopoverVisible(false);
  
    if (!searchValue) {
      setFilteredExcelData(excelData ? filterColumns(excelData, ['#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', 'Edad', 'TBW', 'Agarre', 'Puntos', 'Salto', 'Puntos', 'Agilidad', 'Puntos', 'Resistencia', 'Puntos', 'Total']) as ExcelData : null);
    } else {
      const columnsToKeep = ['#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', 'Edad', 'TBW', 'Agarre', 'Puntos', 'Salto', 'Puntos', 'Agilidad', 'Puntos', 'Resistencia', 'Puntos', 'Total'];
      let filteredData: ExcelData | null = null;
  
      if (isID(searchValue)) {
        filteredData = excelData?.filter((row, index) => index === 0 || row[0]?.toString() === searchValue) as ExcelData;
      } else if (isRange(searchValue)) {
        const [start, end] = searchValue.split('-').map(Number);
        filteredData = excelData?.filter((row, index) => {
          if (index === 0) return true; // Keep header row
          const cellValue = Number(row[0]);
          return cellValue >= start && cellValue <= end;
        }) as ExcelData;
      } else if (isCustomSearch(searchValue)) {
        const ids = searchValue.split(',').map(Number);
        filteredData = excelData?.filter((row, index) => {
          if (index === 0) return true; // Keep header row
          const cellValue = Number(row[0]);
          return ids.includes(cellValue);
        }) as ExcelData;
      } else if (isName(searchValue)) {
        filteredData = excelData?.filter((row, index) => index === 0 || row[1]?.toString().toLowerCase().includes(searchValue.toLowerCase())) as ExcelData;
      }
  
      setFilteredExcelData(filteredData ? filterColumns(filteredData, columnsToKeep) as ExcelData : null);
    }
  }, [searchValue, excelData]);

  // TO DO LIST
  // - Print user
  // - Pagination to see 100 results



  return (
    <>
      {excelData ? (
        <>
          <div className="flex flex-col justify-start w-full my-4">
            <div className="flex w-full justify-center">
              <div className="flex h-14 mx-4 items-end w-full pr-2 gap-4">
                {/* SEARCHBAR */}
                <Searchbar handleSearchbar={handleSearchbar}/>
                {/* QUIT SELECTED ROW BUTTON */}
                {
                  selectedRows.length > 0 && (
                    <DeselectRowsButton selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>
                  )
                }

                {/* ADD - REMOVE */}
                <div className="flex h-full w-full justify-end gap-3 text-sm">
                  <AddRowButton selectedRows={selectedRows}/>
                  <RemoveRowsButton selectedRows={selectedRows} deleteSelectedRows={deleteSelectedRows} isPopoverVisible={isPopoverVisible} setIsPopoverVisible={setIsPopoverVisible}  
                  setRowToDelete={setRowToDelete}/>
                </div>
              </div>
            </div>
            

            {/* TABLE */}
            <div className="flex justify-start w-full">
              <div className='table table-auto m-3 mt-5 bg-slate-50 w-full rounded-md border-solid border-[1px] border-black/20 overflow-hidden'>
                <div className='table-header-group bg-[#2563EB]'>
                  <div className='table-row'>
                    <div className='table-cell pl-10 py-3'></div>
                    { filteredExcelData && (
                        <>
                          {
                            filteredExcelData[0].map((cell, index) => (
                              <div key={index} className={`table-cell align-middle px-3 py-3 text-base text-left font-medium text-blue-50 ${(index === 2 || index === 1) ? 'whitespace-nowrap' : '' } ${index === 0 ? 'text-center' : ''}`}>{cell}</div>
                            ))
                          }
                        </>
                      )
                    }
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
