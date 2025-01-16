import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, 'Please provide a user ID.'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
  },
  displayName: {
    type: String,
    required: [true, 'Please provide a display name.'],
  },
  photoURL: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

