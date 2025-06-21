import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const prompts = await prisma.prompt.findMany({
      where: { userId: auth.userId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
        _count: {
          select: { versions: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ prompts })
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Extract variables from content
    const variables = extractVariables(content)

    const prompt = await prisma.prompt.create({
      data: {
        title,
        userId: auth.userId,
        versions: {
          create: {
            versionNumber: 1,
            content,
            variables,
          },
        },
      },
      include: {
        versions: true,
      },
    })

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to create prompt' },
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