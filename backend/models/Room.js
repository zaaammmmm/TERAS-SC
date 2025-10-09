import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  image: { type: String },
  description: { type: String }
});

export default mongoose.model('Room', RoomSchema);