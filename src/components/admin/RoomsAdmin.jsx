// RoomsAdmin.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRooms } from '../../api/rooms';
import { useBookings } from '../../contexts/BookingContext';
import DateNavigator from '../utils/DateNavigator';

const AdminRoomCard = ({ room, selectedDate, bookings }) => {
  // ... (kode AdminRoomCard tidak berubah, karena sudah menggunakan bookings dari props)
  const navigate = useNavigate();
  const PRIMARY_COLOR = '#3D5B81';

  // Define the time slots for display
  const timeSlots = [
    { label: '07.00', value: '07:00' },
    { label: '09.00', value: '09:00' },
    { label: '11.00', value: '11:00' },
    { label: '13.00', value: '13:00' },
    { label: '15.00', value: '15:00' },
    { label: '17.00', value: '17:00' },
    { label: '19.00', value: '19:00' },
  ];

  // Helper to check if a time slot is booked for this room and date
  const isBooked = (roomName, date, timeValue) => {
    return bookings.some(
      (booking) =>
        booking.room.name === roomName &&
        booking.date === date &&
        booking.startTime === timeValue &&
        booking.status === 'Disetujui'
    );
  };

  const getTimeSlotClass = (booked) => {
    if (booked) {
      return 'bg-slate-600 text-white'; // secondary color for booked slots
    } else {
      return 'bg-blue-100 text-slate-600'; // available slots
    }
  };

  // Format selectedDate to YYYY-MM-DD string for comparison
  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
  };

  const formattedDate = formatDate(selectedDate);

  return (
    <div className="bg-neutral-100 p-4 rounded-xl flex items-center justify-between shadow-md transition-all duration-300 hover:shadow-lg max-md:flex-col max-md:items-start max-md:space-y-4">
      <div className="flex items-center space-x-6 w-full max-md:w-full max-md:flex-col max-md:items-start max-md:space-x-0">
        <img className="w-24 h-24 rounded-lg object-cover flex-shrink-0" src={room.image} alt={room.name} />
        <div className="flex flex-col flex-grow">
          <div className="text-slate-600 text-xl sm:text-2xl font-bold mb-1">{room.name}</div>
          <div className="text-black text-sm sm:text-base font-normal mb-1">{room.location}</div>
          <div className="text-black text-sm sm:text-base font-normal mb-3">Waktu Tersedia Hari Ini:</div>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((time, index) => {
              const booked = isBooked(room.name, formattedDate, time.value);
              return (
                <div
                  key={index}
                  className={`w-14 h-6 flex items-center justify-center rounded-md text-xs font-semibold ${getTimeSlotClass(
                    booked,
                  )}`}
                >
                  {time.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/admin/detail`, { state: { room, selectedDate } })}
        className={`w-32 h-10 bg-[${PRIMARY_COLOR}] rounded-lg text-white text-sm sm:text-base font-bold transition-colors hover:bg-[#2e4764] flex items-center justify-center ml-4 flex-shrink-0 max-md:w-full max-md:mt-4`}
      >
        Detail
      </button>
    </div>
  );
};

const RoomsAdmin = () => {
  const PRIMARY_COLOR = '#3D5B81';
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Mengambil bookings (state global) dari context
  const { bookings } = useBookings();
  
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [selectedDate]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setRoomsLoading(true);
        setRoomsError(null);
        // Pastikan getAllRooms diimpor dari lokasi yang benar
        const fetchedRooms = await getAllRooms(); 
        setRooms(fetchedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRoomsError('Gagal memuat data ruangan');
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []); // [ ] dependency array memastikan fetchRooms hanya berjalan sekali

  return (
    <div className="w-full space-y-6 min-h-full">
      {/* Navigasi Tanggal */}
      <DateNavigator selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {/* Konten Utama (Daftar Ruangan) */}
      <div className={`bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-lg shadow-black/5 space-y-4 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        {roomsLoading ? (
          <div className="text-center py-8">Memuat daftar ruangan...</div>
        ) : roomsError ? (
          <div className="text-center py-8 text-red-600">{roomsError}</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Tidak ada ruangan tersedia</div>
        ) : (
          rooms.map((room) => (
            <AdminRoomCard key={room._id} room={room} selectedDate={selectedDate} bookings={bookings} />
          ))
        )}
      </div>
    </div>
  );
};

export default RoomsAdmin;