import connectDB from "@/app/lib/mongodb";
import UserModel from "@/models/users";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  await connectDB()
  const rol = await req.json()
  
  if (!rol) return NextResponse.json({status: 400})
  
  if (rol === 'Administrador') {
    const users = await UserModel.find({})

    return NextResponse.json({message: 'Usuarios obtenidos' , users: users}, { status: 200 })
  } else {
    return NextResponse.json({ message: 'Acceso denegado' },{status: 401})
  }
}