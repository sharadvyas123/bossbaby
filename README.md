# Boss Baby Photo Studio - Booking App

A Next.js booking application for a baby photo studio that allows customers to book appointments and admins to manage bookings.

## Features

### Customer Features
- **Booking Form**: Beautiful landing page with a form to book photo sessions
- **Form Validation**: Uses Yup schema validation for all form fields
- **Time Slot Management**: 
  - Studio hours: 10:30 AM - 1:00 PM and 2:30 PM - 8:00 PM
  - Each booking lasts 45 minutes
  - Prevents double bookings (no two appointments at the same time)
- **Photo Types**: Support for Newborn, Toddler, and Family photo sessions

### Admin Features
- **Admin Panel**: Secure admin page to view all bookings
- **Authentication**: Password-protected admin access
- **Booking Management**: View and delete bookings
- **Real-time Updates**: See bookings as they come in

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)

### Installation

```bash
npm install
```

### MongoDB Setup

1. Create a MongoDB Atlas cluster at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string from MongoDB Atlas
3. Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   ```
   Example format: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`

4. Make sure to:
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `bossbaby`)
   - Add your IP address to the MongoDB Atlas IP whitelist (or use `0.0.0.0/0` for development)

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the booking form.

### Accessing Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

**Default Admin Password**: `admin123`

⚠️ **Important**: Change the admin password in production! You can find it in `src/app/admin/page.js`

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.js          # Admin panel page
│   ├── api/
│   │   └── bookings/
│   │       ├── route.js     # API routes for bookings
│   │       └── [id]/
│   │           └── route.js # Delete booking route
│   ├── layout.js            # Root layout
│   ├── page.js              # Landing page with booking form
│   └── globals.css          # Global styles
├── components/
│   └── BookingForm.js       # Booking form component
├── lib/
│   ├── bookingSchema.js     # Yup validation schema
│   ├── bookings.js          # Booking data operations (MongoDB)
│   ├── mongodb.js           # MongoDB connection utility
│   └── timeSlots.js         # Time slot generation logic
└── models/
    └── Booking.js           # MongoDB Booking model/schema
```

## Form Fields

- **Baby Name**: Required, 2-50 characters
- **Baby Age**: Required, positive integer (in months)
- **Mobile Number**: Required, exactly 10 digits
- **Photo Type**: Required, one of: newborn, toddler, family
- **Date**: Required, must be a future date
- **Time Slot**: Required, automatically generated based on selected date and availability

## Studio Hours

- **Morning Session**: 10:30 AM - 1:00 PM
- **Afternoon Session**: 2:30 PM - 8:00 PM
- **Session Duration**: 45 minutes per booking

## Technology Stack

- **Next.js 16**: React framework
- **MongoDB**: Database for persistent data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **React Hook Form**: Form management
- **Yup**: Schema validation
- **date-fns**: Date manipulation and formatting
- **Tailwind CSS**: Styling

## Future Enhancements

- [x] MongoDB database integration
- [ ] Google Calendar integration for admin
- [ ] Email notifications
- [ ] Booking confirmation emails
- [ ] Calendar view for admin
- [ ] Booking editing functionality

## Notes

- Uses MongoDB for persistent data storage - bookings are saved permanently
- Admin authentication is basic password-based; consider implementing proper auth in production
- Make sure your `.env.local` file is in `.gitignore` (it should be by default) to keep your MongoDB credentials secure