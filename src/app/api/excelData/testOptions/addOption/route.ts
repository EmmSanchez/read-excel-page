import connectDB from "@/app/lib/mongodb";
import TestOptionsModel from "@/models/tests";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB()

  try {
    const option = await req.json()
    
    if (!option) return NextResponse.json({ message: 'Dato inválido'}, { status: 400 })

    const res = await TestOptionsModel.insertMany({
      option: option
    })

    if (!res) return NextResponse.json({ message: 'Error al subir' },{ status: 404 })

    return NextResponse.json({ message: 'Subido correctamente' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error al añadir en la base de datos'}, { status: 400 })
  }
}