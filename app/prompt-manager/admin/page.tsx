'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ModelProvider {
  id: string
  name: string
  displayName: string
  provider: string
  endpoint?: string
  enabled: boolean
  costPer1k?: number
  createdAt: string
}

interface ModelPreset {
  id: string
  name: string
  displayName: string
  description?: string
  models: string[]
  createdAt: string
}

export default function AdminPage() {
  const [providers, setProviders] = useState<ModelProvider[]>([])
  const [presets, setPresets] = useState<ModelPreset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'providers' | 'presets'>('providers')

  // Provider form state
  const [showProviderForm, setShowProviderForm] = useState(false)
  const [editingProvider, setEditingProvider] = useState<ModelProvider | null>(null)
  const [providerForm, setProviderForm] = useState({
    name: '',
    displayName: '',
    provider: '',
    endpoint: '',
    costPer1k: '',
    enabled: true,
  })

  // Preset form state
  const [showPresetForm, setShowPresetForm] = useState(false)
  const [editingPreset, setEditingPreset] = useState<ModelPreset | null>(null)
  const [presetForm, setPresetForm] = useState({
    name: '',
    displayName: '',
    description: '',
    models: [] as string[],
  })
  const [availableModels, setAvailableModels] = useState<string[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [providersResponse, presetsResponse] = await Promise.all([
        fetch('/api/admin/models'),
        fetch('/api/admin/presets'),
      ])

      if (providersResponse.ok && presetsResponse.ok) {
        const providersData = await providersResponse.json()
        const presetsData = await presetsResponse.json()
        
        setProviders(providersData.providers)
        setPresets(presetsData.presets)
        setAvailableModels(providersData.providers.map((p: ModelProvider) => p.name))
      } else {
        setError('Failed to fetch admin data')
      }
    } catch (_err) {
      setError('Failed to fetch admin data')
    } finally {
      setLoading(false)
    }
  }

  const resetProviderForm = () => {
    setProviderForm({
      name: '',
      displayName: '',
      provider: '',
      endpoint: '',
      costPer1k: '',
      enabled: true,
    })
    setEditingProvider(null)
    setShowProviderForm(false)
  }

  const resetPresetForm = () => {
    setPresetForm({
      name: '',
      displayName: '',
      description: '',
      models: [],
    })
    setEditingPreset(null)
    setShowPresetForm(false)
  }

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      ...providerForm,
      costPer1k: providerForm.costPer1k ? parseFloat(providerForm.costPer1k) : null,
    }

    try {
      const response = editingProvider
        ? await fetch(`/api/admin/models/${editingProvider.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/models', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (response.ok) {
        await fetchData()
        resetProviderForm()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save provider')
      }
    } catch (_err) {
      setError('Failed to save provider')
    }
  }

  const handlePresetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = editingPreset
        ? await fetch(`/api/admin/presets/${editingPreset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(presetForm),
          })
        : await fetch('/api/admin/presets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(presetForm),
          })

      if (response.ok) {
        await fetchData()
        resetPresetForm()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save preset')
      }
    } catch (_err) {
      setError('Failed to save preset')
    }
  }

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return

    try {
      const response = await fetch(`/api/admin/models/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData()
      } else {
        setError('Failed to delete provider')
      }
    } catch (_err) {
      setError('Failed to delete provider')
    }
  }

  const handleDeletePreset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this preset?')) return

    try {
      const response = await fetch(`/api/admin/presets/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData()
      } else {
        setError('Failed to delete preset')
      }
    } catch (_err) {
      setError('Failed to delete preset')
    }
  }

  const handleEditProvider = (provider: ModelProvider) => {
    setProviderForm({
      name: provider.name,
      displayName: provider.displayName,
      provider: provider.provider,
      endpoint: provider.endpoint || '',
      costPer1k: provider.costPer1k?.toString() || '',
      enabled: provider.enabled,
    })
    setEditingProvider(provider)
    setShowProviderForm(true)
  }

  const handleEditPreset = (preset: ModelPreset) => {
    setPresetForm({
      name: preset.name,
      displayName: preset.displayName,
      description: preset.description || '',
      models: preset.models,
    })
    setEditingPreset(preset)
    setShowPresetForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/prompt-manager"
              className="text-gray-400 hover:text-white mr-4"
            >
              ← Back to Prompt Manager
            </Link>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 mt-2">
              Manage model providers and presets
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('providers')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'providers'
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Model Providers
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'presets'
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Model Presets
          </button>
        </div>

        {activeTab === 'providers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Model Providers</h2>
              <button
                onClick={() => setShowProviderForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Add Provider
              </button>
            </div>

            {showProviderForm && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingProvider ? 'Edit Provider' : 'Add New Provider'}
                </h3>
                <form onSubmit={handleProviderSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={providerForm.name}
                        onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })}
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., gpt-4"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Display Name</label>
                      <input
                        type="text"
                        value={providerForm.displayName}
                        onChange={(e) => setProviderForm({ ...providerForm, displayName: e.target.value })}
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., GPT-4"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Provider</label>
                      <select
                        value={providerForm.provider}
                        onChange={(e) => setProviderForm({ ...providerForm, provider: e.target.value })}
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        required
                      >
                        <option value="">Select provider</option>
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="local">Local</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Cost per 1k tokens</label>
                      <input
                        type="number"
                        step="0.001"
                        value={providerForm.costPer1k}
                        onChange={(e) => setProviderForm({ ...providerForm, costPer1k: e.target.value })}
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="0.030"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">API Endpoint (optional)</label>
                    <input
                      type="url"
                      value={providerForm.endpoint}
                      onChange={(e) => setProviderForm({ ...providerForm, endpoint: e.target.value })}
                      className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="https://api.openai.com/v1/chat/completions"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={providerForm.enabled}
                      onChange={(e) => setProviderForm({ ...providerForm, enabled: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <label htmlFor="enabled" className="ml-2 text-gray-300">
                      Enabled
                    </label>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      {editingProvider ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={resetProviderForm}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{provider.displayName}</h3>
                      <p className="text-gray-400 text-sm">
                        {provider.name} • {provider.provider}
                        {provider.costPer1k && ` • $${provider.costPer1k}/1k tokens`}
                      </p>
                      {provider.endpoint && (
                        <p className="text-gray-500 text-xs mt-1">{provider.endpoint}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          provider.enabled
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {provider.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => handleEditProvider(provider)}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProvider(provider.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Model Presets</h2>
              <button
                onClick={() => setShowPresetForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Add Preset
              </button>
            </div>

            {showPresetForm && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingPreset ? 'Edit Preset' : 'Add New Preset'}
                </h3>
                <form onSubmit={handlePresetSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={presetForm.name}
                        onChange={(e) => setPresetForm({ ...presetForm, name: e.target.value })}
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., cheap"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Display Name</label>
                      <input
                        type="text"
                        value={presetForm.displayName}
                        onChange={(e) => setPresetForm({ ...presetForm, displayName: e.target.value })}
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., Cheap Models"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <input
                      type="text"
                      value={presetForm.description}
                      onChange={(e) => setPresetForm({ ...presetForm, description: e.target.value })}
                      className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Optional description"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Models</label>
                    <div className="bg-gray-700 rounded p-3 max-h-40 overflow-y-auto">
                      {availableModels.map((model) => (
                        <label key={model} className="flex items-center space-x-2 p-1">
                          <input
                            type="checkbox"
                            checked={presetForm.models.includes(model)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPresetForm({
                                  ...presetForm,
                                  models: [...presetForm.models, model],
                                })
                              } else {
                                setPresetForm({
                                  ...presetForm,
                                  models: presetForm.models.filter(m => m !== model),
                                })
                              }
                            }}
                            className="form-checkbox h-4 w-4 text-purple-600"
                          />
                          <span className="text-sm">{model}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      {editingPreset ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={resetPresetForm}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {presets.map((preset) => (
                <div key={preset.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{preset.displayName}</h3>
                      <p className="text-gray-400 text-sm">
                        {preset.name} • {preset.models.length} models
                      </p>
                      {preset.description && (
                        <p className="text-gray-500 text-sm mt-1">{preset.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {preset.models.map((model) => (
                          <span
                            key={model}
                            className="bg-purple-600 text-white px-2 py-1 rounded text-xs"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditPreset(preset)}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}