'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PromptVersion {
  id: string
  versionNumber: number
  content: string
  variables: string[]
  createdAt: string
}

interface Prompt {
  id: string
  title: string
  currentVersion: number
  updatedAt: string
  versions: PromptVersion[]
}

export default function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<number>(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editVariables, setEditVariables] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPrompt()
  }, [resolvedParams.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompts/${resolvedParams.id}`)
      if (response.ok) {
        const data = await response.json()
        setPrompt(data.prompt)
        setSelectedVersion(data.prompt.currentVersion)
        setEditTitle(data.prompt.title)
        setEditContent(data.prompt.versions[0]?.content || '')
        setEditVariables(data.prompt.versions[0]?.variables || [])
      } else if (response.status === 401) {
        router.push('/prompt-manager')
      } else {
        setError('Failed to fetch prompt')
      }
    } catch (_err) {
      setError('Failed to fetch prompt')
    } finally {
      setLoading(false)
    }
  }

  const extractVariables = (text: string) => {
    const regex = /{([^}]+)}/g
    const found = new Set<string>()
    let match

    while ((match = regex.exec(text)) !== null) {
      found.add(match[1].trim())
    }

    setEditVariables(Array.from(found))
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setEditContent(newContent)
    extractVariables(newContent)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/prompts/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      })

      if (response.ok) {
        setIsEditing(false)
        fetchPrompt()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save prompt')
      }
    } catch (_err) {
      setError('Failed to save prompt')
    } finally {
      setSaving(false)
    }
  }

  const handleVersionChange = (versionNumber: number) => {
    const version = prompt?.versions.find(v => v.versionNumber === versionNumber)
    if (version) {
      setSelectedVersion(versionNumber)
      setEditTitle(prompt!.title)
      setEditContent(version.content)
      setEditVariables(version.variables)
    }
  }

  const handleStartTest = () => {
    router.push(`/prompt-manager/${resolvedParams.id}/test?version=${selectedVersion}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Prompt not found</div>
      </div>
    )
  }

  const currentVersionData = prompt.versions.find(v => v.versionNumber === selectedVersion)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/prompt-manager"
              className="text-gray-400 hover:text-white mr-4"
            >
              ← Back to Prompts
            </Link>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-3xl font-bold bg-transparent border-b border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              ) : (
                <h1 className="text-3xl font-bold">{prompt.title}</h1>
              )}
              <p className="text-gray-400 mt-2">
                Version {selectedVersion} of {prompt.versions.length} • Last updated{' '}
                {new Date(prompt.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedVersion}
              onChange={(e) => handleVersionChange(Number(e.target.value))}
              className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
            >
              {prompt.versions.map((version) => (
                <option key={version.id} value={version.versionNumber}>
                  Version {version.versionNumber}
                </option>
              ))}
            </select>

            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Prompt Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Prompt Content</h2>
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={handleContentChange}
                  className="w-full h-96 p-4 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none font-mono text-sm resize-none"
                  placeholder="Enter your prompt here. Use {variable_name} syntax for variables."
                />
              ) : (
                <div className="bg-gray-700 rounded p-4 h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-200">
                    {currentVersionData?.content}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Test Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Test Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleStartTest}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200"
                >
                  Run Test
                </button>
                <Link
                  href={`/prompt-manager/${resolvedParams.id}/history`}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200 block text-center"
                >
                  View Test History
                </Link>
              </div>
            </div>

            {/* Variables */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Variables</h3>
              {(isEditing ? editVariables : currentVersionData?.variables || []).length === 0 ? (
                <p className="text-gray-400 text-sm">No variables detected</p>
              ) : (
                <div className="space-y-2">
                  {(isEditing ? editVariables : currentVersionData?.variables || []).map((variable, index) => (
                    <div
                      key={index}
                      className="bg-purple-600 text-white px-3 py-2 rounded text-sm"
                    >
                      {variable}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Version Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Version Info</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <strong>Created:</strong>{' '}
                  {currentVersionData && new Date(currentVersionData.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Variables:</strong> {currentVersionData?.variables.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}