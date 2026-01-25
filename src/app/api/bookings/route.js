export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import {
  getAllBookings,
  getAllBookingsForAdmin,
  getBookingsByDate,
  createBooking,
} from '@/lib/bookings';
import { bookingSchema } from '@/lib/bookingSchema';
import { generateTimeSlots, isDateValid } from '@/lib/timeSlots';
import { parse, addMinutes } from 'date-fns';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Booking from '@/models/Booking';
import StudioClosure from '@/models/StudioClosure';
import { addEventToCalendar } from '@/lib/googleCalendar';


/* =========================
   GET BOOKINGS
========================= */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (date) {
      const bookings = await getBookingsByDate(date);
      return NextResponse.json({ bookings });
    }

    const allBookings = await getAllBookingsForAdmin();
    return NextResponse.json({ bookings: allBookings });
  } catch (error) {
    console.error('Error in GET /api/bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
/* =========================
   CREATE BOOKING
========================= */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, mobile } = body;

    /* 🔐 AUTH CHECK */
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    /* 📱 MOBILE CHECK */
    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    await connectDB();

    /* 🔐 ENRICH BODY */
    const enrichedBody = {
      ...body,
      mobileNo: mobile,
    };

    /* ✅ VALIDATION */
    await bookingSchema.validate(enrichedBody, { abortEarly: false });

    if (!isDateValid(enrichedBody.date)) {
      return NextResponse.json(
        { error: 'Please select a future date' },
        { status: 400 }
      );
    }

    const selectedDate = new Date(enrichedBody.date);
    const bookingStart = parse(
      enrichedBody.timeSlot,
      'HH:mm',
      selectedDate
    );
    const bookingEnd = addMinutes(bookingStart, 30);
    const now = new Date();

    /* 🚫 PAST TIME BLOCK */
    if (selectedDate.toDateString() === now.toDateString()) {
      if (bookingStart <= now) {
        return NextResponse.json(
          { error: 'You cannot book a past time slot' },
          { status: 400 }
        );
      }
    }

    /* 📦 EXISTING BOOKINGS */
    const existingBookings = await getBookingsByDate(enrichedBody.date);

    const hasConflict = existingBookings.some((booking) => {
      const start = parse(booking.timeSlot, 'HH:mm', selectedDate);
      const end = addMinutes(start, 30);
      return bookingStart < end && bookingEnd > start;
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    /* 🚫 STUDIO CLOSURE CHECK */
    const closures = await StudioClosure.find({
      date: enrichedBody.date,
    });

    const isClosed = closures.some((closure) => {
      const closureStart = parse(
        closure.startTime,
        'HH:mm',
        selectedDate
      );
      const closureEnd = parse(
        closure.endTime,
        'HH:mm',
        selectedDate
      );

      return bookingStart < closureEnd && bookingEnd > closureStart;
    });

    if (isClosed) {
      return NextResponse.json(
        { error: 'Studio is closed during the selected time slot' },
        { status: 400 }
      );
    }

    /* ✅ FINAL SLOT VALIDATION */
    const timeSlots = generateTimeSlots(
      enrichedBody.date,
      existingBookings
    );

    const isValidSlot = timeSlots.some(
      (slot) =>
        slot.value === enrichedBody.timeSlot && !slot.disabled
    );

    if (!isValidSlot) {
      return NextResponse.json(
        { error: 'Invalid time slot selected' },
        { status: 400 }
      );
    }

    /* ✅ CREATE BOOKING */
    const booking = await createBooking({
      babyName: enrichedBody.babyName,
      babyAge: enrichedBody.babyAge,
      mobileNo: enrichedBody.mobileNo,
      photoType: enrichedBody.photoType,
      date: enrichedBody.date,
      timeSlot: enrichedBody.timeSlot,
      userId,
    });

    const res = await addEventToCalendar(booking);

    await Booking.findByIdAndUpdate(
      booking._id,
      {
        calendarSynced: true,
        calendarEventId: res.data.id,
      }
    );

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/bookings:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.errors?.[0] || 'Validation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
