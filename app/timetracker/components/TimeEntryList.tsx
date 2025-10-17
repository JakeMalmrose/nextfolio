'use client';

import { useState } from 'react';

interface Contract {
  id: string;
  name: string;
  color: string;
}

interface TimeEntry {
  id: string;
  contractId: string;
  date: string;
  hoursWorked: number;
  tasks: string;
  notes: string | null;
  contract: Contract;
}

interface Props {
  entries: TimeEntry[];
  onUpdate: () => void;
  contracts: Contract[];
  isAdmin: boolean;
}

export default function TimeEntryList({ entries, onUpdate, contracts, isAdmin }: Props) {
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpdateEntry() {
    if (!editingEntry) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/time-entries/${editingEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: editingEntry.contractId,
          date: editingEntry.date,
          hoursWorked: editingEntry.hoursWorked,
          tasks: editingEntry.tasks,
          notes: editingEntry.notes,
        }),
      });

      if (res.ok) {
        setEditingEntry(null);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating time entry:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEntry(id: string) {
    if (!confirm('Are you sure you want to delete this time entry?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/time-entries/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting time entry:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (entries.length === 0) {
    return (
      <div className="paper">
        <h2 className="text-xl font-bold mb-4">Time Entries</h2>
        <p className="text-center opacity-70 py-8">No time entries for this week.</p>
      </div>
    );
  }

  return (
    <div className="paper">
      <h2 className="text-xl font-bold mb-4">Time Entries ({entries.length})</h2>

      <div className="space-y-4">
        {entries.map((entry) => {
          const isEditing = isAdmin && editingEntry?.id === entry.id;

          return (
            <div
              key={entry.id}
              className="p-4 rounded border border-gray-600 hover:border-primary transition"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-sm font-medium">Contract</label>
                      <select
                        value={editingEntry.contractId}
                        onChange={(e) =>
                          setEditingEntry({ ...editingEntry, contractId: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
                      >
                        {contracts.map((contract) => (
                          <option key={contract.id} value={contract.id}>
                            {contract.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Date</label>
                      <input
                        type="date"
                        value={editingEntry.date.split('T')[0]}
                        onChange={(e) =>
                          setEditingEntry({ ...editingEntry, date: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Hours Worked</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0.25"
                      value={editingEntry.hoursWorked}
                      onChange={(e) =>
                        setEditingEntry({
                          ...editingEntry,
                          hoursWorked: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Tasks</label>
                    <textarea
                      value={editingEntry.tasks}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, tasks: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Notes</label>
                    <textarea
                      value={editingEntry.notes || ''}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, notes: e.target.value || null })
                      }
                      rows={2}
                      className="w-full px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateEntry}
                      disabled={loading}
                      className="px-4 py-2 rounded bg-primary text-background font-semibold hover:opacity-80 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingEntry(null)}
                      className="px-4 py-2 rounded border border-gray-600 hover:border-primary transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded flex-shrink-0"
                        style={{ backgroundColor: entry.contract.color }}
                      />
                      <div>
                        <p className="font-semibold">{entry.contract.name}</p>
                        <p className="text-sm opacity-70">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">{entry.hoursWorked} hrs</span>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="px-3 py-1 text-sm rounded border border-gray-600 hover:border-primary transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            disabled={loading}
                            className="px-3 py-1 text-sm rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium opacity-70">Tasks:</p>
                      <p className="whitespace-pre-wrap">{entry.tasks}</p>
                    </div>
                    {entry.notes && (
                      <div>
                        <p className="text-sm font-medium opacity-70">Notes:</p>
                        <p className="whitespace-pre-wrap opacity-80">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
