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
    const { name, displayName, description, models } = await request.json()
    const resolvedParams = await params

    const updatedPreset = await prisma.modelPreset.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        displayName,
        description,
        models,
      },
    })

    return NextResponse.json({ preset: updatedPreset })
  } catch (error: unknown) {
    console.error('Error updating model preset:', error)
    
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'Preset with this name already exists' },
        { status: 409 }
      )
    }
    
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Model preset not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update model preset' },
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
    await prisma.modelPreset.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting model preset:', error)
    
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Model preset not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete model preset' },
      { status: 500 }
    )
  }
}