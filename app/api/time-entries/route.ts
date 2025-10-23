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
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const contractId = searchParams.get('contractId');
    const contractIds = searchParams.get('contractIds');

    const where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Support both single contractId and multiple contractIds
    if (contractIds) {
      const ids = contractIds.split(',').filter(id => id.trim());
      if (ids.length > 0) {
        where.contractId = { in: ids };
      }
    } else if (contractId) {
      where.contractId = contractId;
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      include: {
        contract: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entries' },
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
    const { contractId, date, hoursWorked, tasks, notes } = body;

    if (!contractId || !date || !hoursWorked || !tasks) {
      return NextResponse.json(
        { error: 'Missing required fields: contractId, date, hoursWorked, tasks' },
        { status: 400 }
      );
    }

    if (typeof hoursWorked !== 'number' || hoursWorked <= 0) {
      return NextResponse.json(
        { error: 'hoursWorked must be a positive number' },
        { status: 400 }
      );
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        contractId,
        date: new Date(date),
        hoursWorked,
        tasks: tasks.trim(),
        notes: notes?.trim() || null,
      },
      include: {
        contract: true,
      },
    });

    return NextResponse.json(timeEntry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating time entry:', error);
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create time entry' },
      { status: 500 }
    );
  }
}
