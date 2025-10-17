import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const error = requireAuth(request, user);

    if (error) {
      return NextResponse.json(error, { status: 401 });
    }

    const contracts = await prisma.contract.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { timeEntries: true },
        },
      },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
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
    const { name, color } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        name: name.trim(),
        color: color || '#bb86fc',
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}
