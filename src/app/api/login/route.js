import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  const response = NextResponse.json({ message: 'Login successful' });

  response.headers.set(
    'Set-Cookie',
    serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
  );

  return response;
}
