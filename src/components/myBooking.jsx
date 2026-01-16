'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setError('Please login to see your bookings');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/bookings/user/${userId}`);
        setBookings(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          'Failed to load bookings'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const deleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await axios.delete(`/api/bookings/${id}`);

      // SAME LOGIC AS ADMIN
      setBookings(prev =>
        prev.filter(b => b.id !== id)
      );
    } catch (err) {
      alert(
        err.response?.data?.error ||
        'Failed to delete booking'
      );
    }
  };

  if (loading) return <p className="text-center">Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (bookings.length === 0) {
    return (
      <p className="text-center text-gray-500">
        You have no bookings yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div
          key={booking.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div className="text-sm text-gray-700">
            <p><strong>Baby:</strong> {booking.babyName}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.timeSlot}</p>
            <p><strong>Type:</strong> {booking.photoType}</p>
          </div>

          <button
            onClick={() => deleteBooking(booking.id)}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
