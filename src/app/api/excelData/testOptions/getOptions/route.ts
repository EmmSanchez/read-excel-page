"use server"
import TestOptionsModel from "@/models/tests";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    // just get option and not _id
    const data = await TestOptionsModel.find({}, 'option -_id')
    const optionsArray = data.map(doc => doc.option)

    return NextResponse.json({ message: 'Subido correctamente', options: optionsArray })
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener opciones de test'}, { status: 400 })
  }
}