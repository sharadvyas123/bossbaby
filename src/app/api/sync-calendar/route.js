import { addEventToCalendar } from "@/lib/googleCalendar";
import Booking from "@/models/Booking";
import connectDB from "@/lib/mongodb";

export async function POST() {
  await connectDB();

  const bookings = await Booking.find({
    calendarSynced: false
  });

  for (const booking of bookings) {
    await addEventToCalendar(booking);

    booking.calendarSynced = true;
    await booking.save();
  }

  return Response.json({
    success: true,
    synced: bookings.length
  });
}
