import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import UserModel from "@/models/users";
import connectDB from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
  const links = [
    { name: 'Dashboard', href: '/dashboard/table' },
    { name: 'Settings', href: '/dashboard/settings' }
  ];

  await connectDB();

  try {
    const { username, password } = await req.json();

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const user = await UserModel.findOne({ username });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrecta' }, { status: 400 });
    }

    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, user: user.username },
      process.env.JWT_SECRET
    );

    const serialized = serialize('myTokenName', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    const responseLinks = user.rol === 'Invitado' ? links.slice(0, 1) : links;

    const response = NextResponse.json({ user, links: responseLinks }, { status: 200 });
    response.headers.append('Set-Cookie', serialized);

    return response;
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
