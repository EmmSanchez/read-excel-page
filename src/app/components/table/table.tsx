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
import { RefreshIcon } from "../../../../public/icons/icons";
import { RefreshButton } from "../buttons/refreshButton";
import { useTableLoading } from "@/app/store/tableLoading";

type ExcelData = (string | number | boolean | null)[][] | null;

// SORT FUNCTION
export const sortArrayByColumn = (arr: ExcelData, column: string) => {
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

export function Table() {
  const file = useFileStore((state) => state.file);
  const setFile = useFileStore((state) => state.setFile);
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

  // Manual Refresh
  const isTableLoading = useTableLoading((state) => state.isTableLoading)
  const setIsTableLoading = useTableLoading((state) => state.setIsTableLoading)

  // -----------------------------------------------------------------------------------------------

  // USED TO FIX UPLOAD TO OR 3 TIMES DATA
  // useEffect(() => {
  //   setFile(null)
  // }, [])

  function arrayToJSON(data: ExcelData) {
    if (data) {
      const headers: string[] = data[0] as string[];
      const jsonData: { [key: string]: any }[] = [];
      for (let i = 1; i < data.length; i++) {
        let obj: { [key: string]: any } = {};
        for (let j = 0; j < headers.length; j++) {
          let propName = headers[j];
          // Check if the property already exists in the object
          if (obj.hasOwnProperty(propName)) {
            // Append an index to make the property name unique
            let index = 1;
            while (obj.hasOwnProperty(propName + '_' + index)) {
              index++;
            }
            propName = propName + '_' + index;
          }
          obj[propName] = data[i][j];
        }
        jsonData.push(obj);
      }
      return jsonData;
    }
  }
  
  async function sendToMongoDB(data: { [key: string]: any }[] | undefined, fileName: string, fileSize: number) {
    try {
      const response = await fetch("/api/excelData/uploadData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({data, fileName, fileSize}),
      });

      if (!response.ok) {
        throw new Error("Failed to upload data");
      }
    } catch (error) {
      console.error("Error uploading data to MongoDB:", error);
    }
  }

  // CONVERT EXCEL TO JSON
  useEffect(() => {
    if (!file) {
      setExcelData(null);
      setFilteredExcelData(null)
      return;
    }

    if (file.type) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result;
        if (result instanceof ArrayBuffer) {
          const data = new Uint8Array(result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as ExcelData;
          const sortedData = sortArrayByColumn(jsonData, '#') as ExcelData;
          setExcelData(sortedData)
          
          const sortedDataJSON = arrayToJSON(sortedData)
          const fileName = file.name
          const fileSize = file.size
          
          await sendToMongoDB(sortedDataJSON, fileName, fileSize);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    setSelectedRows([])
    setRowToDelete(null)
    setSearchValue('')
    setFilteredExcelData(null)  
  }, [file])
  
  
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

  // DELETE ENDPOINT
  const deleteRowDB = async (id: number | number[]) => {
    try {
      const response = await fetch('/api/excelData/editData/deleteRow', {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(id)
      })

      if (!response.ok) {
        throw new Error('Error al borrar fila o filas')
      }
      
    } catch (error) {
      console.error('Error al borrar en MongoDB', error)
    }
  }

  // DELETE ROW
  const confirmDeleteRow = async () => {
    if (rowToDelete !== null && filteredExcelData && excelData) {
        const rowToDeleteId = Number(filteredExcelData[rowToDelete + 1][0]) // Obtener el ID de la fila a eliminar
        try {
          const res = await deleteRowDB(rowToDeleteId)
          const newExcelData = excelData.filter((row, index) => index === 0 || row[0] !== rowToDeleteId) as ExcelData;
          setExcelData(newExcelData);
          setRowToDelete(null);
          setSelectedRows([]);
        } catch (error) {
          console.error('Error al eliminar fila(s)', error)
        }
    }
  };

  const cancelDelete = () => {
    setSelectedRows([])
    setRowToDelete(null);
  };
  // --------

  // DELETE MORE THAN 2 ROWS
  const deleteSelectedRows = async () => {
    if (!selectedRows || !excelData || !filteredExcelData) return;
    const idsToDelete = selectedRows.map(rowIndex => Number(filteredExcelData[rowIndex + 1][0])); // Obtener los IDs de las filas a eliminar
    const res = await deleteRowDB(idsToDelete)
    const newData = excelData.filter((row, index) => index === 0 || !idsToDelete.includes(Number(row[0]))) as ExcelData;
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
      // Mapa para mantener el recuento de las columnas duplicadas
      const columnCount = new Map<string, number>();
  
      // Encuentra los índices de las columnas teniendo en cuenta los duplicados
      const columnIndexes = columns.map((column, idx) => {
        let count = columnCount.get(column) || 0;
        let columnIndex = -1;
        let occurrence = 0;
  
        for (let i = 0; i < headerRow.length; i++) {
          if (headerRow[i] === column) {
            if (occurrence === count) {
              columnIndex = i;
              break;
            }
            occurrence++;
          }
        }
  
        columnCount.set(column, count + 1);
        return columnIndex;
      });
  
      return arr.map(row => columnIndexes.map(index => row[index]));
    }
  };
  

  const columnsToKeep = [
    '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', 'Edad',
    'TBW', 'Agarre', 'Puntos', 'Salto', 'Puntos', 'Agilidad', 'Puntos', 'Resistencia', 'Puntos', 'Total'
  ];

  useEffect(() => {
    
    setSelectedRows([]);
    setRowToDelete(null);
    setIsPopoverVisible(false);
  
    if (!searchValue) {
      setFilteredExcelData(excelData ? filterColumns(excelData, columnsToKeep) as ExcelData : null);

    } else {
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
            <>
              {
                isTableLoading ? 
                <>
                  {/* SKELETON */}
                  <div className="flex w-full justify-center">
                    <div className="flex items-center h-12 mx-4 w-full pr-5 gap-4">
                      {/* SEARCHBAR SKELETON*/}
                      <div className="flex animate-pulse bg-gray-200 h-full py-2 px-3 gap-4 border-solid border-[1px] border-gray-300 rounded-lg items-center outline outline-2 outline-transparent ">
                        <div className="animate-pulse bg-slate-400/80 w-[20px] h-[20px] rounded"></div>
                        <input disabled type="text" placeholder="" className="animate-pulse appearance-none w-72 bg-slate-400/80 rounded"/>
                        {/* TOOLTIP */}
                        <div className="animate-pulse bg-slate-400/80 w-[20px] h-[20px] rounded"></div>
                      </div>
                      {/* ADD - REMOVE */}
                      <div className="flex h-full w-full justify-end gap-3 text-sm">
                      <button disabled className={`pointer-events-none h-full w-[140px] px-4 py-[6px] rounded-md border-[1.4px] border-solid border-gray-300`}>
                        <div className="flex justify-center items-center gap-1">
                          <div className="animate-pulse bg-slate-400/80 w-[18px] h-[18px] rounded"></div>
                          <div className="animate-pulse w-full h-[18px] bg-slate-400/80 rounded"></div>
                        </div>
                      </button>
                      <button disabled className={`pointer-events-none h-full w-[140px] px-4 py-[6px] rounded-md border-[1.4px] border-solid border-gray-300`}>
                        <div className="flex justify-center items-center gap-1">
                          <div className="animate-pulse bg-slate-400/80 w-[18px] h-[18px] rounded"></div>
                          <div className="animate-pulse w-full h-[18px] bg-slate-400/80 rounded"></div>
                        </div>
                      </button>
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
                            <div key={rowIndex} onClick={(e) => {e.stopPropagation(); handleGetRow(rowIndex, 'select')}} className={`table-row pointer-events-none ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-200/90'}`}>
                              <div className="table-cell align-middle pl-3 py-[6px] text-sm border-solid border-t-[1px] border-black/20">
                                <div className="animate-pulse w-4 h-4 align-middle bg-slate-400/80 rounded-xl"></div>
                              </div>
                              {row.map((cell, cellIndex) => (
                                <div key={cellIndex} className={`animate-pulse table-cell align-middle px-3 py-[16px] text-base border-solid border-t-[1px] border-black/20 ${(cellIndex === 3 || cellIndex === 2 || cellIndex === 1) ? 'whitespace-nowrap' : ''} ${cellIndex === 0 ? 'font-semibold text-center pl-0' : ''}`}>
                                  <div className="h-2 bg-slate-400/80 rounded">
                                  </div>
                                </div>
                              ))}
                              <div className='table-cell align-middle py-[4px] border-solid border-t-[1px] border-black/20'>
                                <div className="animate-pulse flex gap-1 pr-3">
                                  <div className="p-2 rounded-md bg-slate-400/80"></div>
                                  <div className="p-2 rounded-md bg-slate-400/80"></div>
                                  <div className="p-2 rounded-md bg-slate-400/80"></div>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
                :
                <>
                  <div className="flex w-full justify-center">
                    <div className="flex items-center h-12 mx-4 w-full pr-2 gap-4">
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
                </>
              }
            </>

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
