import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  try {
    if (!token) throw new Error('Missing token');

    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    return NextResponse.next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: ['/profile/:path*', '/articles/:path*', '/admin/:path*'],
};
