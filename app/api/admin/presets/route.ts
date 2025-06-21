import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const presets = await prisma.modelPreset.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ presets })
  } catch (error) {
    console.error('Error fetching model presets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model presets' },
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
    const { name, displayName, description, models } = await request.json()

    if (!name || !displayName || !models || !Array.isArray(models)) {
      return NextResponse.json(
        { error: 'Name, display name, and models array are required' },
        { status: 400 }
      )
    }

    const preset = await prisma.modelPreset.create({
      data: {
        name,
        displayName,
        description,
        models,
      },
    })

    return NextResponse.json({ preset })
  } catch (error: unknown) {
    console.error('Error creating model preset:', error)
    
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'Preset with this name already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create model preset' },
      { status: 500 }
    )
  }
}