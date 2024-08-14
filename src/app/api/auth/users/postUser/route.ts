import { NextRequest, NextResponse } from "next/server";
import UserModel from '@/models/users';
import connectDB from "@/app/lib/mongodb";

export async function POST(req: NextRequest,) {
  await connectDB()

  const { user } = await req.json()

  if (!user) {
    return NextResponse.json({ error: 'No se proporcionaron datos válidos'}, { status: 400 })
  }
  
  try {
    await UserModel.insertMany({
      username: user.username,
      password: user.password,
      rol: user.rol
    })

    return NextResponse.json({ message: 'Usuario agregado correctamente' },{ status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error al agregar usuario' },{ status: 500 })
  }
}