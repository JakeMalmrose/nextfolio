import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthResponse } from '@/lib/auth-middleware'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const { resultId, passed } = await request.json()
    const resolvedParams = await params

    if (!resultId || typeof passed !== 'boolean') {
      return NextResponse.json(
        { error: 'Result ID and passed status are required' },
        { status: 400 }
      )
    }

    // Verify the test result belongs to the user
    const testResult = await prisma.testResult.findFirst({
      where: {
        id: resultId,
        testRun: {
          id: resolvedParams.id,
          promptVersion: {
            prompt: {
              userId: auth.userId,
            },
          },
        },
      },
    })

    if (!testResult) {
      return NextResponse.json(
        { error: 'Test result not found' },
        { status: 404 }
      )
    }

    // Update the passed status
    const updatedResult = await prisma.testResult.update({
      where: { id: resultId },
      data: { passed },
    })

    return NextResponse.json({ result: updatedResult })
  } catch (error) {
    console.error('Error updating test result:', error)
    return NextResponse.json(
      { error: 'Failed to update test result' },
      { status: 500 }
    )
  }
}