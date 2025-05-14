import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: { author: { select: { name: true } } },
    });

    if (!article || article.authorId !== decoded.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ article });
  } catch (err) {
    console.error('❌ Fetch article error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
