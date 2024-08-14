import { NextRequest, NextResponse } from "next/server";
import ParticipantModel from "@/models/uploadedData";
import connectDB from "@/app/lib/mongodb";

export async function DELETE(req: NextRequest) {
  await connectDB()

  try {
    const data = await req.json()

    if (!data) {
      return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
    }

    let res
    if (Array.isArray(data)) {
      res = await ParticipantModel.deleteMany({ '#': { $in: data } });
    } else {
      res = await ParticipantModel.findOneAndDelete({'#': data})
    }


    if (!res) {
      return NextResponse.json({ message: "Participante(s) no encontrado(s)" }, { status: 404 });
    }
    
    return NextResponse.json('Fila(s) eliminada correctamente')
  } catch (error) {
    return NextResponse.json({ message: "Error al tratar de eliminar" }, { status: 404 });
  }
}