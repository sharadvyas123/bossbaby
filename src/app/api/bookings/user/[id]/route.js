import { NextResponse } from 'next/server';
import { getAllBookings } from '@/lib/bookings';

export async function GET(request, { params }) {
  try {
    const { userId } = params;

    const bookings = await getAllBookings(userId); // ← must return array

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
