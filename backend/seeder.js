import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Room from './models/Room.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
  try {
    // Create admin user if not exists
    let admin = await User.findOne({ email: 'admin@teras-sc.id' });
    if (!admin) {
      admin = new User({
        name: 'Admin',
        email: 'admin@teras-sc.id',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
    }

    // Create user if not exists
    let user = await User.findOne({ email: 'user@student.uin-suka.ac.id' });
    if (!user) {
      user = new User({
        name: 'User',
        email: 'user@student.uin-suka.ac.id',
        password: '12345',
        role: 'user'
      });
      await user.save();
    }

    // Create user2 if not exists
    let user2 = await User.findOne({ email: 'user2@student.uin-suka.ac.id' });
    if (!user2) {
      user2 = new User({
        name: 'User2',
        email: 'user2@student.uin-suka.ac.id',
        password: '12345',
        role: 'user'
      });
      await user2.save();
    }

    // Create user3 if not exists
    let user3 = await User.findOne({ email: 'user3@student.uin-suka.ac.id' });
    if (!user3) {
      user3 = new User({
        name: 'User3',
        email: 'user3@student.uin-suka.ac.id',
        password: '12345',
        role: 'user'
      });
      await user3.save();
    }

    // Create rooms if not exist
    const roomNames = ['Co-Working Space A', 'Co-Working Space B', 'Co-Working Space C', 'Co-Working Space D', 'Co-Working Space E', 'Co-Working Space F', 'Co-Working Space EAST'];
    for (const name of roomNames) {
      const existingRoom = await Room.findOne({ name });
      if (!existingRoom) {
        const roomData = {
          name,
          location: 'Gedung SC Lantai 3',
          capacity: name === 'Co-Working Space A' ? 15 : name === 'Co-Working Space B' ? 8 : name === 'Co-Working Space C' ? 10 : name === 'Co-Working Space D' ? 12 : name === 'Co-Working Space E' ? 6 : name === 'Co-Working Space F' ? 18 : 20,
          image: 'https://placehold.co/101x98',
          description: `Ruangan co-working untuk ${name === 'Co-Working Space A' ? 15 : name === 'Co-Working Space B' ? 8 : name === 'Co-Working Space C' ? 10 : name === 'Co-Working Space D' ? 12 : name === 'Co-Working Space E' ? 6 : name === 'Co-Working Space F' ? 18 : 20} orang`
        };
        const room = new Room(roomData);
        await room.save();
      }
    }

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
