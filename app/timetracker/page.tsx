'use client';

import { useState, useEffect } from 'react';
import ContractManager from './components/ContractManager';
import TimeEntryForm from './components/TimeEntryForm';
import TimeEntryList from './components/TimeEntryList';
import WeeklyBreakdown from './components/WeeklyBreakdown';
import AdminSetup from './components/AdminSetup';
import LoginModal from './components/LoginModal';
import UserManager from './components/UserManager';
import ReportSection from './components/ReportSection';

interface Contract {
  id: string;
  name: string;
  color: string;
  _count?: {
    timeEntries: number;
  };
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

interface User {
  id: string;
  username: string;
  role: string;
}

export default function TimeTracker() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));

  // Auth state
  const [hasUsers, setHasUsers] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchContracts();
      fetchTimeEntries();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTimeEntries();
    }
  }, [currentWeekStart]);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/check');
      if (res.ok) {
        const data = await res.json();
        setHasUsers(data.hasUsers);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setAuthChecked(true);
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  function getWeekEnd(weekStart: Date): Date {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d;
  }

  function toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async function fetchContracts() {
    try {
      const res = await fetch('/api/contracts');
      if (res.ok) {
        const data = await res.json();
        setContracts(data);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }

  async function fetchTimeEntries() {
    try {
      const weekEnd = getWeekEnd(currentWeekStart);
      const res = await fetch(
        `/api/time-entries?startDate=${toDateString(currentWeekStart)}&endDate=${toDateString(weekEnd)}`
      );
      if (res.ok) {
        const data = await res.json();
        setTimeEntries(data);
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  }

  function goToPreviousWeek() {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeekStart(newWeek);
  }

  function goToNextWeek() {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeekStart(newWeek);
  }

  function goToCurrentWeek() {
    setCurrentWeekStart(getWeekStart(new Date()));
  }

  const weekEnd = getWeekEnd(currentWeekStart);
  const isCurrentWeek = getWeekStart(new Date()).getTime() === currentWeekStart.getTime();
  const isAdmin = user?.role === 'admin';

  // Show loading state
  if (loading || !authChecked) {
    return (
      <div className="mt-8 mb-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Show admin setup if no users exist
  if (!hasUsers) {
    return <AdminSetup onSuccess={checkAuth} />;
  }

  // Show login modal if not authenticated
  if (!user) {
    return <LoginModal onSuccess={checkAuth} />;
  }

  // Main app (authenticated)
  return (
    <div className="mt-8 mb-16">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text">Time Tracker</h1>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm opacity-70">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded border border-gray-600 hover:border-red-600 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="flex gap-4 mb-8">
          <ContractManager contracts={contracts} onUpdate={fetchContracts} />
          <UserManager isAdmin={isAdmin} />
        </div>
      )}

      {/* Week Navigation */}
      <div className="paper mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={goToPreviousWeek}
            className="px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            ← Previous Week
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold">
              {currentWeekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
            </p>
            {!isCurrentWeek && (
              <button
                onClick={goToCurrentWeek}
                className="text-sm text-primary hover:underline mt-1"
              >
                Go to Current Week
              </button>
            )}
          </div>
          <button
            onClick={goToNextWeek}
            className="px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Next Week →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left side: Entry Form (admin only) */}
        {isAdmin ? (
          <div>
            <TimeEntryForm
              contracts={contracts}
              onEntryCreated={fetchTimeEntries}
              currentWeekStart={currentWeekStart}
            />
          </div>
        ) : (
          <div className="paper">
            <h2 className="text-xl font-bold mb-4">Log Time Entry</h2>
            <p className="text-center opacity-70 py-8">
              You have read-only access. Only admins can log time entries.
            </p>
          </div>
        )}

        {/* Right side: Weekly Breakdown */}
        <div>
          <WeeklyBreakdown
            weekStart={currentWeekStart}
            weekEnd={weekEnd}
          />
        </div>
      </div>

      {/* Time Entries List */}
      <TimeEntryList
        entries={timeEntries}
        onUpdate={fetchTimeEntries}
        contracts={contracts}
        isAdmin={isAdmin}
      />

      {/* Report Section */}
      <div className="mt-8">
        <ReportSection contracts={contracts} />
      </div>
    </div>
  );
}
