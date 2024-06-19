import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const { user, password } = await req.json();

    if (user === 'admin' && password === 'admin') {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        user: 'admin',
      }, 'secret');

      const serialized = serialize('myTokenName', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      });

      const response = NextResponse.json({ message: 'Login successfully' }, { status: 200 });
      response.headers.append('Set-Cookie', serialized);
      
      return response;
    } else {
      return NextResponse.json({ error: 'Usuario o contraseña incorrecta' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Usuario o contraseña incorrecta' }, { status: 400 });
  }
}
