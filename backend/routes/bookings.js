// routes/bookings.js

import express from 'express';
import { admin, protect } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

const router = express.Router();

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
router.get('/mybookings', protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('room', 'name location').populate('user', 'name email').sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Get ALL bookings for general viewing (Authenticated Users)
// @route   GET /api/bookings/global
// @access  Private (Authenticated Users)
router.get('/global', protect, async (req, res) => {
    // Mengembalikan SEMUA booking agar user bisa melihat ketersediaan
    const bookings = await Booking.find({})
        .populate('user', 'name email')
        .populate('room', 'name location');
    res.json(bookings);
});

// @desc    Get booking stats (admin)
// @route   GET /api/bookings/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: 'Menunggu' });
  const approvedBookings = await Booking.countDocuments({ status: 'Disetujui' });
  const rejectedBookings = await Booking.countDocuments({ status: 'Ditolak' });

  // Get room usage stats (count bookings per room)
  const roomStats = await Booking.aggregate([
    { $group: { _id: '$room', count: { $sum: 1 } } },
    { $lookup: { from: 'rooms', localField: '_id', foreignField: '_id', as: 'room' } },
    { $unwind: '$room' },
    { $project: { name: '$room.name', count: 1 } }
  ]);

  res.json({
    total: totalBookings,
    pending: pendingBookings,
    approved: approvedBookings,
    rejected: rejectedBookings,
    roomStats
  });
});

// @desc    Get all bookings (admin) - Tetap Admin-Only
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  const bookings = await Booking.find({}).populate('user', 'name email').populate('room', 'name location').sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  const { room: roomName, date, startTime, endTime, purpose, participants } = req.body;

  const roomDoc = await Room.findOne({ name: roomName });
  if (!roomDoc) {
    return res.status(400).json({ message: 'Room not found' });
  }

  const booking = new Booking({
    room: roomDoc._id,
    user: req.user._id,
    date,
    startTime,
    endTime,
    purpose,
    participants,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking removed' });
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
});

export default router;