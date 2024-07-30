import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedData';
import FileInfoModel from '@/models/fileInfo';
import connectDB from '@/app/lib/mongodb';
export const dynamic = 'force-dynamic'

interface Participant {
  '#': number;
  'Apellido paterno': string;
  'Apellido materno': string;
  'Nombre': string;
  'Prueba': string;
  '# Empleado': number;
  'Edad': number;
  'Genero': string;
  'Categoria': string;
  'Altura [cm]': number;
  'Peso [kg]': number;
  'Grasa [%]': number;
  'IMC': number;
  'Cintura [cm]': number;
  'BMI': number;
  'BMR': number;
  'Fatmass': number;
  'FFM': number;
  'TBW': number;
  'Agarre': number;
  'Puntos': number;
  'Salto': number;
  'Puntos_1': number;
  'Agilidad': number;
  'Puntos_2': number;
  'Resistencia': number;
  'Puntos_3': number;
  'Total': number;
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();

    // Get sorted participants object
    let sortedParticipants;
    try {
      sortedParticipants = await ParticipantModel.find().sort({ '#': 1 })
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      return NextResponse.json({ error: 'Error al obtener participantes' }, { status: 500 });
    }

    // Get file's info
    let fileInfoArray;
    try {
      fileInfoArray = await FileInfoModel.find();
    } catch (error) {
      console.error('Error al obtener información del archivo:', error);
      return NextResponse.json({ error: 'Error al obtener información del archivo' }, { status: 500 });
    }

    // Verify if there is data, if not, the var is null and works in client -> (!fileInfoArray)
    if (!fileInfoArray || fileInfoArray.length === 0) {
      return NextResponse.json({ error: 'No se encontró información del archivo' }, { status: 404 });
    }

    return NextResponse.json({ sortedParticipants, fileInfoArray });

  } catch (error) {
    console.error('Error al obtener datos desde MongoDB:', error);
    return NextResponse.json({ error: 'Error al obtener datos desde MongoDB' }, { status: 500 });
  }
}