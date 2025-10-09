import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRooms } from '../../api/rooms';
import { useBookings } from '../../contexts/BookingContext';
import DateNavigator from '../utils/DateNavigator';

// Mapping room names to public assets images (case insensitive)
const roomImageMap = {
  'co-working space a': '/assets/sc/co-space-a.jpg',
  'co-working space b': '/assets/sc/co-space-b.jpg',
  'co-working space c': '/assets/sc/co-space-c.jpg',
  'co-working space d': '/assets/sc/co-space-d.jpg',
  'co-working space e': '/assets/sc/co-space-e.jpg',
  'co-working space east': '/assets/sc/co-space-east.jpg',
  'co-working space f': '/assets/sc/co-space-f.jpg',
};

const AdminRoomCard = ({ room, selectedDate, bookings }) => {
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
        booking.date.split('T')[0] === date &&
        booking.startTime === timeValue &&
        booking.status === 'Disetujui'
    );
  };

  // Helper to get the time slot range for form prefill
  const getTimeSlotValue = (timeValue) => {
    const mappings = {
      '07:00': '07:00-09:00',
      '09:00': '09:00-11:00',
      '11:00': '11:00-13:00',
      '13:00': '13:00-15:00',
      '15:00': '15:00-17:00',
      '17:00': '17:00-19:00',
      '19:00': '19:00-21:00',
    };
    return mappings[timeValue] || '';
  };

  const getTimeSlotClass = (booked) => {
    if (booked) {
      return 'bg-slate-600 text-white cursor-not-allowed'; // secondary color for booked slots
    } else {
      return 'bg-blue-100 text-slate-600 cursor-pointer hover:bg-blue-200'; // available slots
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
    <div className="bg-neutral-100 p-3 sm:p-4 rounded-xl flex items-center justify-between shadow-md transition-all duration-300 hover:shadow-lg max-md:flex-col max-md:items-start max-md:space-y-4">
      <div className="flex items-center space-x-6 w-full max-md:w-full max-md:flex-col max-md:items-start max-md:space-x-0">
        <img className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0" src={roomImageMap} alt={room.name} />
        <div className="flex flex-col flex-grow">
          <div className="text-slate-600 text-xl sm:text-2xl font-bold mb-1">{room.name}</div>
          <div className="text-black text-sm sm:text-base font-normal mb-1">{room.location}</div>
          <div className="text-black text-sm sm:text-base font-normal mb-3">Waktu Tersedia:</div>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((time, index) => {
              const booked = isBooked(room.name, formattedDate, time.value);
              return (
                <button
                  key={index}
                  disabled={booked}
                  onClick={() => !booked && navigate('/pinjam', { state: { room: room.name, date: formattedDate, timeSlot: getTimeSlotValue(time.value) } })}
                  className={`w-12 h-5 sm:w-14 sm:h-6 flex items-center justify-center rounded-md text-xs font-semibold ${getTimeSlotClass(
                    booked,
                  )}`}
                >
                  {time.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/detail`, { state: { room, selectedDate } })}
        className={`w-24 h-8 sm:w-32 sm:h-10 bg-[${PRIMARY_COLOR}] rounded-lg text-white text-sm sm:text-base font-bold transition-colors hover:bg-[#2e4764] flex items-center justify-center ml-4 flex-shrink-0 max-md:w-full max-md:mt-4`}
      >
        Detail
      </button>
    </div>
  );
};

const DaftarRuangan = () => {
  const PRIMARY_COLOR = '#3D5B81';
  const [selectedDate, setSelectedDate] = useState(new Date());
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
        const fetchedRooms = await getAllRooms();
        setRooms(fetchedRooms.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRoomsError('Gagal memuat data ruangan');
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  console.log('Bookings:', bookings);
  console.log('Selected Date:', selectedDate);
  console.log('Rooms:', rooms);

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

export default DaftarRuangan;
