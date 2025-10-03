import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Room from './models/Room.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
  try {
    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@teras-sc.id',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();

    // Create user
    const user = new User({
      name: 'User',
      email: 'user@student.uin-suka.ac.id',
      password: '12345',
      role: 'user'
    });
    await user.save();

    // Create rooms
    const rooms = [
      {
        name: 'Co-Working Space A',
        location: 'Gedung SC Lantai 3',
        capacity: 15,
        image: 'https://placehold.co/101x98',
        description: 'Ruangan co-working untuk 15 orang'
      },
      {
        name: 'Co-Working Space B',
        location: 'Gedung SC Lantai 3',
        capacity: 8,
        image: 'https://placehold.co/101x98',
        description: 'Ruangan co-working untuk 8 orang'
      },
      {
        name: 'Co-Working Space C',
        location: 'Gedung SC Lantai 3',
        capacity: 10,
        image: 'https://placehold.co/101x98',
        description: 'Ruangan co-working untuk 10 orang'
      },
      {
        name: 'Co-Working Space D',
        location: 'Gedung SC Lantai 3',
        capacity: 12,
        image: 'https://placehold.co/101x98',
        description: 'Ruangan co-working untuk 12 orang'
      },
      {
        name: 'Co-Working Space E',
        location: 'Gedung SC Lantai 3',
        capacity: 6,
        image: 'https://placehold.co/101x98',
        description: 'Ruangan co-working untuk 6 orang'
      },
      {
        name: 'Co-Working Space F',
        location: 'Gedung SC Lantai 3',
        capacity: 18,
        image: 'https://placehold.co/101x98',
        description: 'Ruangan co-working untuk 18 orang'
      },
      {
        name: 'Co-Working Space EAST',
        location: 'Gedung SC Lantai 3',
        capacity: 20,
        image: 'https://placehold.co/101x98',
        description: 'Ruangan co-working untuk 20 orang'
      }
    ];

    await Room.insertMany(rooms);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Room.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
