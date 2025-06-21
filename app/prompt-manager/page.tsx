'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Prompt {
  id: string
  title: string
  currentVersion: number
  updatedAt: string
  versions: Array<{
    id: string
    versionNumber: number
    content: string
    variables: string[]
    createdAt: string
  }>
  _count: {
    versions: number
  }
}

export default function PromptManagerPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [_showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' })
  const [showRegister, setShowRegister] = useState(false)
  const _router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (response.ok) {
        setIsAuthenticated(true)
        const data = await response.json()
        setPrompts(data.prompts)
      } else {
        setIsAuthenticated(false)
        setShowLogin(true)
      }
    } catch (_err) {
      setError('Failed to check authentication')
      setIsAuthenticated(false)
      setShowLogin(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setShowLogin(false)
        checkAuth()
      } else {
        const data = await response.json()
        setError(data.error || 'Login failed')
      }
    } catch (_err) {
      setError('Login failed')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setShowRegister(false)
        checkAuth()
      } else {
        const data = await response.json()
        setError(data.error || 'Registration failed')
      }
    } catch (_err) {
      setError('Registration failed')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setPrompts([])
      setShowLogin(true)
    } catch (_err) {
      setError('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Prompt Manager
          </h1>
          
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}

          {!showRegister ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200"
              >
                Login
              </button>
              <p className="text-gray-400 text-center">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Register
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-200"
              >
                Register
              </button>
              <p className="text-gray-400 text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Prompt Manager</h1>
            <p className="text-gray-400 mt-2">
              Manage and test your AI prompts across multiple models
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/prompt-manager/create"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Create Prompt
            </Link>
            <Link
              href="/prompt-manager/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Admin
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Prompts Grid */}
        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No prompts yet</div>
            <Link
              href="/prompt-manager/create"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded transition duration-200"
            >
              Create Your First Prompt
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompt-manager/${prompt.id}`}
                className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition duration-200 block"
              >
                <h3 className="text-xl font-semibold mb-2">{prompt.title}</h3>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>Version {prompt.currentVersion}</p>
                  <p>{prompt._count.versions} total versions</p>
                  <p>
                    Updated{' '}
                    {new Date(prompt.updatedAt).toLocaleDateString()}
                  </p>
                  {prompt.versions[0]?.variables.length > 0 && (
                    <p>
                      Variables: {prompt.versions[0].variables.join(', ')}
                    </p>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-300 line-clamp-3">
                  {prompt.versions[0]?.content?.substring(0, 150)}...
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}