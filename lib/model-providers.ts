interface ModelProvider {
  id: string
  name: string
  displayName: string
  provider: string
  endpoint?: string
  enabled: boolean
  costPer1k?: number
}

interface ModelApiResponse {
  output: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export class ModelProviderService {
  static async callModel(
    modelProvider: ModelProvider,
    prompt: string,
    apiKey?: string
  ): Promise<ModelApiResponse> {
    switch (modelProvider.provider) {
      case 'openai':
        return this.callOpenAI(modelProvider, prompt, apiKey)
      case 'anthropic':
        return this.callAnthropic(modelProvider, prompt, apiKey)
      case 'local':
        return this.callLocal(modelProvider, prompt)
      default:
        return this.callGeneric(modelProvider, prompt, apiKey)
    }
  }

  private static async callOpenAI(
    modelProvider: ModelProvider,
    prompt: string,
    apiKey?: string
  ): Promise<ModelApiResponse> {
    const endpoint = modelProvider.endpoint || 'https://api.openai.com/v1/chat/completions'
    
    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelProvider.name,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    
    return {
      output: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    }
  }

  private static async callAnthropic(
    modelProvider: ModelProvider,
    prompt: string,
    apiKey?: string
  ): Promise<ModelApiResponse> {
    const endpoint = modelProvider.endpoint || 'https://api.anthropic.com/v1/messages'
    
    if (!apiKey) {
      throw new Error('Anthropic API key is required')
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelProvider.name,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Anthropic API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    
    return {
      output: data.content[0]?.text || 'No response generated',
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      } : undefined,
    }
  }

  private static async callLocal(
    modelProvider: ModelProvider,
    prompt: string
  ): Promise<ModelApiResponse> {
    // For local models, we'll use OpenAI-compatible format
    // This works with OpenWebUI and other local OpenAI-compatible APIs
    const endpoint = modelProvider.endpoint || 'http://localhost:11434/v1/chat/completions'

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelProvider.name,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Local API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    
    return {
      output: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      } : undefined,
    }
  }

  private static async callGeneric(
    modelProvider: ModelProvider,
    prompt: string,
    apiKey?: string
  ): Promise<ModelApiResponse> {
    // Generic OpenAI-compatible endpoint
    if (!modelProvider.endpoint) {
      throw new Error('Endpoint is required for generic providers')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const response = await fetch(modelProvider.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelProvider.name,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    
    return {
      output: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      } : undefined,
    }
  }
}

// Helper function to get API keys from environment or user settings
export function getApiKey(provider: string): string | undefined {
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY
    default:
      return undefined
  }
}