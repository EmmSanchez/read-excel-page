import RangeAgeModel from "@/models/rangeAges";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { minAge } = await req.json()
    await RangeAgeModel.findOneAndDelete({'minAge': minAge})

    return NextResponse.json({message: 'Range deleted'}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener rangos de edades'}, { status: 500 })
  }
}