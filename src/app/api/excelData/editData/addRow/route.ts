import ParticipantModel from "@/models/uploadedData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { row } = await req.json()
    if(!row) return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });

    const newParticipant = row

    // Verifiy if ID is repeated
    const existingParticipant = await ParticipantModel.findOne({ '#': newParticipant.id });
    if (existingParticipant) {
      return NextResponse.json({ message: "El ID del participante ya existe" }, { status: 400 });
    }

    const res = await ParticipantModel.insertMany(newParticipant)  
  
    if (!res) {
      return NextResponse.json({ message: "Hubo algún problema al subir" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Añadido correctamente'}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error al subir'}, { status: 400 })
  }
}