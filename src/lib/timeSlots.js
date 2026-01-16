import { format, addMinutes, parse } from 'date-fns';

// Studio hours: 10:30 AM - 1:00 PM and 2:30 PM - 8:00 PM
// Each booking lasts 45 minutes


export function generateTimeSlots(date, bookings, closures = []) {
  const slots = [];
  const baseDate = new Date(date);

  // example: 10:00 – 20:00
  let current = parse('10:00', 'HH:mm', baseDate);
  const end = parse('20:00', 'HH:mm', baseDate);

  while (current < end) {
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
      label: `${value}`,
      disabled,
      reason,
    });

    current = slotEnd;
  }

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


