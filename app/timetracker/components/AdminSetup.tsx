'use client';

import { useState } from 'react';

interface Props {
  onSuccess: () => void;
}

export default function AdminSetup({ onSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create admin account');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('Failed to create admin account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="paper max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 gradient-text text-center">
          Create Admin Account
        </h2>
        <p className="mb-6 text-center opacity-80">
          No users exist. Create the first admin account to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded bg-red-900 bg-opacity-20 border border-red-600 text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
              placeholder="admin"
              autoFocus
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded bg-primary text-background font-semibold hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
