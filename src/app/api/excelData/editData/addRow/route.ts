import ParticipantModel from "@/models/uploadedData";
import { NextRequest, NextResponse } from "next/server";

function arrayToJSON(data: (string | number | null)[]) {
  if (data) {
    const headers: string[] = [ '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria',
    'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre',
    'Puntos', 'Salto', 'Puntos_1', 'Agilidad', 'Puntos_2', 'Resistencia', 'Puntos_3', 'Total' ];
    const jsonData: { [key: string]: any }[] = [];
    for (let i = 0; i < 1; i++) {
      let obj: { [key: string]: any } = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = data[j];
      }
      jsonData.push(obj);
    }
    return jsonData;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { row } = await req.json()
    if(!row) return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });

    const dataToJSON = arrayToJSON(row)
    const res = await ParticipantModel.insertMany(dataToJSON)  
  
    if (!res) {
      return NextResponse.json({ message: "Hubo algún problema al subir" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Añadido correctamente'}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error al subir'}, { status: 400 })
  }
}