import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedFile';

function convertParticipantsToArray(participants) {
  const keys = [
    '#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria',
    'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre',
    'Puntos', 'Salto', 'Puntos_1', 'Agilidad', 'Puntos_2', 'Resistencia', 'Puntos_3', 'Total'
  ];

 const participantsArray = [['#', 'Apellido paterno', 'Apellido materno', 'Nombre', 'Prueba', '# Empleado', 'Edad', 'Genero', 'Categoria', 'Altura [cm]', 'Peso [kg]', 'Grasa [%]', 'IMC', 'Cintura [cm]', 'BMI', 'BMR', 'Fatmass', 'FFM', 'TBW', 'Agarre', 'Puntos', 'Salto', 'Puntos', 'Agilidad', 'Puntos', 'Resistencia', 'Puntos', 'Total']]

  participants.map(participant => {
    const values = keys.map(key => participant[key]);
    participantsArray.push(values)
  });

  return participantsArray;
}

export async function GET(req: NextRequest) {
  try {
    const participants = await ParticipantModel.find({}); // Get all docs
    const participantsArray = convertParticipantsToArray(participants)

    return NextResponse.json(participantsArray);
  } catch (error) {
    console.error('Error al obtener datos desde MongoDB:', error);
    return NextResponse.json({ error: 'Error al obtener datos desde MongoDB' }, { status: 500 });
  }
}
