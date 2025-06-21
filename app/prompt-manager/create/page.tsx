'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreatePromptPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [variables, setVariables] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const extractVariables = (text: string) => {
    const regex = /{([^}]+)}/g
    const found = new Set<string>()
    let match

    while ((match = regex.exec(text)) !== null) {
      found.add(match[1].trim())
    }

    setVariables(Array.from(found))
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    extractVariables(newContent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/prompt-manager/${data.prompt.id}`)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create prompt')
      }
    } catch (_err) {
      setError('Failed to create prompt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/prompt-manager"
            className="text-gray-400 hover:text-white mr-4"
          >
            ← Back to Prompts
          </Link>
          <h1 className="text-3xl font-bold">Create New Prompt</h1>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Prompt Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Enter a descriptive title for your prompt"
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prompt Content */}
            <div className="lg:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">
                Prompt Content
              </label>
              <textarea
                value={content}
                onChange={handleContentChange}
                className="w-full h-96 p-4 bg-gray-800 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none font-mono text-sm resize-none"
                placeholder="Enter your prompt here. Use {variable_name} syntax for variables."
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Use curly braces to define variables: {'{variable_name}'}
              </p>
            </div>

            {/* Variables Panel */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Detected Variables
              </label>
              <div className="bg-gray-800 rounded p-4 border border-gray-600">
                {variables.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No variables detected. Add {'{variable_name}'} to your prompt.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {variables.map((variable, index) => (
                      <div
                        key={index}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
                      >
                        {variable}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/prompt-manager"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded transition duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded transition duration-200"
            >
              {loading ? 'Creating...' : 'Create Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}