"use server"
import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedData';
import FileInfoModel from '@/models/fileInfo';
import connectDB from '@/app/lib/mongodb';


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

function convertParticipantsToArray(participants: Participant[]): (string | number)[][] {
  const keys: (keyof Participant)[] = [
    '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria',
    'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre',
    'Puntos', 'Salto', 'Puntos_1', 'Agilidad', 'Puntos_2', 'Resistencia', 'Puntos_3', 'Total'
  ];

  const headers: (keyof Participant)[] = [
    '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria',
    'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre',
    'Puntos', 'Salto', 'Puntos', 'Agilidad', 'Puntos', 'Resistencia', 'Puntos', 'Total'
  ];

  const participantsArray: (string | number)[][] = [headers];

  participants.map(participant => {
    const values = keys.map(key => participant[key]);
    participantsArray.push(values);
  });

  return participantsArray;
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Conecta a la base de datos
    await connectDB();

    // Obteniendo participantes ordenados
    let sortedParticipants;
    try {
      sortedParticipants = await ParticipantModel.find({}).sort({ '#': 1 });
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      return NextResponse.json({ error: 'Error al obtener participantes' }, { status: 500 });
    }

    // Convertir participantes a array
    let participantsArray;
    try {
      participantsArray = convertParticipantsToArray(sortedParticipants);
    } catch (error) {
      console.error('Error al convertir participantes a array:', error);
      return NextResponse.json({ error: 'Error al convertir participantes a array' }, { status: 500 });
    }

    // Obteniendo información del archivo
    let fileInfoArray;
    try {
      fileInfoArray = await FileInfoModel.find({});
    } catch (error) {
      console.error('Error al obtener información del archivo:', error);
      return NextResponse.json({ error: 'Error al obtener información del archivo' }, { status: 500 });
    }

    // Devolver la respuesta exitosa
    return NextResponse.json({ participantsArray, fileInfoArray });

  } catch (error) {
    console.error('Error al obtener datos desde MongoDB:', error);
    return NextResponse.json({ error: 'Error al obtener datos desde MongoDB' }, { status: 500 });
  }
}