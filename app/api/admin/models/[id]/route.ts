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
    const { name, displayName, provider, endpoint, costPer1k, enabled } = await request.json()
    const resolvedParams = await params

    const updatedProvider = await prisma.modelProvider.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        displayName,
        provider,
        endpoint,
        costPer1k,
        enabled,
      },
    })

    return NextResponse.json({ provider: updatedProvider })
  } catch (error: unknown) {
    console.error('Error updating model provider:', error)
    
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'Model with this name already exists' },
        { status: 409 }
      )
    }
    
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Model provider not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update model provider' },
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
    
    await prisma.modelProvider.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting model provider:', error)
    
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Model provider not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete model provider' },
      { status: 500 }
    )
  }
}