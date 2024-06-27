"use server"
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import UserModel from "@/models/users";


export async function POST(req: NextRequest) {
  try {
    const { user, password } = await req.json();

    const username = await UserModel.findOne({ username: user })

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    if (username?.username === user && username?.password === password && username?.rol === 'Invitado') {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        user: 'invited',
      }, process.env.JWT_SECRET);

      const serialized = serialize('myTokenName', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 12, // 12 hours
        path: '/'
      });

      const response = NextResponse.json({ message: 'Login successfully' }, { status: 200 });
      response.headers.append('Set-Cookie', serialized);
      
      return response;
    }

    if (username?.username === user && username?.password === password && username?.rol === 'Administrador') {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        user: 'admin',
      }, process.env.JWT_SECRET);

      const serialized = serialize('myTokenName', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 12, // 12 hours
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
