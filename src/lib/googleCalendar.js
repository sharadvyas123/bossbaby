import { google } from "googleapis";
import fs from "fs";
import path from "path";

// 🔹 Create 30 min slot
function create30MinSlot(date, timeSlot) {
  const start = new Date(`${date}T${timeSlot}:00`);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

// 🔹 Auth
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({
  version: "v3",
  auth,
});

// 🔹 MAIN FUNCTION (FIXED)
export async function addEventToCalendar(booking) {
  // ✅ Generate correct times
  const { startTime, endTime } = create30MinSlot(
    booking.date,
    booking.timeSlot
  );

  return await calendar.events.insert({
    calendarId: "vyasshubham132@gmail.com",
    requestBody: {
      summary: "📸 Boss Baby Photo Shoot",
      description: `Client: ${booking.babyName || "N/A"}
Mobile: ${booking.mobileNo || "N/A"}`,

      start: {
        dateTime: startTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime,
        timeZone: "Asia/Kolkata",
      },
    },
  });
}
