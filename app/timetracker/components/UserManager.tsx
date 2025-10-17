'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

interface Props {
  isAdmin: boolean;
}

export default function UserManager({ isAdmin }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchUsers();
    }
  }, [isOpen, isAdmin]);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!newUsername || !newPassword) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      });

      if (res.ok) {
        setNewUsername('');
        setNewPassword('');
        setNewRole('user');
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded border border-primary text-primary hover:bg-primary hover:text-background transition"
      >
        Manage Users
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="paper max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl hover:text-primary transition"
              >
                ×
              </button>
            </div>

            {/* Create New User */}
            <div className="mb-6 p-4 border border-primary rounded">
              <h3 className="text-lg font-semibold mb-3">Create New User</h3>
              <form onSubmit={handleCreateUser} className="space-y-3">
                {error && (
                  <div className="p-3 rounded bg-red-900 bg-opacity-20 border border-red-600 text-red-400">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
                  />
                </div>

                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="user"
                      checked={newRole === 'user'}
                      onChange={(e) => setNewRole('user')}
                      className="w-4 h-4"
                    />
                    <span>User (Read-only)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="admin"
                      checked={newRole === 'admin'}
                      onChange={(e) => setNewRole('admin')}
                      className="w-4 h-4"
                    />
                    <span>Admin (Full Access)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 rounded bg-primary text-background font-semibold hover:opacity-80 transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>

            {/* User List */}
            <div>
              <h3 className="text-lg font-semibold mb-3">All Users ({users.length})</h3>
              {users.length === 0 ? (
                <p className="text-center opacity-70 py-8">No users found.</p>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 rounded border border-gray-600 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm opacity-70">
                          Role: {user.role} • Created:{' '}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`chip ${
                          user.role === 'admin' ? 'chip-primary' : 'chip-secondary'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
