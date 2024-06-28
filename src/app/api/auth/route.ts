"use server"
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import UserModel from "@/models/users";
import connectDB from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
  const links = [
    {
      name: 'Dasboard', href: '/dashboard/table',
    },
    {
      name: 'Settings', href: '/dashboard/settings',
    }
  ]

  await connectDB()

  try {
    const { username , password } = await req.json();
    
    const user = await UserModel.findOne({ username: username })

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    if (user?.username === username && user?.password === password && user?.rol === 'Invitado') {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        user: user?.username,
      }, process.env.JWT_SECRET);

      const serialized = serialize('myTokenName', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      });

      const filteredLinks = await links.slice(0, 1)

      const response = NextResponse.json({ user, links: filteredLinks }, { status: 200 });
      response.headers.append('Set-Cookie', serialized);
      
      return response;
    }

    if (user?.username === username && user?.password === password && user?.rol === 'Administrador') {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        user: user?.username,
      }, process.env.JWT_SECRET);

      const serialized = serialize('myTokenName', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 12, // 12 hours
        path: '/'
      });

      const response = NextResponse.json({ user, links }, { status: 200 });
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
