import { NextResponse } from 'next/server';
import connectDB from './mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';

export async function getAllBookings() {
  try {
    await connectDB();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    // Convert MongoDB documents to plain objects with id field
    return bookings.map(booking => ({
      id: booking._id.toString(),
      babyName: booking.babyName,
      babyAge: booking.babyAge,
      mobileNo: booking.mobileNo,
      photoType: booking.photoType,
      date: booking.date,
      timeSlot: booking.timeSlot,
      createdAt: booking.createdAt?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
}

export async function getBookingsByDate(date) {
  try {
    await connectDB();
    const selectedDate = new Date(date).toISOString().split('T')[0];
    const bookings = await Booking.find({ date: selectedDate }).sort({ timeSlot: 1 });
    // Convert MongoDB documents to plain objects with id field
    return bookings.map(booking => ({
      id: booking._id.toString(),
      babyName: booking.babyName,
      babyAge: booking.babyAge,
      mobileNo: booking.mobileNo,
      photoType: booking.photoType,
      date: booking.date,
      timeSlot: booking.timeSlot,
      createdAt: booking.createdAt?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching bookings by date:', error);
    throw error;
  }
}

export async function createBooking(bookingData) {
  try {
    await connectDB();
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();
    return {
      id: savedBooking._id.toString(),
      babyName: savedBooking.babyName,
      babyAge: savedBooking.babyAge,
      mobileNo: savedBooking.mobileNo,
      photoType: savedBooking.photoType,
      date: savedBooking.date,
      timeSlot: savedBooking.timeSlot,
      createdAt: savedBooking.createdAt?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function deleteBooking(id) {
  try {
    await connectDB();
    const result = await Booking.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

export async function getBookingBYid(id) {
  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user || !user.mobile) {
      return NextResponse.json(
        { error: 'User mobile number not found' },
        { status: 400 }
      );
    }
    const bookings = await Booking.find({
      mobileNo: user.mobile,
    }).sort({ date: 1, timeSlot: 1 });


    return bookings || null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
}
