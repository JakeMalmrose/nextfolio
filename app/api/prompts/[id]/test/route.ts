import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth, createAuthResponse } from '@/lib/auth-middleware'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return createAuthResponse('Authentication required')
  }

  try {
    const { versionNumber, variableValues, models } = await request.json()
    const resolvedParams = await params

    if (!versionNumber || !models || !Array.isArray(models)) {
      return NextResponse.json(
        { error: 'Version number and models are required' },
        { status: 400 }
      )
    }

    // Get the prompt version
    const promptVersion = await prisma.promptVersion.findFirst({
      where: {
        promptId: resolvedParams.id,
        versionNumber,
        prompt: {
          userId: auth.userId,
        },
      },
    })

    if (!promptVersion) {
      return NextResponse.json(
        { error: 'Prompt version not found' },
        { status: 404 }
      )
    }

    // Create test run
    const testRun = await prisma.testRun.create({
      data: {
        promptVersionId: promptVersion.id,
        variableValues: variableValues || {},
      },
    })

    // Start async testing process
    processTestRun(testRun.id, promptVersion.content, variableValues || {}, models)

    return NextResponse.json({ 
      testRunId: testRun.id,
      message: 'Test started successfully'
    })
  } catch (error) {
    console.error('Error starting test:', error)
    return NextResponse.json(
      { error: 'Failed to start test' },
      { status: 500 }
    )
  }
}

async function processTestRun(
  testRunId: string,
  promptContent: string,
  variableValues: Record<string, string>,
  models: string[]
) {
  // Replace variables in prompt
  let processedPrompt = promptContent
  for (const [key, value] of Object.entries(variableValues)) {
    processedPrompt = processedPrompt.replace(
      new RegExp(`{${key}}`, 'g'),
      value
    )
  }

  // Process each model
  for (const modelName of models) {
    try {
      const startTime = Date.now()
      
      // Get model provider details
      const modelProvider = await prisma.modelProvider.findFirst({
        where: { name: modelName, enabled: true },
      })

      if (!modelProvider) {
        await prisma.testResult.create({
          data: {
            testRunId,
            model: modelName,
            output: 'Model provider not found or disabled',
            responseTime: 0,
          },
        })
        continue
      }

      // Make API call based on provider
      const result = await callModelAPI({
        ...modelProvider,
        endpoint: modelProvider.endpoint || undefined,
      }, processedPrompt)
      const responseTime = Date.now() - startTime

      await prisma.testResult.create({
        data: {
          testRunId,
          model: modelName,
          output: result.output,
          responseTime,
        },
      })
    } catch (error) {
      console.error(`Error testing model ${modelName}:`, error)
      await prisma.testResult.create({
        data: {
          testRunId,
          model: modelName,
          output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          responseTime: 0,
        },
      })
    }
  }
}

async function callModelAPI(
  modelProvider: { name: string; displayName: string; provider: string; endpoint?: string; enabled: boolean; id: string },
  prompt: string
): Promise<{ output: string }> {
  const { ModelProviderService, getApiKey } = await import('@/lib/model-providers')
  
  try {
    const apiKey = getApiKey(modelProvider.provider)
    const result = await ModelProviderService.callModel(modelProvider, prompt, apiKey)
    return { output: result.output }
  } catch (error) {
    console.error(`Error calling ${modelProvider.name}:`, error)
    return {
      output: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    }
  }
}