import { google } from "googleapis";

// 🔹 Create 30 min slot
function create30MinSlot(date, timeSlot) {
  const start = new Date(`${date}T${timeSlot}:00`);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

// 🔹 GOOGLE AUTH (VERCEL SAFE)


const auth = new google.auth.GoogleAuth({
  credentials:{
    type:"service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
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

  return await calendar.events.insert({
    calendarId: "primary", // ✅ Best practice
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
