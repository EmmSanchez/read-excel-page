import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedData';
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Get sorted participants object
    let sortedParticipants;
    try {
      sortedParticipants = await ParticipantModel.find().sort({ '#': 1 })
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      return NextResponse.json({ error: 'Error al obtener participantes' }, { status: 500 });
    }

    // Devolver la respuesta exitosa
    return NextResponse.json({ sortedParticipants });

  } catch (error) {
    console.error('Error al obtener datos desde MongoDB:', error);
    return NextResponse.json({ error: 'Error al obtener datos desde MongoDB' }, { status: 500 });
  }
}