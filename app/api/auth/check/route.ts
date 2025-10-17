import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count();
    const hasUsers = userCount > 0;

    // Get current user if logged in
    const currentUser = await getAuthUser(request);

    return NextResponse.json({
      hasUsers,
      user: currentUser,
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { error: 'Failed to check auth status' },
      { status: 500 }
    );
  }
}
