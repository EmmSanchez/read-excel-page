"use server"
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import connectDB from "@/utils/mongoose";
import File from "@/models/File";

export async function GET(req: NextRequest, res: NextResponse) {
  const myTokenName = req.cookies.get('myTokenName')?.value

  if (!myTokenName) {
    return NextResponse.json({ message: 'Token not found'}, { status: 401})
  }

  try {
    const profile = verify(myTokenName, 'secret') as { user: string; [key: string]: any };
    await connectDB()
    const file = await File.find()
    return NextResponse.json({ user: profile.user, file: file })
    
  } catch (error) {
    return NextResponse.json({errr: 'invalid token'}, {status: 401})
  }
}