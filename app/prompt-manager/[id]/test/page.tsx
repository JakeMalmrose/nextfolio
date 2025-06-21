'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface ModelProvider {
  id: string
  name: string
  displayName: string
  provider: string
  enabled: boolean
  costPer1k?: number
}

interface ModelPreset {
  id: string
  name: string
  displayName: string
  description?: string
  models: string[]
}

interface PromptVersion {
  id: string
  versionNumber: number
  content: string
  variables: string[]
}

interface TestResult {
  id: string
  model: string
  output: string
  responseTime: number
  passed: boolean | null
  createdAt: string
}

interface TestRun {
  id: string
  variableValues: Record<string, string>
  createdAt: string
  results: TestResult[]
  promptVersion: {
    prompt: {
      title: string
    }
  }
}

export default function TestPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [promptVersion, setPromptVersion] = useState<PromptVersion | null>(null)
  const [providers, setProviders] = useState<ModelProvider[]>([])
  const [presets, setPresets] = useState<ModelPreset[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [testRun, setTestRun] = useState<TestRun | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState('')
  const _router = useRouter()
  const searchParams = useSearchParams()
  const versionNumber = searchParams.get('version') || '1'

  useEffect(() => {
    fetchData()
  }, [resolvedParams.id, versionNumber]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (testRun?.id) {
      const interval = setInterval(() => {
        fetchTestRun(testRun.id)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [testRun?.id])

  const fetchData = async () => {
    try {
      const [promptResponse, modelsResponse] = await Promise.all([
        fetch(`/api/prompts/${resolvedParams.id}`),
        fetch('/api/models'),
      ])

      if (promptResponse.ok && modelsResponse.ok) {
        const promptData = await promptResponse.json()
        const modelsData = await modelsResponse.json()

        const version = promptData.prompt.versions.find(
          (v: PromptVersion) => v.versionNumber === Number(versionNumber)
        )
        
        setPromptVersion(version)
        setProviders(modelsData.providers)
        setPresets(modelsData.presets)

        // Initialize variable values
        const initialValues: Record<string, string> = {}
        version?.variables.forEach((variable: string) => {
          initialValues[variable] = ''
        })
        setVariableValues(initialValues)
      } else {
        setError('Failed to fetch data')
      }
    } catch (_err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const fetchTestRun = async (testRunId: string) => {
    try {
      const response = await fetch(`/api/test-runs/${testRunId}`)
      if (response.ok) {
        const data = await response.json()
        setTestRun(data.testRun)
        
        // Check if all tests are complete
        const pendingResults = data.testRun.results.filter(
          (result: TestResult) => !result.output
        )
        if (pendingResults.length === 0) {
          setTesting(false)
        }
      }
    } catch (_err) {
      console.error('Error fetching test run:', _err)
    }
  }

  const handlePresetSelect = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName)
    if (preset) {
      setSelectedModels(preset.models)
    }
  }

  const handleModelToggle = (modelName: string) => {
    setSelectedModels(prev =>
      prev.includes(modelName)
        ? prev.filter(m => m !== modelName)
        : [...prev, modelName]
    )
  }

  const handleStartTest = async () => {
    if (selectedModels.length === 0) {
      setError('Please select at least one model')
      return
    }

    // Check if all variables have values
    const missingVariables = promptVersion?.variables.filter(
      variable => !variableValues[variable]?.trim()
    ) || []

    if (missingVariables.length > 0) {
      setError(`Please provide values for: ${missingVariables.join(', ')}`)
      return
    }

    setTesting(true)
    setError('')

    try {
      const response = await fetch(`/api/prompts/${resolvedParams.id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionNumber: Number(versionNumber),
          variableValues,
          models: selectedModels,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        fetchTestRun(data.testRunId)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to start test')
        setTesting(false)
      }
    } catch (_err) {
      setError('Failed to start test')
      setTesting(false)
    }
  }

  const handleResultEvaluation = async (resultId: string, passed: boolean) => {
    try {
      const response = await fetch(`/api/test-runs/${testRun?.id}/results`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId, passed }),
      })

      if (response.ok) {
        // Refresh test run data
        if (testRun?.id) {
          fetchTestRun(testRun.id)
        }
      }
    } catch (err) {
      console.error('Error updating result:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!promptVersion) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Prompt version not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href={`/prompt-manager/${resolvedParams.id}`}
            className="text-gray-400 hover:text-white mr-4"
          >
            ← Back to Prompt
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Test Configuration</h1>
            <p className="text-gray-400 mt-2">
              Version {versionNumber} • {promptVersion.variables.length} variables
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        {!testRun ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Model Selection */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Select Models</h2>
              
              {/* Presets */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.name)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded text-sm transition duration-200"
                    >
                      {preset.displayName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Models */}
              <div>
                <h3 className="text-lg font-medium mb-3">Individual Models</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {providers.map((provider) => (
                    <label
                      key={provider.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedModels.includes(provider.name)}
                        onChange={() => handleModelToggle(provider.name)}
                        className="form-checkbox h-4 w-4 text-purple-600"
                      />
                      <span className="flex-1">{provider.displayName}</span>
                      {provider.costPer1k && (
                        <span className="text-xs text-gray-400">
                          ${provider.costPer1k}/1k
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-700 rounded">
                <p className="text-sm text-gray-300">
                  {selectedModels.length} models selected
                </p>
              </div>
            </div>

            {/* Variables */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Variable Values</h2>
              
              {promptVersion.variables.length === 0 ? (
                <p className="text-gray-400">No variables in this prompt</p>
              ) : (
                <div className="space-y-4">
                  {promptVersion.variables.map((variable) => (
                    <div key={variable}>
                      <label className="block text-gray-300 mb-2 font-medium">
                        {variable}
                      </label>
                      <textarea
                        value={variableValues[variable] || ''}
                        onChange={(e) =>
                          setVariableValues(prev => ({
                            ...prev,
                            [variable]: e.target.value,
                          }))
                        }
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                        rows={3}
                        placeholder={`Enter value for {${variable}}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={handleStartTest}
                  disabled={testing || selectedModels.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded transition duration-200"
                >
                  {testing ? 'Starting Test...' : 'Run Test'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Test Results */
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              
              {testing && (
                <div className="mb-4 p-4 bg-blue-500 text-white rounded">
                  Test in progress... Results will appear as they complete.
                </div>
              )}

              <div className="space-y-4">
                {testRun.results.map((result) => (
                  <div key={result.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium">{result.model}</h3>
                      <div className="flex items-center space-x-2">
                        {result.responseTime > 0 && (
                          <span className="text-sm text-gray-400">
                            {result.responseTime}ms
                          </span>
                        )}
                        {result.passed !== null && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              result.passed
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {result.passed ? 'PASS' : 'FAIL'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded p-3 mb-3">
                      <pre className="whitespace-pre-wrap text-sm text-gray-200">
                        {result.output || 'Waiting for response...'}
                      </pre>
                    </div>

                    {result.output && result.passed === null && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleResultEvaluation(result.id, true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition duration-200"
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => handleResultEvaluation(result.id, false)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition duration-200"
                        >
                          Fail
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}