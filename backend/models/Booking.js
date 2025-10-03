import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  purpose: { type: String, required: true },
  participants: { type: Number, required: true },
  status: { type: String, enum: ['Menunggu', 'Disetujui', 'Ditolak'], default: 'Menunggu' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', BookingSchema);
