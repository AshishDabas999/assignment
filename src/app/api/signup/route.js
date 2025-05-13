import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'USER' },
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (err) {
    console.error('❌ Signup API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
