// /src/app/api/logout/route.js
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const response = new NextResponse(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
  });

  response.headers.set(
    'Set-Cookie',
    serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(0), // Expire immediately
    })
  );

  return response;
}
