import connectDB from "@/app/lib/mongodb";
import UserModel from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await connectDB()
  const { username } = await req.json()

  try { 
    const res = await UserModel.findOneAndDelete({ username: username })

    if (!res) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuario eliminado correctamente' }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar usuario' }, {status: 500})
  }
}