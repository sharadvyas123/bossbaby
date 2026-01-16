// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
    length: 10,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
