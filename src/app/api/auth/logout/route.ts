"use server"
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { serialize } from 'cookie'

export async function POST(req: NextRequest, res: NextResponse) {
  const myTokenName = req.cookies.get('myTokenName')?.value

  if (!myTokenName) {
    return NextResponse.json({error: 'No token'}, { status: 401})
  }

  try {
    verify(myTokenName, 'secret') as { user: string; [key: string]: any };
    const serialized = serialize('myTokenName', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // expired
      path: '/'
    });

    const response = NextResponse.json({message: 'Logout successfully '}, { status: 200})
    response.headers.set('Set-Cookie', serialized)
    return response
  } catch (error) {
    return NextResponse.json({ message: 'Invalid Token'}, {status: 401})
  }
  
}