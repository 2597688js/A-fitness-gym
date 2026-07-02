import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  role: { type: String, default: 'member' },
  phone: String,
  dob: String,
  gender: String,
  address: String,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
