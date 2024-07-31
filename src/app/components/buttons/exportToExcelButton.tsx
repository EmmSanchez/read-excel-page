import * as XLSX from "xlsx"
import { FileSpreadsheetIcon } from "../../../../public/icons/icons"
import { useFileStore } from "@/app/store/fileStore"
import { useParticipantsDataStore } from "@/app/store/participants"
import { ParticipantData } from "@/app/types/ClientParticipant"

function convertParticipantsToArray(participants: ParticipantData[]): (string | number | null)[][] {
  const keys: (keyof ParticipantData)[] = [
    '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria',
    'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre',
    'Puntos', 'Salto', 'Puntos_1', 'Agilidad', 'Puntos_2', 'Resistencia', 'Puntos_3', 'Total'
  ];

  const headers: (keyof ParticipantData)[] = [
    '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria',
    'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre',
    'Puntos', 'Salto', 'Puntos', 'Agilidad', 'Puntos', 'Resistencia', 'Puntos', 'Total'
  ];

  const participantsArray: (string | number | null)[][] = [headers];

  participants.map(participant => {
    const values = keys.map(key => participant[key]);
    participantsArray.push(values);
  });

  return participantsArray;
}

export function ExportToExcelButton () {
  const participants = useParticipantsDataStore(state => state.participants)

  const file = useFileStore((state) => state.file)

  
  const handleExportToExcel = () => {
    if (participants && file) {
      const DataArray = convertParticipantsToArray(participants)
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(DataArray);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Ensure file.name is not null or undefined
      const fileName = file.name || 'excel_data'; // Default name if file.name is null or undefined
      XLSX.writeFile(workbook, `${fileName}`);
    }
  }

  

  return (
    <>
      <button onClick={handleExportToExcel} className="flex mb-4 sm:mt-[50px] h-11 items-center justify-around rounded-md bg-[#107C10] ml-4 px-4 py-2 gap-2 text-sm font-medium text-white drop-shadow-md hover:bg-[#0B6A0B]" >
        <FileSpreadsheetIcon/>
        <p>Exportar a Excel</p>
      </button>
    </>
  )
}