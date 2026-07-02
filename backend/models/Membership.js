import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: String,
  status: { type: String, default: 'active' },
  startDate: String,
  endDate: String,
  amount: Number,
  paymentId: String,
  orderId: String,
}, { timestamps: true });

export default mongoose.model('Membership', membershipSchema);
