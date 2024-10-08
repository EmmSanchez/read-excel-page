import { useFileStore } from "@/app/store/fileStore";
import React, {useState, useEffect, ChangeEvent} from "react";
import * as XLSX from "xlsx"
import { AddRowButton } from "../buttons/addRowButton";
import { RemoveRowsButton } from "../buttons/removeRowsButton";
import { Row } from "./row";
import { Searchbar } from "../searchbar/searchbar";
import { DeselectRowsButton } from "../buttons/deselectRowsButton";
import { useTableLoading } from "@/app/store/tableLoading";
import { useAgesStore } from "@/app/store/agesStore";
import { Range } from "@/app/dashboard/settings/page";
import { ArrowDropdwonIcon, AscArrow, ChevronLeft, ChevronRight, DescArrow, LoaderIcon } from "../../../../public/icons/icons";
import { useParticipantsDataStore } from "@/app/store/participants";
import { useFilteredParticipantsDataStore } from "@/app/store/filteredParticipants";
import { ParticipantData } from "@/app/types/ClientParticipant";
import { filteredParticipant } from "@/app/types/filteredParticipant";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useIsGetDataFetchFinished } from "@/app/store/getDataFinished";

const participantExample = [{
  '#': 1,
  'Apellido paterno': 'Apellido 1',
  'Apellido materno': 'Apellido 2',
  Nombre: 'Nombre 1',
  Prueba: 'Prueba',
  '# Empleado': '20',
  Edad: 30,
  Genero: 'HOMBRE',
  Categoria: '1',
  'Altura [cm]': 1.8,
  'Peso [kg]': 75,
  'Grasa [%]': 10,
  IMC: 10,
  'Cintura [cm]': 10,
  BMI: 10,
  BMR: 10,
  Fatmass: 10,
  FFM: 10,
  TBW: 10,
  Agarre: 10,
  Puntos: 10,
  Salto: 10,
  Puntos_1: 10,
  Agilidad: 10,
  Puntos_2: 10,
  Resistencia: '00:01:54.000',
  Puntos_3: 10,
  Total: 40
}]

type ExcelData = (string | number | boolean | null)[][] | null;

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

export function filterParticipantsValues(participantsToFilter: ParticipantData[]) {
  const newFilteredData = participantsToFilter.map(participant => ({
    "#": participant["#"],
    "Apellido paterno": participant["Apellido paterno"],
    "Apellido materno": participant["Apellido materno"],
    "Nombre": participant["Nombre"],
    "Prueba": participant["Prueba"],
    "Edad": participant["Edad"],
    "TBW": participant["TBW"],
    "Agarre": participant["Agarre"],
    "Puntos": participant["Puntos"],
    "Salto": participant["Salto"],
    "Puntos_1": participant["Puntos_1"],
    "Agilidad": participant["Agilidad"],
    "Puntos_2": participant["Puntos_2"],
    "Resistencia": participant["Resistencia"],
    "Puntos_3": participant["Puntos_3"],
    "Total": participant["Total"]
  }));
  return newFilteredData
}

export type ParticipantKeys = keyof filteredParticipant;  

type Participant = filteredParticipant | ParticipantData;

