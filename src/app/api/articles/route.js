import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const articles = await prisma.article.findMany({
    where: { authorId: decoded.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ articles });
}

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { title, content } = await req.json();

  const article = await prisma.article.create({
    data: {
      title,
      content,
      authorId: decoded.id,
    },
  });

  return NextResponse.json({ message: 'Article created', article });
}
