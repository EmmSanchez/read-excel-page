import connectDB from "@/app/lib/mongodb";
import RangeAgeModel from "@/models/rangeAges";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB()

  try {
    const ranges = await RangeAgeModel.find().sort({ minAge: 1})

    return NextResponse.json({ ranges })
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener rangos de edades'}, { status: 500 })
  }
}