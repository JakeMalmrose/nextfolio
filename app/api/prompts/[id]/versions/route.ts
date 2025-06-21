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
    // Check if prompt exists and belongs to user
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: resolvedParams.id,
        userId: auth.userId,
      },
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      )
    }

    const versions = await prisma.promptVersion.findMany({
      where: { promptId: resolvedParams.id },
      orderBy: { versionNumber: 'desc' },
    })

    return NextResponse.json({ versions })
  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    )
  }
}