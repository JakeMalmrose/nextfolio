import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthResponse } from '@/lib/auth-middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const resolvedParams = await params
    const testRun = await prisma.testRun.findFirst({
      where: {
        id: resolvedParams.id,
        promptVersion: {
          prompt: {
            userId: auth.userId,
          },
        },
      },
      include: {
        results: {
          orderBy: { createdAt: 'asc' },
        },
        promptVersion: {
          include: {
            prompt: true,
          },
        },
      },
    })

    if (!testRun) {
      return NextResponse.json(
        { error: 'Test run not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ testRun })
  } catch (error) {
    console.error('Error fetching test run:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test run' },
      { status: 500 }
    )
  }
}