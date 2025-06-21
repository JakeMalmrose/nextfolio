import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthResponse } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const [providers, presets] = await Promise.all([
      prisma.modelProvider.findMany({
        where: { enabled: true },
        orderBy: { displayName: 'asc' },
      }),
      prisma.modelPreset.findMany({
        orderBy: { name: 'asc' },
      }),
    ])

    return NextResponse.json({ providers, presets })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}