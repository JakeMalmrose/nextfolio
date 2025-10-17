import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth } from '@/lib/auth';

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

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        contract: true,
      },
    });

    // Group by contract and sum hours
    const weeklyBreakdown = timeEntries.reduce((acc: any, entry) => {
      const contractId = entry.contract.id;

      if (!acc[contractId]) {
        acc[contractId] = {
          contract: entry.contract,
          totalHours: 0,
          entries: [],
        };
      }

      acc[contractId].totalHours += entry.hoursWorked;
      acc[contractId].entries.push(entry);

      return acc;
    }, {});

    // Convert to array and sort by total hours descending
    const result = Object.values(weeklyBreakdown).sort((a: any, b: any) =>
      b.totalHours - a.totalHours
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching weekly breakdown:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly breakdown' },
      { status: 500 }
    );
  }
}
