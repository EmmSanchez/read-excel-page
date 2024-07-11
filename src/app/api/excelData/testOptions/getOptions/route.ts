import TestOptionsModel from "@/models/tests";
import { NextResponse } from "next/server";
export const revalidate = 5
export const dynamic = 'force-dynamic'


export async function GET() {
  try {
    // just get option and not _id
    const data = await TestOptionsModel.find({}, 'option -_id').sort({ option: 1})
    const optionsArray = data.map(doc => doc.option)

    return NextResponse.json({ message: 'Subido correctamente', options: optionsArray })
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener opciones de test'}, { status: 400 })
  }
}