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
    const { contractId, date, hoursWorked, tasks, notes } = body;

    const data: any = {};

    if (contractId) data.contractId = contractId;
    if (date) data.date = new Date(date);
    if (hoursWorked !== undefined) {
      if (typeof hoursWorked !== 'number' || hoursWorked <= 0) {
        return NextResponse.json(
          { error: 'hoursWorked must be a positive number' },
          { status: 400 }
        );
      }
      data.hoursWorked = hoursWorked;
    }
    if (tasks) data.tasks = tasks.trim();
    if (notes !== undefined) data.notes = notes?.trim() || null;

    const { id } = await params;
    const timeEntry = await prisma.timeEntry.update({
      where: { id },
      data,
      include: {
        contract: true,
      },
    });

    return NextResponse.json(timeEntry);
  } catch (error: any) {
    console.error('Error updating time entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update time entry' },
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
    await prisma.timeEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting time entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Time entry not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete time entry' },
      { status: 500 }
    );
  }
}
