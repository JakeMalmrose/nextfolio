import { NextRequest } from 'next/server'
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

  const resolvedParams = await params
  // Verify the test run belongs to the user
  const testRun = await prisma.testRun.findFirst({
    where: {
      id: resolvedParams.id,
      promptVersion: {
        prompt: {
          userId: auth.userId,
        },
      },
    },
  })

  if (!testRun) {
    return new Response('Test run not found', { status: 404 })
  }

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

      // Poll for updates every 2 seconds
      const interval = setInterval(async () => {
        try {
          const updatedTestRun = await prisma.testRun.findUnique({
            where: { id: resolvedParams.id },
            include: {
              results: {
                orderBy: { createdAt: 'asc' },
              },
            },
          })

          if (updatedTestRun) {
            controller.enqueue(
              `data: ${JSON.stringify({
                type: 'update',
                testRun: updatedTestRun,
              })}\n\n`
            )

            // Check if all results are complete (have output)
            const pendingResults = updatedTestRun.results.filter(
              result => !result.output
            )

            if (pendingResults.length === 0 && updatedTestRun.results.length > 0) {
              controller.enqueue(
                `data: ${JSON.stringify({ type: 'complete' })}\n\n`
              )
              clearInterval(interval)
              controller.close()
            }
          }
        } catch (error) {
          console.error('Error in SSE stream:', error)
          controller.enqueue(
            `data: ${JSON.stringify({
              type: 'error',
              message: 'Error fetching updates',
            })}\n\n`
          )
        }
      }, 2000)

      // Clean up on client disconnect
      request.signal?.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}