import mongoose from 'mongoose';

const StudioClosureSchema = new mongoose.Schema(
  {
    date: {
      type: String, // yyyy-mm-dd
      required: true,
      index: true,
    },

    startTime: {
      type: String, // HH:mm
      required: true,
    },

    endTime: {
      type: String, // HH:mm
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Prevent model overwrite in Next.js hot reload
export default mongoose.models.StudioClosure ||
  mongoose.model('StudioClosure', StudioClosureSchema);
