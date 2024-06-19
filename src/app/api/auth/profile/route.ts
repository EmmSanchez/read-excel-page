import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function GET(req: NextRequest, res: NextResponse) {
  const myTokenName = req.cookies.get('myTokenName')?.value

  if (!myTokenName) {
    return NextResponse.json({ message: 'Token not found'}, { status: 401})
  }

  try {
    const profile = verify(myTokenName, 'secret') as { user: string; [key: string]: any };
    return NextResponse.json({ user: profile.user })
    
  } catch (error) {
    return NextResponse.json({errr: 'invalid token'}, {status: 401})
  }
}