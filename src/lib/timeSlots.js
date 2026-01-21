import { addMinutes, parse } from 'date-fns';

// Each booking lasts 30 minutes (as per your logic)

export function generateTimeSlots(date, bookings, closures = []) {
  const slots = [];
  const baseDate = new Date(date);

  // 🕒 Define sessions
  const sessions = [
    { start: '10:30', end: '13:00', session: 'Morning' },
    { start: '14:30', end: '20:00', session: 'Afternoon' },
  ];

  sessions.forEach(({ start, end }) => {
    let current = parse(start, 'HH:mm', baseDate);
    const sessionEnd = parse(end, 'HH:mm', baseDate);

    while (current < sessionEnd) {
      const slotEnd = addMinutes(current, 30);
      const value = current.toTimeString().slice(0, 5);

      let disabled = false;
      let reason = '';

      /* 🔴 Booked slots */
      const isBooked = bookings.some(b => {
        const bookedStart = parse(b.timeSlot, 'HH:mm', baseDate);
        const bookedEnd = addMinutes(bookedStart, 30);
        return current < bookedEnd && slotEnd > bookedStart;
      });

      if (isBooked) {
        disabled = true;
        reason = 'Booked';
      }

      /* 🔴 Closed slots */
      const isClosed = closures.some(c => {
        const closeStart = parse(c.startTime, 'HH:mm', baseDate);
        const closeEnd = parse(c.endTime, 'HH:mm', baseDate);
        return current < closeEnd && slotEnd > closeStart;
      });

      if (isClosed) {
        disabled = true;
        reason = 'Closed';
      }

      slots.push({
        value,
        label: value,
        disabled,
        reason,
      });

      current = slotEnd;
    }
  });

  return slots;
}



export function isDateValid(date) {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  // Only allow future dates
  return selectedDate >= today;
}


