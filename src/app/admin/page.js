'use client';

import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [closureDate, setClosureDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [closing, setClosing] = useState(false);

  /* 🔥 Calendar Sync State */
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      fetchBookings();
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setBookings([]);
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data.bookings || []);
      setLoading(false);
    } catch {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  /* 🔥 CALENDAR SYNC HANDLER */
  const handleCalendarSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      setSyncResult(null);

      const res = await fetch('/api/sync-calendar', {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Calendar sync failed');
      }

      setSyncResult(`✅ Synced ${data.synced} booking(s) to Google Calendar`);
      fetchBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const toMinutes = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const handleCloseStudio = async (e) => {
    e.preventDefault();

    if (!closureDate || !startTime || !endTime) {
      setError('Please fill all required fields');
      return;
    }

    if (toMinutes(startTime) >= toMinutes(endTime)) {
      setError('Start time must be before end time');
      return;
    }

    try {
      setClosing(true);
      setError(null);

      const res = await fetch('/api/studio-closures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: closureDate,
          startTime,
          endTime,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setClosureDate('');
      setStartTime('');
      setEndTime('');
      setReason('');
      alert('Studio closed successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setClosing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (response.ok) fetchBookings();
      else setError('Failed to delete booking');
    } catch {
      setError('Failed to delete booking');
    }
  };

  const formatTimeSlot = (timeSlot) => {
    try {
      const time = parse(timeSlot, 'HH:mm', new Date());
      return format(time, 'h:mm a');
    } catch {
      return timeSlot;
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter admin password"
              required
            />
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>

        {/* Error */}
        {error && <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>}

        {/* Close Studio */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Close Studio</h2>
          <form onSubmit={handleCloseStudio} className="grid md:grid-cols-4 gap-4">
            <input type="date" value={closureDate} onChange={(e) => {
              setClosureDate(e.target.value);
              e.target.blur();
            }} required className="border px-3 py-2 rounded-lg" />
            <input type="time" step="900" value={startTime || ""} onChange={(e) => setStartTime(e.target.value)} required className="border px-3 py-2 rounded-lg" />
            <input type="time" step="900" value={endTime || ""} onChange={(e) => setEndTime(e.target.value)} required className="border px-3 py-2 rounded-lg" />
            <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="border px-3 py-2 rounded-lg" />
            <button disabled={closing} className="bg-red-600 text-white px-6 py-2 rounded-lg">
              {closing ? 'Closing...' : 'Close Studio'}
            </button>
          </form>
        </div>

        {/* 🔥 Google Calendar Sync */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-2">Google Calendar Sync</h2>
          <p className="text-gray-600 mb-4">
            Sync unsynced bookings to the admin Google Calendar.
          </p>

          <button
            onClick={handleCalendarSync}
            disabled={syncing}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync to Calendar'}
          </button>

          {syncResult && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
              {syncResult}
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-8 text-center">No bookings yet.</div>
          ) : (
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  {['Baby', 'Age', 'Mobile', 'Type', 'Date', 'Time', 'Booked At', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="px-6 py-4">{b.babyName}</td>
                    <td className="px-6 py-4">{b.babyAge}</td>
                    <td className="px-6 py-4">{b.mobileNo}</td>
                    <td className="px-6 py-4">{b.photoType}</td>
                    <td className="px-6 py-4">{formatDate(b.date)}</td>
                    <td className="px-6 py-4">{formatTimeSlot(b.timeSlot)}</td>
                    <td className="px-6 py-4">
                      {b.createdAt ? format(new Date(b.createdAt), 'MMM dd, yyyy h:mm a') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(b.id)} className="text-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
