// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Impossible d'avoir deux comptes avec le même email
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
