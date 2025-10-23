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

interface DayGroup {
  date: string;
  entries: TimeEntry[];
  totalHours: number;
}

interface Props {
  contracts: Contract[];
}

export default function ReportSection({ contracts }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedContractIds, setSelectedContractIds] = useState<string[]>([]);
  const [reportData, setReportData] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  function toggleContract(contractId: string) {
    setSelectedContractIds(prev => {
      if (prev.includes(contractId)) {
        return prev.filter(id => id !== contractId);
      } else {
        return [...prev, contractId];
      }
    });
  }

  function toggleAll() {
    if (selectedContractIds.length === contracts.length) {
      setSelectedContractIds([]);
    } else {
      setSelectedContractIds(contracts.map(c => c.id));
    }
  }

  async function generateReport() {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }

    setLoading(true);
    try {
      let url = `/api/time-entries?startDate=${startDate}&endDate=${endDate}`;
      if (selectedContractIds.length > 0) {
        url += `&contractIds=${selectedContractIds.join(',')}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const entries: TimeEntry[] = await res.json();

        // Group entries by day
        const groupedByDay = entries.reduce((acc: Record<string, DayGroup>, entry) => {
          const dateStr = new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          if (!acc[dateStr]) {
            acc[dateStr] = {
              date: dateStr,
              entries: [],
              totalHours: 0
            };
          }

          acc[dateStr].entries.push(entry);
          acc[dateStr].totalHours += entry.hoursWorked;

          return acc;
        }, {});

        // Convert to array and sort by date (most recent first)
        const sortedDays = Object.values(groupedByDay).sort((a, b) => {
          const dateA = new Date(a.entries[0].date);
          const dateB = new Date(b.entries[0].date);
          return dateB.getTime() - dateA.getTime();
        });

        setReportData(sortedDays);
        setHasGenerated(true);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  }

  const totalHours = reportData.reduce((sum, day) => sum + day.totalHours, 0);
  const totalDays = reportData.length;

  return (
    <div className="paper">
      <h2 className="text-2xl font-bold mb-6 gradient-text">Time Report</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Project Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium">Filter by Projects</label>
          <button
            onClick={toggleAll}
            className="text-sm text-primary hover:underline"
          >
            {selectedContractIds.length === contracts.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {contracts.map((contract) => (
            <label
              key={contract.id}
              className="flex items-center gap-2 p-3 rounded bg-gray-800 border border-gray-600 hover:border-gray-500 cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={selectedContractIds.includes(contract.id)}
                onChange={() => toggleContract(contract.id)}
                className="w-4 h-4 rounded accent-primary"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: contract.color }}
                />
                <span className="truncate">{contract.name}</span>
              </div>
            </label>
          ))}
        </div>
        {contracts.length === 0 && (
          <p className="text-sm opacity-70 text-center py-4">
            No projects available. Create a project first.
          </p>
        )}
      </div>

      <button
        onClick={generateReport}
        disabled={loading}
        className="w-full md:w-auto px-6 py-2 rounded bg-primary hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>

      {/* Report Results */}
      {hasGenerated && (
        <div className="mt-8">
          {reportData.length === 0 ? (
            <div className="text-center py-8 opacity-70">
              <p>No time entries found for the selected date range and filters.</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="mb-6 p-4 rounded bg-gray-800 border border-gray-600">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm opacity-70">Total Hours</p>
                    <p className="text-2xl font-bold text-primary">{totalHours.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Total Days</p>
                    <p className="text-2xl font-bold">{totalDays}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-sm opacity-70">Average Hours/Day</p>
                    <p className="text-2xl font-bold">{(totalHours / totalDays).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Daily Breakdown */}
              <div className="space-y-4">
                {reportData.map((day) => (
                  <div
                    key={day.date}
                    className="p-4 rounded bg-gray-800 border border-gray-600"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg">{day.date}</h3>
                      <span className="text-primary font-semibold">
                        {day.totalHours.toFixed(2)} hours
                      </span>
                    </div>

                    <div className="space-y-3">
                      {day.entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="pl-4 border-l-4 py-2"
                          style={{ borderColor: entry.contract.color }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span
                                className="font-semibold"
                                style={{ color: entry.contract.color }}
                              >
                                {entry.contract.name}
                              </span>
                              <span className="ml-2 text-sm opacity-70">
                                {entry.hoursWorked} {entry.hoursWorked === 1 ? 'hour' : 'hours'}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm">{entry.tasks}</p>
                          {entry.notes && (
                            <p className="text-sm opacity-70 mt-1 italic">{entry.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
