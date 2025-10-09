import { CheckCircle, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllRooms } from '../../api/rooms';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useBookings } from '../../utils/bookingUtils';

const timeSlots = [
  { value: '07:00-09:00', label: '07:00 - 09:00' },
  { value: '09:00-11:00', label: '09:00 - 11:00' },
  { value: '11:00-13:00', label: '11:00 - 13:00' },
  { value: '13:00-15:00', label: '13:00 - 15:00' },
  { value: '15:00-17:00', label: '15:00 - 17:00' },
  { value: '17:00-19:00', label: '17:00 - 19:00' },
  { value: '19:00-21:00', label: '19:00 - 21:00' },
];

// ✅ Komponen Notifikasi Melayang (center-top)
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor =
    type === 'success'
      ? 'bg-green-600'
      : type === 'error'
      ? 'bg-red-600'
      : 'bg-blue-600';

  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[999] flex items-center gap-3 ${bgColor} text-white py-3 px-5 rounded-xl shadow-2xl animate-fadeInDown`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm sm:text-base">{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-100">
        <X className="w-4 h-4" />
      </button>

      {/* Animasi fade-in */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

const FormPeminjaman = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const prefilledData = location.state || {};

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const [formData, setFormData] = useState({
    room: prefilledData.room || '',
    date: prefilledData.date || new Date().toISOString().split('T')[0],
    timeSlot: prefilledData.timeSlot || '',
    purpose: '',
    capacity: 1,
    peminjam: prefilledData.peminjam || '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setRoomsLoading(true);
        const fetchedRooms = await getAllRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Gagal memuat data ruangan');
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    setError('');
    if (!formData.room || !formData.date || !formData.timeSlot || !formData.purpose || !formData.peminjam) {
      setError('Semua field harus diisi.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const [startTime, endTime] = formData.timeSlot.split('-');

      const bookingData = {
        room: formData.room,
        date: formData.date,
        startTime,
        endTime,
        purpose: formData.purpose,
        participants: formData.capacity,
      };

      await addBooking(bookingData);

      // Notifikasi sukses
      setNotification({
        message: 'Peminjaman ruangan berhasil diajukan!',
        type: 'success',
      });

      setTimeout(() => {
        navigate('/riwayat');
      }, 1500);
    } catch (error) {
      setNotification({
        message: 'Terjadi kesalahan saat mengajukan peminjaman: ' + error.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 min-h-full">
      <div className="p-4 sm:p-6 rounded-xl bg-white border border-blue-200 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3D5B81]">
          Ajukan Peminjaman Ruangan
        </h1>
        <p className="text-gray-600 mt-1 mb-6 text-sm sm:text-base">
          Silakan isi detail kegiatan dan ruangan yang Anda butuhkan. (Maksimal 2 jam, batas akhir 21:00)
        </p>

        {/* Alert Form Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg mb-5 text-sm font-medium animate-fadeInDown">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex gap-5 w-full flex-col md:flex-row">
            <div className="flex flex-col flex-1">
              <label htmlFor="room" className="font-semibold text-[#3D5B81] mb-1 text-sm sm:text-base">
                Pilih Ruangan
              </label>
              <select
                id="room"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
                disabled={roomsLoading}
              >
                <option value="">
                  {roomsLoading ? 'Memuat ruangan...' : '-- Pilih Ruangan --'}
                </option>
                {rooms.map((r) => (
                  <option key={r._id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="capacity" className="font-semibold text-[#3D5B81] mb-1 text-sm sm:text-base">
                Jumlah Peserta
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex gap-5 w-full flex-col md:flex-row">
            <div className="flex flex-col flex-1">
              <label htmlFor="date" className="font-semibold text-[#3D5B81] mb-1 text-sm sm:text-base">
                Tanggal Peminjaman
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="timeSlot" className="font-semibold text-[#3D5B81] mb-1 text-sm sm:text-base">
                Waktu Peminjaman
              </label>
              <select
                id="timeSlot"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">-- Pilih Waktu --</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="purpose" className="font-semibold text-[#3D5B81] mb-1 text-sm sm:text-base">
              Tujuan Kegiatan
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-sm sm:text-base resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              rows="4"
              placeholder="Jelaskan tujuan peminjaman"
              required
            ></textarea>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="peminjam" className="font-semibold text-[#3D5B81] mb-1 text-sm sm:text-base">
              Nama Pemohon
            </label>
            <input
              type="text"
              id="peminjam"
              name="peminjam"
              value={formData.peminjam}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3D5B81] text-white p-4 rounded-lg text-lg font-semibold mt-3 transition-colors duration-300 hover:bg-[#2e4764] shadow-md disabled:opacity-50"
          >
            {loading ? 'Mengajukan...' : 'Ajukan Peminjaman'}
          </button>
        </form>
      </div>

      {/* ✅ Notifikasi Stylish */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default FormPeminjaman;
