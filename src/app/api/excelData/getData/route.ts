import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedData';
import FileInfoModel from '@/models/fileInfo';
import connectDB from '@/app/lib/mongodb';
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();

    // Get file's info
    let fileInfoArray;
    try {
      fileInfoArray = await FileInfoModel.find();
    } catch (error) {
      console.error('Error al obtener información del archivo:', error);
      return NextResponse.json({ error: 'Error al obtener información del archivo' }, { status: 500 });
    }

    // Get sorted participants object
    let sortedParticipants;
    try {
      sortedParticipants = await ParticipantModel.find().sort({ '#': 1 })
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      return NextResponse.json({ error: 'Error al obtener participantes' }, { status: 500 });
    }

    // Verify if there is data, if not, the var is null and works in client -> (!fileInfoArray)
    if (!fileInfoArray || fileInfoArray.length === 0) {
      return NextResponse.json({ error: 'No se encontró información del archivo' }, { status: 200 });
    }

    return NextResponse.json({ sortedParticipants, fileInfoArray });

  } catch (error) {
    console.error('Error al obtener datos desde MongoDB:', error);
    return NextResponse.json({ error: 'Error al obtener datos desde MongoDB' }, { status: 500 });
  }
}