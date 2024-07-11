import RangeAgeModel from "@/models/rangeAges";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { newRange } = await req.json()
    await RangeAgeModel.insertMany({
      minAge: newRange.minAge,
      maxAge: newRange.maxAge,
      value: newRange.value
    })
    return NextResponse.json({ message: 'Rango subido correctamente' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({message: 'Error al subir nuevo rango'}, { status: 400 })
  }
}