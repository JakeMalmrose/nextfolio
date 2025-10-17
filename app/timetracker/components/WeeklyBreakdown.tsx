'use client';

import { useState, useEffect } from 'react';

interface Contract {
  id: string;
  name: string;
  color: string;
}

interface TimeEntry {
  id: string;
  hoursWorked: number;
  date: string;
}

interface WeeklyData {
  contract: Contract;
  totalHours: number;
  entries: TimeEntry[];
}

interface Props {
  weekStart: Date;
  weekEnd: Date;
}

export default function WeeklyBreakdown({ weekStart, weekEnd }: Props) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyData();
  }, [weekStart, weekEnd]);

  async function fetchWeeklyData() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/time-entries/weekly?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`
      );
      if (res.ok) {
        const data = await res.json();
        setWeeklyData(data);
      }
    } catch (error) {
      console.error('Error fetching weekly breakdown:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalWeekHours = weeklyData.reduce((sum, data) => sum + data.totalHours, 0);

  if (loading) {
    return (
      <div className="paper">
        <h2 className="text-xl font-bold mb-4">Weekly Breakdown</h2>
        <p className="text-center opacity-70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="paper">
      <h2 className="text-xl font-bold mb-4">Weekly Breakdown</h2>

      {weeklyData.length === 0 ? (
        <p className="text-center opacity-70 py-8">No time entries for this week yet.</p>
      ) : (
        <>
          <div className="mb-4 p-4 rounded bg-primary bg-opacity-10 border border-primary">
            <p className="text-sm opacity-70">Total Hours This Week</p>
            <p className="text-3xl font-bold">{totalWeekHours.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            {weeklyData.map((data) => {
              const percentage = totalWeekHours > 0 ? (data.totalHours / totalWeekHours) * 100 : 0;

              return (
                <div key={data.contract.id} className="p-4 rounded border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: data.contract.color }}
                      />
                      <span className="font-semibold">{data.contract.name}</span>
                    </div>
                    <span className="text-lg font-bold">{data.totalHours.toFixed(2)} hrs</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: data.contract.color,
                      }}
                    />
                  </div>

                  <p className="text-sm opacity-70 mt-2">
                    {percentage.toFixed(1)}% of weekly total • {data.entries.length} entries
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
