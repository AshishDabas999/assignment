import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Fetch all articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: true, // optional, includes user info
      },
    });
    return NextResponse.json(articles, { status: 200 });
  } catch (err) {
    console.error('❌ Error fetching articles:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete a specific article
export async function DELETE(req) {
  const token = cookies().get('token')?.value;

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only ADMIN can delete articles
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { articleId } = await req.json();

    const article = await prisma.article.findUnique({ where: { id: articleId } });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await prisma.article.delete({ where: { id: articleId } });

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });

  } catch (err) {
    console.error('❌ Error deleting article:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
