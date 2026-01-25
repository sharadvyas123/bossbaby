'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { bookingSchema } from '@/lib/bookingSchema';
import { generateTimeSlots, isDateValid } from '@/lib/timeSlots';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);

  const [closures, setClosures] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(bookingSchema),
  });

  const router = useRouter();
  const watchedDate = watch('date');


  useEffect(() => {
    const user = localStorage.getItem('userId');
    if (!user) {
      router.push('/login');
    }
  }, []);


  // Fetch existing bookings when date changes
  useEffect(() => {
    if (watchedDate && isDateValid(watchedDate)) {
      Promise.all([
        fetch(`/api/bookings?date=${watchedDate}`).then(res => res.json()),
        fetch(`/api/studio-closures?date=${watchedDate}`).then(res => res.json()),
      ])
        .then(([bookingData, closureData]) => {
          setExistingBookings(bookingData.bookings || []);
          setClosures(closureData || []);
        })
        .catch(err => console.error(err));
    }
  }, [watchedDate]);



  // Generate time slots when date or existing bookings change
  useEffect(() => {
    if (watchedDate && isDateValid(watchedDate)) {
      const slots = generateTimeSlots(
        watchedDate,
        existingBookings,
        closures
      );
      setTimeSlots(slots);
      setSelectedDate(watchedDate);
    } else {
      setTimeSlots([]);
    }
  }, [watchedDate, existingBookings, closures]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setSubmitMessage({
        type: 'error',
        text: 'Please login again',
      });
      return;
    }

    const payload = {
      ...data,
      userId
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Booking successful! We will contact you soon.' });
        reset();
        setSelectedDate('');
        setTimeSlots([]);
        // Refresh bookings to update available slots
        if (watchedDate) {
          fetch(`/api/bookings?date=${watchedDate}`)
            .then(res => res.json())
            .then(data => {
              setExistingBookings(data.bookings || []);
            });
        }
        router.refresh();
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Booking failed. Please try again.' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  };

  const formatSlotRange = (start) => {
    const [h, m] = start.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(h, m, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    const formatTime = (d) =>
      d.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
  };


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Book Your Baby Photo Session
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Baby Name */}
        <div>
          <label htmlFor="babyName" className="block text-sm font-medium text-gray-700 mb-2">
            Baby Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="babyName"
            {...register('babyName')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.babyName ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter baby's name"
          />
          {errors.babyName && (
            <p className="mt-1 text-sm text-red-500">{errors.babyName.message}</p>
          )}
        </div>

        {/* Baby Age */}
        <div>
          <label htmlFor="babyAge" className="block text-sm font-medium text-gray-700 mb-2">
            Age of Baby  (in months) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="babyAge"
            {...register('babyAge', { valueAsNumber: true })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.babyAge ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="e.g., 6"
            min="0"
            max="120"
          />
          {errors.babyAge && (
            <p className="mt-1 text-sm text-red-500">{errors.babyAge.message}</p>
          )}
        </div>



        {/* Photo Type */}
        <div>
          <label htmlFor="photoType" className="block text-sm font-medium text-gray-700 mb-2">
            Session Type <span className="text-red-500">*</span>
          </label>
          <select
            id="photoType"
            {...register('photoType')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.photoType ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">Select Session type</option>
            <option value="newborn">Newborn</option>
            <option value="toddler">Toddler</option>
            <option value="family">Family</option>
            <option value="Maternity">Maternity</option>
            <option value="Baby & family">Baby & family</option>
          </select>
          {errors.photoType && (
            <p className="mt-1 text-sm text-red-500">{errors.photoType.message}</p>
          )}
        </div>
        {/* Mobile Number */}
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="mobile"
            {...register('mobile')}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.mobile ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="e.g., 9876543210"
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-500">{errors.mobile.message}</p>
          )}
        </div>


        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Select Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            {...register('date')}
            min={getMinDate()}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        {/* Time Slot */}
        {watchedDate && timeSlots.length > 0 && (
          <div>
            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-2">
              Select Time Slot <span className="text-red-500">*</span>
            </label>
            <select
              id="timeSlot"
              {...register('timeSlot')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.timeSlot ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Select time slot</option>
              {timeSlots.map((slot) => (
                <option
                  key={slot.value}
                  value={slot.value}
                  disabled={slot.disabled}
                >
                  {formatSlotRange(slot.value)}
                  {slot.reason ? ` (${slot.reason})` : ''}
                </option>
              ))}

            </select>
            {errors.timeSlot && (
              <p className="mt-1 text-sm text-red-500">{errors.timeSlot.message}</p>
            )}
            {timeSlots.every(slot => slot.disabled) && (
              <p className="mt-2 text-sm text-amber-600">
                All slots are booked for this date. Please select another date.
              </p>
            )}
          </div>
        )}

        {watchedDate && !isDateValid(watchedDate) && (
          <p className="text-sm text-red-500">
            Please select a future date.
          </p>
        )}

        {/* Submit Message */}
        {submitMessage && (
          <div
            className={`p-4 rounded-lg ${submitMessage.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}
          >
            {submitMessage.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}
