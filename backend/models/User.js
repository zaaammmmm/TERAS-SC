import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  // SSO-created users do not need a local password. Existing local users remain supported.
  password: { type: String, required: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  name: { type: String, required: true },
  apiToken: { type: String, unique: true, sparse: true },
  ssoId: { type: String, unique: true, sparse: true }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (typeof this.password !== 'string' || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (typeof enteredPassword !== 'string' || !this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);