import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const error = requireAdmin(request, user);

    if (error) {
      return NextResponse.json(error, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const error = requireAdmin(request, user);

    if (error) {
      return NextResponse.json(error, { status: 403 });
    }

    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (role && !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either "admin" or "user"' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
        role: role || 'user',
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
