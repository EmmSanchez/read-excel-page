import RangeAgeModel from "@/models/rangeAges";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const ranges = await RangeAgeModel.find({})

    return NextResponse.json({ ranges })
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener rangos de edades'}, { status: 500 })
  }
}