import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const contract = await prisma.contract.update({
      where: { id },
      data: {
        name: name.trim(),
        ...(color && { color }),
      },
    });

    return NextResponse.json(contract);
  } catch (error: any) {
    console.error('Error updating contract:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update contract' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    const error = requireAdmin(request, user);

    if (error) {
      return NextResponse.json(error, { status: 403 });
    }
    const { id } = await params;
    await prisma.contract.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting contract:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete contract' },
      { status: 500 }
    );
  }
}
