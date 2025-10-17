'use client';

import { useState } from 'react';

interface Contract {
  id: string;
  name: string;
  color: string;
}

interface Props {
  contracts: Contract[];
  onEntryCreated: () => void;
  currentWeekStart: Date;
}

export default function TimeEntryForm({ contracts, onEntryCreated, currentWeekStart }: Props) {
  const [contractId, setContractId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hoursWorked, setHoursWorked] = useState('');
  const [tasks, setTasks] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!contractId || !date || !hoursWorked || !tasks.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const hours = parseFloat(hoursWorked);
    if (isNaN(hours) || hours <= 0) {
      setError('Hours worked must be a positive number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          date,
          hoursWorked: hours,
          tasks: tasks.trim(),
          notes: notes.trim() || null,
        }),
      });

      if (res.ok) {
        // Reset form
        setContractId('');
        setDate(new Date().toISOString().split('T')[0]);
        setHoursWorked('');
        setTasks('');
        setNotes('');
        onEntryCreated();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create entry');
      }
    } catch (error) {
      console.error('Error creating time entry:', error);
      setError('Failed to create entry');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="paper">
      <h2 className="text-xl font-bold mb-4">Log Time Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded bg-red-900 bg-opacity-20 border border-red-600 text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium">
            Contract <span className="text-red-500">*</span>
          </label>
          <select
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
            required
          >
            <option value="">Select a contract</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.name}
              </option>
            ))}
          </select>
          {contracts.length === 0 && (
            <p className="text-sm text-secondary mt-1">
              No contracts available. Create one using "Manage Contracts" button.
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Hours Worked <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.25"
            min="0.25"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
            placeholder="e.g., 8 or 8.5"
            className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Tasks Completed <span className="text-red-500">*</span>
          </label>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Describe what you worked on..."
            rows={4}
            className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none resize-none"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes or context..."
            rows={2}
            className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || contracts.length === 0}
          className="w-full px-4 py-3 rounded bg-primary text-background font-semibold hover:opacity-80 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Log Time Entry'}
        </button>
      </form>
    </div>
  );
}
