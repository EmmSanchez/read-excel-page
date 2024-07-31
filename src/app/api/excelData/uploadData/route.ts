"use server"
import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedData';
import FileInfoModel from '@/models/fileInfo';

interface Participant {
  _id: string;
  '#': number;
  'Apellido paterno': string;
  'Apellido materno': string;
  Nombre: string;
  Prueba: string;
  '# Empleado': string;
  Edad: number;
  Genero: string;
  Categoria: number;
  'Altura [cm]': number;
  'Peso [kg]': number;
  'Grasa [%]': number;
  IMC: number;
  'Cintura [cm]': number;
  BMI: number;
  BMR: number;
  Fatmass: number;
  FFM: number;
  TBW: number;
  Agarre: number;
  Puntos: number;
  Salto: number;
  Puntos_1: number;
  Agilidad: number;
  Puntos_2: number;
  Resistencia: string;
  Puntos_3: number;
  Total: number;
}

export async function POST(req: NextRequest) {
  const { data, fileName, fileSize, ageRanges } = await req.json();

  if (!data) {
    return NextResponse.json({ error: 'No se proporcionaron datos válidos' }, { status: 400 });
  }
    
  try {
    // Delete past info
    await FileInfoModel.deleteMany({})
    await ParticipantModel.deleteMany({})

    await FileInfoModel.insertMany({
      name: fileName,
      size: fileSize,
    })
    
    if (ageRanges.length > 0) {
      const updatedData = data.map((participant:  Participant) => {
        
        let total = participant.Total
        for (const range of ageRanges) {
          if (participant.Edad >= range.minAge && participant.Edad <= range.maxAge) {
            total = (participant.Puntos + participant.Puntos_1 + participant.Puntos_2 + participant.Puntos_3) * range.value;
          } 
        }

        return {
          ...participant,
          Total: total,
        };
      });

      await ParticipantModel.insertMany(updatedData);
      return NextResponse.json({ message: 'Datos guardados en MongoDB', data: updatedData }, { status: 200 });
    } else {
      // Iterate and upload data
      await ParticipantModel.insertMany(data);
      return NextResponse.json({ message: 'Datos guardados en MongoDB', data: data}, { status: 200 });
    }
  } catch (error) {
    console.error('Error al guardar datos en MongoDB:', error);
    return NextResponse.json({ error: 'Error al guardar datos en MongoDB' }, { status: 500 });
  }
}