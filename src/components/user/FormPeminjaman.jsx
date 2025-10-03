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

const FormPeminjaman = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addBooking } = useBookings();
  const prefilledData = location.state || {};

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

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
      setError('Semua field harus diisi');
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

      // Prepare booking data for API
      const bookingData = {
        room: formData.room, // Send room name, backend will find the room
        date: formData.date,
        startTime,
        endTime,
        purpose: formData.purpose,
        participants: formData.capacity,
      };

      // Add booking via API
      await addBooking(bookingData);

      alert('Peminjaman ruangan berhasil diajukan! Silakan cek status peminjaman di halaman Riwayat Peminjaman.');
      navigate('/riwayat');
    } catch (error) {
      setError('Terjadi kesalahan saat mengajukan peminjaman: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // .peminjaman-page-container -> flex justify-center pt-2.5 bg-gray-100
    <div className="p-6 bg-white rounded-xl shadow-lg shadow-black/5 w-full overflow-x-auto ">
        
        {/* .peminjaman-title */}
        <h1 className="text-[#3D5B81] text-3xl font-bold mb-1">Ajukan Peminjaman Ruangan</h1>
        
        {/* .peminjaman-subtitle */}
        <p className="text-gray-600 mb-8 border-b border-gray-200 pb-4 text-base pt-2">
          Silakan isi detail kegiatan dan ruangan yang Anda butuhkan. (Maksimal 2 jam, batas akhir 21:00)
        </p>
        
        {/* .form-error-message */}
        {error && <div className="bg-red-100 text-red-800 p-4 border border-red-800 rounded-md mb-5 font-medium">{error}</div>}

        {/* .peminjaman-form -> flex-col gap-5 */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          {/* BAGIAN 1: RUANGAN DAN KAPASITAS */}
          {/* .form-group-row -> flex gap-5 w-full md:flex-row flex-col */}
          <div className="flex gap-5 w-full flex-col md:flex-row">
            
            {/* .form-group -> flex flex-col flex-1 */}
            <div className="flex flex-col flex-1">
              <label htmlFor="room" className="font-semibold text-[#3D5B81] mb-1 text-base">Pilih Ruangan</label>
              <select
                id="room"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
              <label htmlFor="capacity" className="font-semibold text-[#3D5B81] mb-1 text-base">Jumlah Peserta</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                min="1"
                required
              />
            </div>
          </div>

          {/* BAGIAN 2: TANGGAL DAN WAKTU */}
          <div className="flex gap-5 w-full flex-col md:flex-row">
            <div className="flex flex-col flex-1">
              <label htmlFor="date" className="font-semibold text-[#3D5B81] mb-1 text-base">Tanggal Peminjaman</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            
            <div className="flex flex-col flex-1">
              <label htmlFor="timeSlot" className="font-semibold text-[#3D5B81] mb-1 text-base">Waktu Peminjaman</label>
              <select 
                id="timeSlot" 
                name="timeSlot" 
                value={formData.timeSlot} 
                onChange={handleChange} 
                className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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

          {/* BAGIAN 3: TUJUAN */}
          <div className="flex flex-col w-full">
            <label htmlFor="purpose" className="font-semibold text-[#3D5B81] mb-1 text-base">Tujuan Kegiatan</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              // .textarea-field
              className="p-3 border border-gray-300 rounded-lg text-base resize-y transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows="4"
              placeholder="Jelaskan tujuan peminjaman"
              required
            ></textarea>
          </div>

          {/* BAGIAN 4: DATA PEMINJAM (NAMA PEMINJAM) */}
          <div className="flex flex-col w-full">
            <label htmlFor="peminjam" className="font-semibold text-[#3D5B81] mb-1 text-base">Nama Pemohon</label>
            <input
              type="text"
              id="peminjam"
              name="peminjam"
              value={formData.peminjam}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
          
          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3D5B81] text-white p-4 rounded-lg text-xl font-semibold mt-3 transition-colors duration-300 hover:bg-[#2e4764] shadow-md disabled:opacity-50"
          >
            {loading ? 'Mengajukan...' : 'Ajukan Peminjaman'}
          </button>
        </form>
      </div>
  );
};

export default FormPeminjaman;