export function sortParticipantsByColumn(data: any[], column: ParticipantKeys, direction: 'asc' | 'desc') {
  const newData = data.sort((a: Participant, b: Participant) => {
    const aValue = a[column];
    const bValue = b[column];

    if (aValue === null || bValue === null || aValue === undefined || bValue === undefined) {
      return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const a = aValue.toString().trim();
      const b = bValue.toString().trim();
      return direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
  return newData;
}


const preventInvalidChars = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
    e.preventDefault();
  }
};

export function Table() {
  //FIXING
  const participants = useParticipantsDataStore(state => state.participants)
  const setParticipants = useParticipantsDataStore(state => state.setParticipants)

  const filteredParticipants = useFilteredParticipantsDataStore(state => state.filteredParticipants)
  const setFilteredParticipants = useFilteredParticipantsDataStore(state => state.setFilteredParticipants)
  // ---------------
  const file = useFileStore((state) => state.file);
  const setFile = useFileStore((state) => state.setFile);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([])  

  // deleteRowsPopover
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  // Searchbar
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const { replace } = useRouter()
  const [searchValue, setSearchValue] = useState<string>(searchParams.get('search') ? searchParams.get('search')!.toString() : '')

  // Sorting variables
  const [columnToSortIndex, setColumnToSortIndex] = useState<number>(searchParams?.get('sortIndex') ? parseInt(searchParams.get('sortIndex')!.toString()) : 0)
  const [columnToSort, setColumnToSort] = useState<string>(searchParams?.get('sort') ? searchParams.get('sort')!.toString() : '#')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(searchParams?.get('direction') ? (searchParams.get('direction')!.toString() === 'asc' ? 'asc': 'desc') : 'asc')

  // Manual Refresh
  const isTableLoading = useTableLoading((state) => state.isTableLoading)
  const isGetDataFetchFinished = useIsGetDataFetchFinished(state => state.isGetDataFetchFinished)

  // Get ranges to update total automatically
  const ageRanges = useAgesStore(state => state.ageRanges)
  
  async function sendToMongoDB(data: { [key: string]: any }[] | undefined, fileName: string, fileSize: number, ageRanges: Range[]) {
    try {
      const response = await fetch("/api/excelData/uploadData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({data, fileName, fileSize, ageRanges}),
      });

      if (!response.ok) {
        setFile(null)
        throw new Error("Failed to upload data");
      }

      if (response.ok) {
        const res = await response.json()
        const updatedParticipants = res.data
        setParticipants(updatedParticipants)
      }
    } catch (error) {
      console.error("Error uploading data to MongoDB:", error);
    }
  }

  const headers = ['#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', 'Edad', 'TBW', 'Agarre', 'Puntos', 'Salto', 'Puntos', 'Agilidad', 'Puntos', 'Resistencia', 'Puntos', 'Total']
  const TableHeaders = ['#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', 'Edad', 'TBW', 'Agarre', 'Puntos', 'Salto', 'Puntos_1', 'Agilidad', 'Puntos_2', 'Resistencia', 'Puntos_3', 'Total']

  // useEffect(() => {
  //   if (!searchValue) {
  //     if (!participants) return
  //     const newFilteredData = participants.map(participant => ({
  //       "#": participant["#"],
  //       "Apellido paterno": participant["Apellido paterno"],
  //       "Apellido materno": participant["Apellido materno"],
  //       "Nombre": participant["Nombre"],
  //       "Prueba": participant["Prueba"],
  //       "Edad": participant["Edad"],
  //       "TBW": participant["TBW"],
  //       "Agarre": participant["Agarre"],
  //       "Puntos": participant["Puntos"],
  //       "Salto": participant["Salto"],
  //       "Puntos_1": participant["Puntos_1"],
  //       "Agilidad": participant["Agilidad"],
  //       "Puntos_2": participant["Puntos_2"],
  //       "Resistencia": participant["Resistencia"],
  //       "Puntos_3": participant["Puntos_3"],
  //       "Total": participant["Total"]
  //     }));
  //     setFilteredParticipants(newFilteredData)
      
  //   }

  // }, [searchValue, participants])

  // CONVERT EXCEL TO JSON
  useEffect(() => {
    setPage(1)
    if (!file) {
      setParticipants(null)
      setFilteredParticipants(null)
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
          
          const sortedDataJSON = arrayToJSON(sortedData)
          const fileName = file.name
          const fileSize = file.size
          
          await sendToMongoDB(sortedDataJSON, fileName, fileSize, ageRanges);
        }
      };
      const fileRenamed = { _id: '', name:file.name, size: file.size} as unknown as File
      setFile(fileRenamed)
      setSearchValue('')
      setColumnToSort('#')
      setColumnToSortIndex(0)
      setSortDirection('asc')
      replace(`${pathName}`)
      reader.readAsArrayBuffer(file);
    }
    
    setSelectedRows([])
    setRowToDelete(null)
    setFilteredParticipants(null)
    setParticipantsPerPage(10)
  }, [file])
  
  
  // GET ROW INDEX WITH ACTION
  const handleGetRow = (id: number, action: string) => {
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
        if (prev?.includes(id)) {
          return prev.filter(index => index !== id); // Deselect if already selected
        } else {
          return [...prev, id]; // Select if not already selected
        }
      });
      
    }
    
    // DELETE A ROW WITH ROW TRASH BUTTON
    if(action === 'delete') {
      setSelectedRows([id])
      setRowToDelete(id)
      setIsPopoverVisible(false) // rows
    }

    if(action === "edit") {
      setSelectedRows([id])
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
    if (rowToDelete !== null && filteredParticipants && participants) {
        const rowToDeleteId = rowToDelete // Get ID to delete
        try {
          await deleteRowDB(rowToDeleteId)
          const newData = participants.filter((row, index) => row["#"] !== rowToDeleteId);
          setParticipants(newData)
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

  // DELETE MORE THAN 2 ROWS
  const deleteSelectedRows = async () => {
    if (!selectedRows || !participants || !filteredParticipants) return;
    const idsToDelete = selectedRows // Obtener los IDs de las filas a eliminar
    await deleteRowDB(idsToDelete)
    const newData = participants.filter((row, index) => !idsToDelete.includes(row["#"]!));
    setParticipants(newData)
    setSelectedRows([]);
    setRowToDelete(null);
  };

  // SEARCHING ------------------------------------------------------------------------------------------------------------------------------------------------
  const handleSearchbar = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    const newSearchValue = (e.target.value).trimStart()
    if (newSearchValue) {
      params.set('search', newSearchValue)
    } else {
      params.delete('search')
    }
    
    setSearchValue(newSearchValue)
    replace(`${pathName}?${params.toString()}`)
  }

  // Determine the type of search
  const isID = (value: string) => /^\d+$/.test(value); // ID is a number
  const isRange = (value: string) => /^\d+-\d+$/.test(value); // Range is in the form "num1-num2"
  const isName = (value: string) => !isID(value) && !isRange(value); // Anything else is a name
  const isCustomSearch = (value: string) => /^(\d+,)*\d+,?$/.test(value); // Custom search in the form "num1,num2,num3,..."
  
  useEffect(() => {
    setSelectedRows([]);
    setRowToDelete(null);
    setIsPopoverVisible(false);

    if (!participants) return
    const participantsCopy = [...participants]
    
    const sortedParticipants = sortParticipantsByColumn(participantsCopy, columnToSort as ParticipantKeys, sortDirection)
  
    if (!searchValue) {
      setFilteredParticipants(participants ? filterParticipantsValues(sortedParticipants) : null)
    } else {
      let filteredParticipants = sortedParticipants
      
      if (isID(searchValue)) {
        filteredParticipants = participantsCopy?.filter((row, index) => row["#"]?.toString() === searchValue);
      } else if (isRange(searchValue)) {
        const [start, end] = searchValue.split('-').map(Number);
        const participantsCopy = [...sortedParticipants]
        
        filteredParticipants = participantsCopy?.filter((row, index) => {
          const cellValue = Number(row["#"]);
          return cellValue >= start && cellValue <= end;
        });
        
      } else if (isCustomSearch(searchValue)) {
        const ids = searchValue.split(',').map(Number);

        filteredParticipants = participantsCopy?.filter((row, index) => {
          const cellValue = Number(row["#"]);
          return ids.includes(cellValue);
        });

      } else if (isName(searchValue)) {
        filteredParticipants = participantsCopy?.filter((row, index) => row.Nombre?.toString().toLowerCase().includes(searchValue.toLowerCase()));
      }
  
      console.log(filteredParticipants);
      setFilteredParticipants(filteredParticipants ? filterParticipantsValues(filteredParticipants) : null);
    }
  }, [searchValue, participants, ageRanges]);

  useEffect(() => {
    setPage(1)
    setInitialNumber(0)
    setFinalNumber(participantsPerPage)
  }, [searchValue])
  
  // PAGINATION ----------------------------------------------------------------------------------------------------------------------------------------------
  const [page, setPage] = useState<number>(1)
  const [initialNumber, setInitialNumber] = useState<number>(0)
  const [finalNumber, setFinalNumber] = useState<number>(10)
  const [participantsPerPage, setParticipantsPerPage] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number[]>([1])
  const [isSelectNumberFilter, setIsSelectNumberFilter] = useState<boolean>(false)


  const calculatePages = (users: number, participantsPerPage: number) => {
    let newTotalPages: number = users / participantsPerPage
    if (users % participantsPerPage > 0) {
      newTotalPages = Math.ceil(newTotalPages)
    }
    
    let array: number[] = []
    for (let index = 1; index <= newTotalPages; index++) {
      array.push(index)
    }
    
    return array
  }

  useEffect(() => {
    if (filteredParticipants?.length === undefined) return
    const newTotalUsers = filteredParticipants?.length
    const newTotalPages = calculatePages(newTotalUsers, participantsPerPage)
    setTotalPages(newTotalPages)
    
  }, [participantsPerPage, filteredParticipants])

  const handlePage = (action: string, pageNumber?: number) => {
    if (action === 'Next') {
      setInitialNumber(prev => prev + participantsPerPage)
      setFinalNumber(prev => prev + participantsPerPage)
      setPage(prev => prev + 1)
    }

    if (action === 'Previous') {
      setInitialNumber(prev => prev - participantsPerPage)
      setFinalNumber(prev => prev - participantsPerPage)
      setPage(prev => prev - 1)
    }

    if (pageNumber) {
      if (action === 'Select') {
        setPage(pageNumber)
        const newInitialNumber = (pageNumber - 1) * participantsPerPage
        setInitialNumber(newInitialNumber)
        const newFinalNumber = pageNumber * participantsPerPage
        setFinalNumber(newFinalNumber)
      }
    }
  }

  useEffect(() => {
    handlePage('Select', 1)
  }, [participantsPerPage])

  const toggleFilterDropdown = () => {
    setIsSelectNumberFilter(!isSelectNumberFilter)
  }

  // MOVE INTO PAGES
  const [initialPage, setInitialPage] = useState<number>(0)
  const [finalPage, setFinalPage] = useState<number>(5)

  useEffect(() => {
    if (totalPages.length <= 4) {
      setInitialPage(0)
      setFinalPage(totalPages.length)
    } else if (page <= 3) {
      setInitialPage(0)
      setFinalPage(4)
    } else if (page > totalPages.length - 3) {
      setInitialPage(totalPages.length - 4)
      setFinalPage(totalPages.length)
    } else {
      setInitialPage(page - 2)
      setFinalPage(page + 1)
    }
  }, [page, totalPages.length])

  const handleChangePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newPage = parseInt(e.target.value)

    if (!newPage || newPage === 0) {
      setPage(1);
      handlePage('Select', 1);
      return;
    }
    
    if (newPage > totalPages.length) {
      const fixedPage = totalPages.length
      setPage(fixedPage)
      handlePage('Select', fixedPage)
    } else {
      setPage(newPage)
      handlePage('Select', newPage)
    }
  }

  // SORTING -----------------------------------------------------------------------------------------------------------------------------------------

  const handleSortByHeader = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    e.preventDefault();
    
    // Update column to sort
    setColumnToSortIndex(index);
  
    setSortDirection((prev) => {
      // Manage the new direcion
      const newDirection = prev === 'asc' && columnToSortIndex === index ? 'desc' : 'asc';
      return newDirection;
    });
  
    // Update column name
    const column = TableHeaders[index] as ParticipantKeys;
    setColumnToSort(column);
  
    // Manange the pagination, return to page 1
    handlePage('Select', 1);
  };
  
  useEffect(() => {
    // Sort participants and create a copy of actual filteredParticipants to avoid unintentionally changes
    const filteredParticipantsCopy = filteredParticipants ? [...filteredParticipants] : null;
    if (filteredParticipantsCopy) {
      const sortedData = sortParticipantsByColumn(filteredParticipantsCopy, columnToSort as ParticipantKeys, sortDirection);
      setFilteredParticipants(sortedData);
    }

    // Params -------------------------------------------------
    const params = new URLSearchParams(searchParams);
  
    //params of sort header
    params.set('sort', columnToSort);
    // sortIndex
    params.set('sortIndex', columnToSortIndex.toString());
    // params to save sort direction
    params.set('direction', sortDirection);
    replace(`${pathName}?${params.toString()}`);
  
  }, [columnToSortIndex, columnToSort, sortDirection]);

  const createEmptyFile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const fileName = 'PlantillaNueva'
    const fileSize = 0
    const newFile = { _id:'', name: fileName, size: fileSize} as unknown as File
    setFile(newFile)
    setParticipants(participantExample)
    await sendToMongoDB(participantExample, fileName, fileSize, ageRanges);
  }
  
  return (
    <>
      {participants ? (
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
                      <div className="flex animate-pulse bg-gray-200 dark:bg-gray-800 h-full py-2 px-3 gap-4 border-solid border-[1px] border-gray-300 dark:border-gray-700 rounded-lg items-center outline outline-2 outline-transparent ">
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

                  {/* PAGINATION */}
                  <div className="grid grid-flow-row grid-cols-2 place-items-start lg:grid-flow-col lg:grid-cols-3 lg:items-end lg:place-items-stretch px-4 mt-5 mx-3 gap-1">
                    <div className={`relative animate-pulse w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded-md`}>
                    </div>

                    <div className="flex justify-center gap-1">
                      <div className="w-24 h-10 mr-2 p-2 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700 border-solid border-[1px] border-gray-300 dark:border-gray-600 transition-all"></div>
                      <button disabled className="w-[36px] p-2 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700 border-solid border-[1px] border-gray-300 dark:border-gray-600">
                      </button>
                      {
                        totalPages.length < 6 ? 
                          <>
                            {
                              totalPages.map((pageNumber, index) => {
                                return (
                                  <button disabled key={index} className={`w-[32px] px-3 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700 border-solid border-[1px] border-gray-300 dark:border-gray-600`}>
                                  </button>
                                )
                              })
                            }
                          </>
                          :
                          <>
                            { 
                              page > 3 &&
                              <>
                                <button disabled className={`w-[32px] px-3 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700 border-solid border-[1px] border-gray-300 dark:border-gray-600`}>
                                </button>
                                <p className="flex p-2 items-end tracking-widest">
                                  ...
                                </p>
                              </>

                            }
                            {
                              totalPages.slice(initialPage, finalPage).map((pageNumber, index) => {
                                return (
                                  <button disabled key={index} className={`w-[32px] px-3 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700 border-solid border-[1px] border-gray-300 dark:border-gray-600`}>
                                  </button>
                                )
                              })
                            }
                            {
                              page < (totalPages.length - 2) &&
                              <>
                                <p className="flex p-2 items-end tracking-widest">
                                  ...
                                </p>
                                <button disabled className={`w-[36px] px-3 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700 border-solid border-[1px] border-gray-300 dark:border-gray-600`}>
                                </button>
                              </>
                            }
                          </>
                      }
                      <button disabled className="w-[36px] p-2 rounded-md animate-pulse bg-gray-300 dark:bg-gray-700 border-solid border-[1px] border-gray-300 dark:border-gray-600">
                      </button>
                    </div>
                    <div className="flex justify-end items-end">
                      <p className="text-gray-500 dark:text-gray-200 text-[16px]">Cargando ...</p>
                    </div>
                  </div>

                  
                  {/* TABLE */}
                  <div className="flex justify-start w-full">
                    <div className='table table-auto m-3 mt-2 bg-slate-50 w-full rounded-md border-solid border-[1px] border-black/20 dark:bg-zinc-700 overflow-hidden'>
                      <div className='table-header-group bg-[#2563EB] dark:bg-neutral-950'>
                        <div className='table-row'>
                          <div className='table-cell pl-10 py-3'></div>
                          { filteredParticipants && (
                              <>
                                {
                                  headers.map((cell, index) => (
                                    <div key={index} className={`table-cell align-middle px-3 py-3 text-base text-left font-medium text-blue-200 dark:text-slate-200 ${(index === 2 || index === 1) ? 'whitespace-nowrap' : '' } ${index === 0 ? 'text-center' : ''}`}>{cell}</div>
                                  ))
                                }
                              </>
                            )
                          }
                          <div className='table-cell w-[60px] py-3'></div>
                        </div>
                      </div>
                      <div className='table-row-group'>
                        {filteredParticipants?.slice(initialNumber,finalNumber).map((item, rowIndex) => (
                            <div key={rowIndex} onClick={(e) => {e.stopPropagation(); handleGetRow(rowIndex, 'select')}} className={`table-row pointer-events-none ${rowIndex % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-slate-200/90 dark:bg-neutral-900'}`}>
                              <div className="table-cell align-middle pl-3 py-[6px] text-sm border-solid border-t-[1px] border-black/20">
                                <div className="animate-pulse w-4 h-4 align-middle bg-slate-400/80 rounded-xl"></div>
                              </div>
                              {Object.values(item).map((value, cellIndex) => (
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
                        <AddRowButton selectedRows={selectedRows} columnToSort={columnToSort} sortDirection={sortDirection}/>
                        <RemoveRowsButton selectedRows={selectedRows} deleteSelectedRows={deleteSelectedRows} isPopoverVisible={isPopoverVisible} setIsPopoverVisible={setIsPopoverVisible}  
                        setRowToDelete={setRowToDelete}/>
                      </div>
                    </div>
                  </div>
                  
                  {/* PAGINATION  */}
                  <div className="grid grid-flow-row grid-cols-2 place-items-start lg:grid-flow-col lg:grid-cols-3 lg:items-end lg:place-items-stretch px-4 mt-5 mx-3 gap-1">
                    <div
                      className={`relative w-16 bg-gray-200 dark:bg-gray-700 rounded-md ${
                        isSelectNumberFilter ? 'outline outline-[1.4px] -outline-offset-1 outline-[#2563eb]' : ''
                      }`}
                    >
                      <div className="dropdown-header" onClick={toggleFilterDropdown}>
                        <p className={`${participantsPerPage ? 'text-black dark:text-gray-100 text-sm font-normal' : ''}`}>
                          {participantsPerPage || 'Selecciona una opción'}
                        </p>
                        <span className={`dropdown-arrow transition-all ease-out dark:invert ${isSelectNumberFilter ? 'open' : ''}`}>
                          <ArrowDropdwonIcon />
                        </span>
                      </div>
                      <div
                        className={`dropdown-menu rounded-md transition-all duration-100 ease-in-out shadow-lg outline outline-1 outline-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800 ${
                          isSelectNumberFilter ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <div onClick={() => {setParticipantsPerPage(5); toggleFilterDropdown()}} className="dropdown-item"><p>5</p></div>
                        <div onClick={() => {setParticipantsPerPage(10); toggleFilterDropdown()}} className="dropdown-item"><p>10</p></div>
                        <div onClick={() => {setParticipantsPerPage(20); toggleFilterDropdown()}} className="dropdown-item"><p>20</p></div>
                        <div onClick={() => {setParticipantsPerPage(50); toggleFilterDropdown()}} className="dropdown-item"><p>50</p></div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-1">
                      <input type="number" value={page} onChange={(e) => handleChangePageInput(e)} min={1} max={totalPages.length} onKeyDown={preventInvalidChars} placeholder="Page" className="w-18 mr-2 p-2 rounded-md border-solid border-[1px] border-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 focus:hover:bg-transparent"/>
                      <button disabled={page === 1} onClick={() => handlePage('Previous')} className="p-2 rounded-md border-solid border-[1px] border-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent">
                        <ChevronLeft />
                      </button>
                      {
                        totalPages.length < 6 ? 
                          <>
                            {
                              totalPages.map((pageNumber, index) => {
                                return (
                                  <button onClick={() => handlePage('Select', pageNumber)} key={index} className={`px-3 rounded-md border-solid border-[1px] border-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 ${pageNumber === page ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                                    {pageNumber.toString()}
                                  </button>
                                )
                              })
                            }
                          </>
                          :
                          <>
                            { 
                              page > 3 &&
                              <>
                                <button onClick={() => handlePage('Select', totalPages[0])} className={`px-3 rounded-md border-solid border-[1px] border-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 ${totalPages[0] === page ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                                  {
                                    totalPages[0]
                                  }
                                </button>
                                <p className="flex p-2 items-end tracking-widest">
                                  ...
                                </p>
                              </>

                            }
                            {
                              totalPages.slice(initialPage, finalPage).map((pageNumber, index) => {
                                return (
                                  <button onClick={() => handlePage('Select', pageNumber)} key={index} className={`px-3 rounded-md border-solid border-[1px] border-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 ${pageNumber === page ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                                    {pageNumber.toString()}
                                  </button>
                                )
                              })
                            }
                            {
                              page < (totalPages.length - 2) &&
                              <>
                                <p className="flex p-2 items-end tracking-widest">
                                  ...
                                </p>
                                <button onClick={() => handlePage('Select', totalPages.length)} className={`px-3 rounded-md border-solid border-[1px] border-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 ${totalPages.length === page ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                                  {
                                    totalPages.length
                                  }
                                </button>
                              </>
                            }
                          </>
                      }
                      <button disabled={page === totalPages.length} onClick={() => handlePage('Next')} className="p-2 rounded-md border-solid border-[1px] border-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-transparent">
                        <ChevronRight />
                      </button>
                    </div>
                    <div className="flex justify-end items-end">
                      <p className="text-gray-500 dark:text-gray-200 text-[16px]">Mostrando {initialNumber + 1}-{page === totalPages.length ? filteredParticipants?.length : finalNumber} de {filteredParticipants?.length} resultados</p>
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="flex justify-start w-full">
                    <div className='table table-auto m-3 mt-2 w-full rounded-md border-solid border-[1px] border-black/20 dark:bg-zinc-700 overflow-hidden'>
                      <div className='table-header-group bg-[#2563EB] dark:bg-neutral-950'>
                        <div className='table-row'>
                          <div className='table-cell pl-10 py-3'></div>
                          { file && (
                              <>
                                {
                                  headers.map((value, index) => (
                                    <div key={index} onClick={(e) => handleSortByHeader(e, index)} className={`table-cell align-middle px-3 py-3 text-base text-left font-medium text-blue-200 dark:text-slate-200 hover:cursor-pointer hover:text-white ${(index === 2 || index === 1) ? 'whitespace-nowrap' : '' } ${index === 0 ? 'text-center' : ''}`}>
                                      <div className="flex items-center gap-1">
                                        <p className={`${columnToSortIndex === index ? 'text-white transition-all ease-in-out' : ''}`}>{value}</p>
                                        {
                                          columnToSortIndex === index && (
                                            <div className="flex flex-col h-[16px] gap-[2px]">
                                              <AscArrow stroke={`${sortDirection === 'asc' ? '#fff' : '#e2e8f0'}`} strokeWidth={sortDirection === 'asc' ? '2' : '1'}/>
                                              <DescArrow stroke={`${sortDirection === 'desc' ? '#fff' : '#e2e8f0'}`} strokeWidth={sortDirection === 'desc' ? '2' : '1'}/>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </div>
                                  ))
                                }
                              </>
                            )
                          }
                          <div className='table-cell w-[60px] py-3'></div>
                        </div>
                      </div>
                      <div className='table-row-group'>
                        {filteredParticipants?.slice(initialNumber, finalNumber).map((item, rowIndex) => (
                          <Row key={rowIndex} rowIndex={rowIndex} handleGetRow={handleGetRow} selectedRows={selectedRows} item={item} rowToDelete={rowToDelete} cancelDelete={cancelDelete} confirmDeleteRow={confirmDeleteRow} columnToSort={columnToSort} sortDirection={sortDirection}/>
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
          {
            !isGetDataFetchFinished ?
            <>
              <div className="flex mt-10 mx-4 justify-center ">
                <LoaderIcon className="w-12 h-12 animate-spin"/>
              </div>
            </>
            :
            <>
              <div className="flex justify-center items-center text-center mx-4 mt-4 h-fit flex-wrap">
                <div className="flex flex-col justify-center p-8 ">
                  <h2 className="text-3xl font-bold text-[#2564ebe5] dark:text-zinc-100">DESCARGA LA PLANTILLA</h2>
                  <p className="text-sm w-96 mt-2 self-center text-gray-500 dark:text-gray-300">Haz click en el siguiente botón para descargar el archivo de excel y empieza a editar, eliminar, añadir y configurar los datos.</p>
                  <div className="flex flex-col gap-2">
                    <button className="w-52 self-center mt-8 rounded-md bg-[#2564ebe5] text-blue-50 text-lg font-medium transition-all ease-in-out hover:bg-blue-800">
                      <a href='/files/Plantilla.xlsx' download='Plantilla.xlsx' className="flex w-full h-full justify-center py-3 rounded-md">Descargar plantilla</a>
                    </button>
                    <p>ó</p>
                    <button onClick={(e) => createEmptyFile(e)} className="w-52 self-center py-3 rounded-md text-[#2564ebe5] text-lg font-medium transition-all ease-in-out border-2 border-solid border-[#2564ebe5] hover:bg-blue-50 dark:hover:bg-zinc-900">Comenzar sin archivo</button>
                  </div>
                </div>
                <Image src='/images/dashboard_mockup_transparent.png' width={2880} height={1920} alt="Excel image example" className="w-[1000px] transition-all ease-in-out hover:scale-[98%]"/>
              </div>
            </>
          }

        </>
      )}
    </>
  );
}