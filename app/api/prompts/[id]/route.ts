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
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: resolvedParams.id,
        userId: auth.userId,
      },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
      },
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const { title, content } = await request.json()
    const resolvedParams = await params

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check if prompt exists and belongs to user
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id: resolvedParams.id,
        userId: auth.userId,
      },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
    })

    if (!existingPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      )
    }

    // Extract variables from content
    const variables = extractVariables(content)
    const nextVersion = existingPrompt.currentVersion + 1

    // Update prompt with new version
    const updatedPrompt = await prisma.prompt.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        currentVersion: nextVersion,
        versions: {
          create: {
            versionNumber: nextVersion,
            content,
            variables,
          },
        },
      },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
      },
    })

    return NextResponse.json({ prompt: updatedPrompt })
  } catch (error) {
    console.error('Error updating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id: resolvedParams.id,
        userId: auth.userId,
      },
    })

    if (!existingPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      )
    }

    await prisma.prompt.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    )
  }
}

function extractVariables(content: string): string[] {
  const regex = /{([^}]+)}/g
  const variables = new Set<string>()
  let match

  while ((match = regex.exec(content)) !== null) {
    variables.add(match[1].trim())
  }

  return Array.from(variables)
}