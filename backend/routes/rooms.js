import express from 'express';
import { admin, protect } from '../middleware/auth.js';
import Room from '../models/Room.js';

const router = express.Router();

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
router.get('/', async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
router.get('/:id', async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (room) {
    res.json(room);
  } else {
    res.status(404).json({ message: 'Room not found' });
  }
});

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, location, capacity, image, description } = req.body;

  const room = new Room({
    name,
    location,
    capacity,
    image,
    description,
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
});

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { name, location, capacity, image, description } = req.body;

  const room = await Room.findById(req.params.id);

  if (room) {
    room.name = name;
    room.location = location;
    room.capacity = capacity;
    room.image = image;
    room.description = description;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404).json({ message: 'Room not found' });
  }
});

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    await room.remove();
    res.json({ message: 'Room removed' });
  } else {
    res.status(404).json({ message: 'Room not found' });
  }
});

export default router;
