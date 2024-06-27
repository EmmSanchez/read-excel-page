import { NextRequest, NextResponse } from "next/server";
export const maxDuration = 50; // 50 seconds

export async function POST(req: NextRequest) {
  const {username, password, rol} = await req.json()
  return NextResponse.json({message: 'Usuario cargado', username})
}