// src/components/admin/DaftarRuanganAdmin.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DaftarRuanganAdmin.css';

const AdminRoomCard = ({ room, bookings }) => {
  const navigate = useNavigate();
  const PRIMARY_COLOR = '#3D5B81';

  // Define the time slots for display
  const timeSlots = [
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

  // Format selectedDate to YYYY-MM-DD string for comparison
  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
  };

  const formattedDate = formatDate(new Date());

  const getTimeSlotClass = (booked) => {
    if (booked) {
      return 'bg-slate-600 text-white cursor-not-allowed'; // secondary color for booked slots
    } else {
      return 'bg-blue-100 text-slate-600 cursor-pointer hover:bg-blue-200'; // available slots
    }
  };

  return (
    <div className="ruangan-card">
      <div className="ruangan-image-placeholder"></div>
      <div className="ruangan-details">
        <div className="ruangan-header-detail">
          <h3>{room.name}</h3>
          <button
            onClick={() => navigate('/admin/detail', { state: { room: { name: room.name }, selectedDate: new Date() } })}
            className="pinjam-button"
          >
            Lihat Selengkapnya
          </button>
        </div>
        <p className="ruangan-location">{room.location}</p>
        <p className="ruangx`an-available-time">Waktu Tersedia</p>
        <div className="time-slots">
          {timeSlots.map((time, index) => {
            const booked = isBooked(room.name, formattedDate, time.value);
            return (
              <span
                key={index}
                className={`time-slot-tag ${booked ? 'booked' : 'available'}`}
                onClick={() => !booked && navigate('/pinjam', { state: { room: room.name, date: formattedDate, timeSlot: `${time.value}-${time.value.replace(':00', ':00').replace('09', '11').replace('11', '13').replace('13', '15').replace('15', '17').replace('17', '19').replace('19', '21')}` } })}
              >
                {time.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DaftarRuanganAdmin = () => {
  const PRIMARY_COLOR = '#3D5B81';
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { bookings } = useBookings();
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);
  const navigate = useNavigate();

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

  // Fungsi untuk menangani klik pada slot waktu
  const handleTimeSlotClick = (roomName, startTime) => {
    navigate('/pinjam', { 
      state: { 
        room: roomName, 
        startTime: startTime, 
        date: new Date().toISOString().split('T')[0] 
      } 
    });
  };
  
  // Fungsi untuk menangani klik pada tombol Pinjam (jika tanpa memilih jam spesifik)
  const handlePinjamClick = (roomName) => {
    navigate('/admin/detail', {
      state: {
        room: { name: roomName },
        selectedDate: new Date().toISOString().split('T')[0]
      }
    });
  };

  return (
    <div className="content-wrapper">
      <h2 className="content-title" style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        Cek Ketersediaan Ruangan Hari Ini
      </h2>

      <div className="ruangan-list">
        {roomsLoading ? (
          <div>Memuat daftar ruangan...</div>
        ) : roomsError ? (
          <div className="text-red-600">{roomsError}</div>
        ) : rooms.length === 0 ? (
          <div>Tidak ada ruangan tersedia</div>
        ) : (
          rooms.map((room) => (
            <AdminRoomCard key={room._id} room={room} bookings={bookings} />
          ))
        )}
      </div>
    </div>
  );
};

export default DaftarRuanganAdmin;