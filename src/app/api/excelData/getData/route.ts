"use server"
import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedData';
import FileInfoModel from '@/models/fileInfo';
import connectDB from '@/app/lib/mongodb';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();

    // Get sorted participants object
    let participants
    try {
      // POSIBLE PROBLEMA AQUÍ CON EL SORT ----------------------------------------------------------------
      participants = await ParticipantModel.find({})
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      return NextResponse.json({ error: 'Error al obtener participantes' }, { status: 500 });
    }

    // Participants to array
    // let participants;
    // try {
    //   participants = convertParticipantsToArray(sortedParticipants);
    // } catch (error) {
    //   console.error('Error al convertir participantes a array:', error);
    //   return NextResponse.json({ error: 'Error al convertir participantes a array' }, { status: 500 });
    // }

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
      return NextResponse.json({ error: 'No existe archivo en la base de datos' }, { status: 200 });
    }

    // Devolver la respuesta exitosa
    return NextResponse.json({ participants, fileInfoArray });

  } catch (error) {
    console.error('Error al obtener datos desde MongoDB:', error);
    return NextResponse.json({ error: 'Error al obtener datos desde MongoDB' }, { status: 500 });
  }
}