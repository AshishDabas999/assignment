// /src/app/api/profile/route.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { name } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { name },
    });

    return NextResponse.json({ message: 'Name updated', user: updatedUser });
  } catch (err) {
    console.error('❌ Profile update error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
