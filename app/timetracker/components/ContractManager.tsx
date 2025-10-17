'use client';

import { useState } from 'react';

interface Contract {
  id: string;
  name: string;
  color: string;
  _count?: {
    timeEntries: number;
  };
}

interface Props {
  contracts: Contract[];
  onUpdate: () => void;
}

export default function ContractManager({ contracts, onUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [newContractName, setNewContractName] = useState('');
  const [newContractColor, setNewContractColor] = useState('#bb86fc');
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreateContract() {
    if (!newContractName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newContractName.trim(),
          color: newContractColor,
        }),
      });

      if (res.ok) {
        setNewContractName('');
        setNewContractColor('#bb86fc');
        onUpdate();
      }
    } catch (error) {
      console.error('Error creating contract:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateContract() {
    if (!editingContract || !editingContract.name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${editingContract.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingContract.name.trim(),
          color: editingContract.color,
        }),
      });

      if (res.ok) {
        setEditingContract(null);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating contract:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteContract(id: string) {
    if (!confirm('Are you sure you want to delete this contract? All associated time entries will also be deleted.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded bg-primary text-background font-semibold hover:opacity-80 transition"
      >
        Manage Contracts
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="paper max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Contracts</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl hover:text-primary transition"
              >
                ×
              </button>
            </div>

            {/* Create New Contract */}
            <div className="mb-6 p-4 border border-primary rounded">
              <h3 className="text-lg font-semibold mb-3">Add New Contract</h3>
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Contract name"
                  value={newContractName}
                  onChange={(e) => setNewContractName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateContract()}
                />
                <input
                  type="color"
                  value={newContractColor}
                  onChange={(e) => setNewContractColor(e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <button
                  onClick={handleCreateContract}
                  disabled={loading || !newContractName.trim()}
                  className="px-4 py-2 rounded bg-primary text-background font-semibold hover:opacity-80 transition disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Contract List */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Existing Contracts</h3>
              {contracts.length === 0 ? (
                <p className="text-center opacity-70 py-8">No contracts yet. Create one to get started!</p>
              ) : (
                <div className="space-y-3">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="p-4 rounded border border-gray-600 hover:border-primary transition"
                    >
                      {editingContract?.id === contract.id ? (
                        <div className="flex gap-3 flex-wrap items-center">
                          <input
                            type="text"
                            value={editingContract.name}
                            onChange={(e) =>
                              setEditingContract({ ...editingContract, name: e.target.value })
                            }
                            className="flex-1 px-3 py-2 rounded bg-background-paper border border-gray-600 focus:border-primary outline-none"
                          />
                          <input
                            type="color"
                            value={editingContract.color}
                            onChange={(e) =>
                              setEditingContract({ ...editingContract, color: e.target.value })
                            }
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <button
                            onClick={handleUpdateContract}
                            disabled={loading}
                            className="px-3 py-2 rounded bg-primary text-background font-semibold hover:opacity-80 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingContract(null)}
                            className="px-3 py-2 rounded border border-gray-600 hover:border-primary transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: contract.color }}
                            />
                            <span className="font-semibold">{contract.name}</span>
                            {contract._count && (
                              <span className="text-sm opacity-70">
                                ({contract._count.timeEntries} entries)
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingContract(contract)}
                              className="px-3 py-1 text-sm rounded border border-gray-600 hover:border-primary transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteContract(contract.id)}
                              disabled={loading}
                              className="px-3 py-1 text-sm rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
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
