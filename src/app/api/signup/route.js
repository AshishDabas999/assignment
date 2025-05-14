import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

// Singleton Prisma Client to avoid multiple instances
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    // Validate that the role is either 'USER' or 'ADMIN'
    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Role must be either USER or ADMIN.' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user with the specified role
    await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (err) {
    console.error('❌ Signup API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
