import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Room from './models/Room.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

// Fungsi pembantu untuk mengkonversi ke Title Case
const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};


// --- Daftar NIM dan Nama yang Akan Ditambahkan ---
// Format: { nim: '...', name: '...' }
const nimUserList = [
  { nim: '23106050002', name: 'BAYU WICAKSONO' },
  { nim: '23106050008', name: 'ARHAM ATHILLAH' },
  { nim: '23106050012', name: 'ARBATH ABDURRAHMAN' },
  { nim: '23106050013', name: 'SALMAN ALFAUZI ASNGARI' },
  { nim: '23106050017', name: 'AHMAD ZAMRONI TRIKARTA' },
  { nim: '23106050024', name: "CHAIRUL 'AZMI ZUHDI PRAMONO" },
  { nim: '23106050038', name: 'MAULANA ZAKKI IBRAHIM FAJARIANTO' },
  { nim: '23106050041', name: 'MUHAMMAD ADAM' },
  { nim: '23106050044', name: 'AHMAD MUSTHOFA ASLAM' },
  { nim: '23106050050', name: 'ARIF RAHMAN' },
  { nim: '23106050054', name: 'IDHAN HAIDAR KURNIAWAN' },
  { nim: '23106050061', name: 'MUHAMMAD FAISAL RAMADHAN' },
  { nim: '23106050062', name: 'DJANU AKBAR SATRIATAMA' },
  { nim: '23106050064', name: 'BINTANG WISHNU PRADANA' },
  { nim: '23106050065', name: 'SHOFY NAILA AZ-ZAHRA' },
  { nim: '23106050077', name: 'AHMAD ZIDNI HIDAYAT' },
  { nim: '23106050080', name: 'RAFI FABIO' },
  { nim: '23106050081', name: 'HANIF UBAIDUR ROHMAN SYAH' },
  { nim: '23106050084', name: 'ROZIN GUNAGRAHA' },
  { nim: '23106050086', name: 'RYOCERA PURNA KURNIAWAN' },
  { nim: '23106050089', name: 'RHEZNANDYA WILDHAN NAYAN SAPUTRA' },
  { nim: '23106050090', name: 'ALTHAF FARRAS ULAYYA FAUZI' },
  { nim: '23106050094', name: 'SYAFIQ RUSTIAWANTO' },
  { nim: '23106050096', name: 'DAMA AMISUDA' },
];
// ----------------------------------------


const importData = async () => {
  try {
    console.log('Starting data import...');

    // --- Bagian 1: Buat User Default (Admin, User, User2, User3) ---
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
      console.log('Admin user created.');
    }

    // Create user default (dapat dihapus jika hanya ingin NIM user)
    const defaultUsers = [
      { name: 'User', email: 'user@student.uin-suka.ac.id' },
    ];

    for (const userData of defaultUsers) {
      let existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        existingUser = new User({
          ...userData,
          password: '12345',
          role: 'user'
        });
        await existingUser.save();
        console.log(`Default user ${userData.name} created.`);
      }
    }

    // --- Bagian 2: Buat User dari Daftar NIM (Dioptimalkan) ---

    // Fungsi pembantu untuk mencari atau membuat user NIM
    const findOrCreateNimUser = async (userData) => {
      const email = `${userData.nim}@student.uin-suka.ac.id`;
      let user = await User.findOne({ email });

      if (!user) {
        // Menggunakan fungsi toTitleCase untuk memastikan kapitalisasi yang benar
        const formattedName = toTitleCase(userData.name);

        user = new User({
          name: formattedName, // Sekarang menggunakan nama lengkap
          email: email,
          password: '12345', 
          role: 'user'
        });
        await user.save();
        // console.log(`NIM user ${userData.nim} - ${formattedName} created.`); // Uncomment untuk melihat output detail
      }
      return user;
    };

    // Jalankan semua operasi secara paralel menggunakan Promise.all untuk efisiensi
    const nimUserPromises = nimUserList.map(findOrCreateNimUser);
    await Promise.all(nimUserPromises);
    console.log(`\nSuccessfully processed ${nimUserList.length} NIM users with full names.`);

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
