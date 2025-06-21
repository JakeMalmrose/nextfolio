import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthResponse } from '@/lib/auth-middleware'

// TODO: Add admin role check in the future
export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const providers = await prisma.modelProvider.findMany({
      orderBy: { displayName: 'asc' },
    })

    return NextResponse.json({ providers })
  } catch (error) {
    console.error('Error fetching model providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model providers' },
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
    const { name, displayName, provider, endpoint, costPer1k, enabled } = await request.json()

    if (!name || !displayName || !provider) {
      return NextResponse.json(
        { error: 'Name, display name, and provider are required' },
        { status: 400 }
      )
    }

    const modelProvider = await prisma.modelProvider.create({
      data: {
        name,
        displayName,
        provider,
        endpoint,
        costPer1k,
        enabled: enabled ?? true,
      },
    })

    return NextResponse.json({ provider: modelProvider })
  } catch (error: unknown) {
    console.error('Error creating model provider:', error)
    
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'Model with this name already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create model provider' },
      { status: 500 }
    )
  }
}