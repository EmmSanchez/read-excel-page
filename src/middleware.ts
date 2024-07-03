"use server"
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const tokenValue = req.cookies.get('myTokenName')?.value

  if (req.nextUrl.pathname.includes('/dashboard/table') || req.nextUrl.pathname.includes('/dashboard/settings')) {
    // if there is no token
    if (!tokenValue) {
      return NextResponse.redirect(new URL('/',  req.url))
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      // first validete token
      const { payload } = await jwtVerify(tokenValue, new TextEncoder().encode(process.env.JWT_SECRET))
      const rol = payload.user
      if (req.nextUrl.pathname.includes('/dashboard/settings')) {
        if (rol === 'invited') return NextResponse.redirect(new URL('/dashboard/table',  req.url))
        return NextResponse.next()
      }
      
      return NextResponse.next()
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (req.nextUrl.pathname === '/') {
    if (!tokenValue) {
      return NextResponse.next()
    }

    try {
      await jwtVerify(tokenValue, new TextEncoder().encode(process.env.JWT_SECRET))
      return NextResponse.redirect(new URL('/dashboard/table', req.url))
    } catch (error) {
      return NextResponse.next()
    }
  }
  return NextResponse.next()
}