import { google } from "googleapis";
import fs from "fs";
import path from "path";
// 🔹 Create 30 min slot
function create30MinSlot(date, timeSlot) {
  // date = "2026-01-17"
  // timeSlot = "11:30"


  const start = new Date(`${date}T${timeSlot}:00+05:30`);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}




// 🔹 GOOGLE AUTH (VERCEL SAFE)
const credentials = JSON.parse(
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY
);

console.log(
  credentials
);


const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({
  version: "v3",
  auth,
});

// 🔹 MAIN FUNCTION
export async function addEventToCalendar(booking) {
  const { startTime, endTime } = create30MinSlot(
    booking.date,
    booking.timeSlot
  );
  console.log(booking.date);
  console.log(booking.timeSlot);
  console.log("START:", startTime);
  console.log("END:", endTime);


  return await calendar.events.insert({
    calendarId: "vyasshubham132@gmail.com", // primary if not working !! 
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
