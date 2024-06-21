import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedFile';

type ExcelData = (string | number | boolean | null)[][] | null;

export async function POST(req: NextRequest) {
  const data: ExcelData = await req.json();

  if (!data) {
    return NextResponse.json({ error: 'No se proporcionaron datos válidos' }, { status: 400 });
  }
    
  try {
    // Iterate and upload data
    const results = await ParticipantModel.insertMany(data);
    return NextResponse.json({ message: 'Datos guardados en MongoDB'});
  } catch (error) {
    console.error('Error al guardar datos en MongoDB:', error);
    return NextResponse.json({ error: 'Error al guardar datos en MongoDB' }, { status: 500 });
  }
}