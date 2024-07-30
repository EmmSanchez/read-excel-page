import { NextRequest, NextResponse } from "next/server";
import TestOptionsModel from "@/models/tests";

export async function DELETE(req: NextRequest) {
  try {
    const { option } = await req.json()

    if (!option) return NextResponse.json({ message: 'Dato inválido'}, { status: 400 })

    const res = await TestOptionsModel.findOneAndDelete({ option: option })

    if (!res) return NextResponse.json({ message: 'Error al eliminar' },{ status: 404 })

    return NextResponse.json({ message: 'Eliminado correctamente' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar en la base de datos'}, { status: 400 })
  }
}