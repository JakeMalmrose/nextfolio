import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if any users exist - only allow signup if no users exist
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Signup is disabled. Please login instead.' },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create first user as admin
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
        role: 'admin',
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    // Create auth token
    const token = createToken(user);

    // Set cookie
    const response = NextResponse.json(user);
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.ALLOW_HTTP_AUTH !== 'true',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Error creating admin:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}
