import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Fetch users API
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      where: { NOT: { id: decoded.id } }, // Exclude current admin
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ users });

  } catch (err) {
    console.error('❌ JWT verification error:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

// Update user role API
export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, newRole } = await req.json();

    // Ensure the role is either 'USER' or 'ADMIN'
    if (!['USER', 'ADMIN'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return NextResponse.json({ message: 'Role updated successfully', user: updated });
  } catch (err) {
    console.error('❌ Role update error:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

// Delete user API
export async function DELETE(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId } = await req.json();

    // Ensure the user to be deleted exists
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the user
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Delete user error:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
