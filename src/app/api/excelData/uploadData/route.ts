"use server"
import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedData';
import FileInfoModel from '@/models/fileInfo';

export async function POST(req: NextRequest) {
  const { data, fileName, fileSize } = await req.json();

  if (!data) {
    return NextResponse.json({ error: 'No se proporcionaron datos válidos' }, { status: 400 });
  }
    
  try {
    // Delete past info
    await FileInfoModel.deleteMany({})
    await ParticipantModel.deleteMany({})

    // Iterate and upload data
    await ParticipantModel.insertMany(data);
    await FileInfoModel.insertMany({
      name: fileName,
      size: fileSize,
    })
    return NextResponse.json({ message: 'Datos guardados en MongoDB'});
  } catch (error) {
    console.error('Error al guardar datos en MongoDB:', error);
    return NextResponse.json({ error: 'Error al guardar datos en MongoDB' }, { status: 500 });
  }
}