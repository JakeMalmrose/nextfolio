import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Get user count
    const userCount = await prisma.user.count()
    
    // Get post count
    const postCount = await prisma.post.count()
    
    // Get analytics count
    const analyticsCount = await prisma.analytics.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      counts: {
        users: userCount,
        posts: postCount,
        analytics: analyticsCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}