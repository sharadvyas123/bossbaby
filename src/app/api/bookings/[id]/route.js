import { NextResponse } from 'next/server';
import { getBookingBYid, deleteBooking } from '@/lib/bookings';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const booking = await getBookingBYid(id);

    if (!booking) {
      return NextResponse.json(
        { message: 'No booking found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } =await params;
    console.log(id);

    const deleted = await deleteBooking(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
