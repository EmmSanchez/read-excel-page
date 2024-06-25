"use server"
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import connectDB from "@/utils/mongoose";

export async function GET(req: NextRequest, res: NextResponse) {
  const myTokenName = req.cookies.get('myTokenName')?.value

  if (!myTokenName) {
    return NextResponse.json({ message: 'Token not found'}, { status: 401})
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const profile = verify(myTokenName,  process.env.JWT_SECRET) as { user: string; [key: string]: any };
    await connectDB()
    return NextResponse.json({ user: profile.user})
    
  } catch (error) {
    return NextResponse.json({errr: 'invalid token'}, {status: 401})
  }
}