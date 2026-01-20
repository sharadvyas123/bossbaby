import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    babyName: {
      type: String,
      required: [true, 'Baby name is required'],
      trim: true,
      minlength: [2, 'Baby name must be at least 2 characters'],
      maxlength: [50, 'Baby name must be less than 50 characters'],
    },
    babyAge: {
      type: Number,
      required: [true, 'Baby age is required'],
      min: [0, 'Baby age cannot be negative'],
      max: [120, 'Baby age seems too high'],
    },
    mobileNo: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'],
    },
    photoType: {
      type: String,
      required: [true, 'Photo type is required'],
      enum: {
        values: ['newborn', 'toddler', 'family', 'Maternity', 'Baby & family'],
        message: 'Photo type must be one of: newborn, toddler, family',
      },
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    calendarSynced: {
      type: Boolean,
      default: false,
    },
    calendarEventId: {
  type: String,
}
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
  }
);

// Prevent model from being recompiled during hot reloads in development
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

export default Booking;
