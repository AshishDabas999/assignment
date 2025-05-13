import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ MUST be awaited
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('❌ Error loading user from /api/me:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
}
