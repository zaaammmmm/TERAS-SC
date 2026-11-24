import mongoose from 'mongoose';

const SsoHandoffSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { timestamps: true });

export default mongoose.models.SsoHandoff ||
  mongoose.model('SsoHandoff', SsoHandoffSchema);
