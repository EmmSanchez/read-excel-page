import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {username, password, rol} = await req.json()
  return NextResponse.json({message: 'Usuario cargado', username})
}