import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Search, Users } from 'lucide-react';
import { getAllRooms } from '../../api/rooms';
import { useBookings } from '../../contexts/BookingContext';
import DateNavigator from '../utils/DateNavigator';
import roomA from '../../assets/sc/co-space-a.jpg';
import roomB from '../../assets/sc/co-space-b.jpg';
import roomC from '../../assets/sc/co-space-c.jpg';
import roomD from '../../assets/sc/co-space-d.jpg';
import roomE from '../../assets/sc/co-space-e.jpg';
import roomF from '../../assets/sc/co-space-f.jpg';
import roomEast from '../../assets/sc/co-space-east.jpg';

const roomImages = [
  { match: 'space a', image: roomA },
  { match: 'space b', image: roomB },
  { match: 'space c', image: roomC },
  { match: 'space d', image: roomD },
  { match: 'space e', image: roomE },
  { match: 'space f', image: roomF },
  { match: 'east', image: roomEast },
];

const timeSlots = [
  { label: '07.00', value: '07:00', range: '07:00-09:00' },
  { label: '09.00', value: '09:00', range: '09:00-11:00' },
  { label: '11.00', value: '11:00', range: '11:00-13:00' },
  { label: '13.00', value: '13:00', range: '13:00-15:00' },
  { label: '15.00', value: '15:00', range: '15:00-17:00' },
  { label: '17.00', value: '17:00', range: '17:00-19:00' },
  { label: '19.00', value: '19:00', range: '19:00-21:00' },
];

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getRoomImage = (name = '') => {
  const found = roomImages.find(({ match }) => name.toLowerCase().includes(match));
  return found?.image || roomA;
};

const RoomCard = ({ room, selectedDate, bookings, onDetail, onBook }) => {
  const dateKey = formatDate(selectedDate);
  const approved = bookings.filter((booking) =>
    booking.room?.name === room.name &&
    booking.date?.split('T')[0] === dateKey &&
    booking.status === 'Disetujui'
  );
  const availableCount = timeSlots.filter((slot) =>
    !approved.some((booking) => booking.startTime === slot.value)
  ).length;
  const image = room.image || getRoomImage(room.name);
  const capacity = room.capacity || room.kapasitas;
  const location = room.location || room.lokasi || 'Student Center';

  return (
    <article className="room-card group">
      <div className="room-card-image">
        <img src={image} alt={room.name} loading="lazy" />
        <div className="room-card-image-shade" />
        <span className={`room-availability ${availableCount ? 'is-available' : 'is-full'}`}>
          <span className="room-availability-dot" />
          {availableCount ? `${availableCount} slot tersedia` : 'Jadwal penuh'}
        </span>
        <button type="button" className="room-image-action" onClick={() => onDetail(room)} aria-label={`Lihat detail ${room.name}`}>
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="room-card-body">
        <div className="room-card-heading">
          <div>
            <h2>{room.name}</h2>
            <p className="room-location"><MapPin size={14} /> {location}</p>
          </div>
          {capacity && <span className="room-capacity"><Users size={14} /> {capacity} orang</span>}
        </div>

        <div className="room-schedule-heading">
          <span><Clock3 size={15} /> Pilih waktu</span>
          <span className="room-schedule-date">{new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="room-slots">
          {timeSlots.map((slot) => {
            const booked = approved.some((booking) => booking.startTime === slot.value);
            return (
              <button
                key={slot.value}
                type="button"
                disabled={booked}
                title={booked ? `${slot.label} sudah dipesan` : `Pesan ${slot.range}`}
                onClick={() => onBook(room, slot)}
                className={`room-slot ${booked ? 'is-booked' : 'is-free'}`}
              >
                {booked ? <span className="room-slot-dot" /> : <Check size={12} />}
                {slot.label}
              </button>
            );
          })}
        </div>
        <div className="room-card-footer">
          <span className="room-slot-hint">Durasi per slot · 2 jam</span>
          <button type="button" className="room-detail-link" onClick={() => onDetail(room)}>
            Detail ruangan <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};

const DaftarRuangan = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [query, setQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);
  const { bookings = [] } = useBookings();
  const dateKey = formatDate(selectedDate);

  useEffect(() => {
    let active = true;
    const fetchRooms = async () => {
      try {
        setRoomsLoading(true);
        setRoomsError(null);
        const fetchedRooms = await getAllRooms();
        if (active) setRooms((fetchedRooms || []).sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching rooms:', error);
        if (active) setRoomsError('Daftar ruangan belum dapat dimuat. Silakan coba lagi.');
      } finally {
        if (active) setRoomsLoading(false);
      }
    };
    fetchRooms();
    return () => { active = false; };
  }, []);

  const filteredRooms = useMemo(() => rooms.filter((room) => {
    const matchesQuery = `${room.name} ${room.location || room.lokasi || ''}`.toLowerCase().includes(query.toLowerCase());
    const approved = bookings.filter((booking) =>
      booking.room?.name === room.name &&
      booking.date?.split('T')[0] === dateKey &&
      booking.status === 'Disetujui'
    );
    const hasAvailability = approved.length < timeSlots.length;
    return matchesQuery && (availabilityFilter === 'all' || hasAvailability);
  }), [rooms, bookings, query, availabilityFilter, dateKey]);

  const handleBook = (room, slot) => navigate('/pinjam', {
    state: { room: room.name, date: dateKey, timeSlot: slot.range },
  });

  const handleDetail = (room) => navigate('/detail', { state: { room, selectedDate } });

  const availableRooms = rooms.filter((room) => {
    const occupied = bookings.filter((booking) =>
      booking.room?.name === room.name &&
      booking.date?.split('T')[0] === dateKey &&
      booking.status === 'Disetujui'
    ).length;
    return occupied < timeSlots.length;
  }).length;

  return (
    <div className="booking-discovery">
      <section className="booking-page-intro">
        <div className="booking-intro-copy">
          <span className="eyebrow"><CalendarDays size={14} /> RESERVASI RUANGAN</span>
          <h1>Temukan ruang yang <em>tepat</em> untuk kegiatanmu.</h1>
          <p>Pilih ruangan, cek jadwal yang tersedia, lalu pesan slot waktu tanpa perlu berpindah halaman.</p>
        </div>
        <div className="booking-intro-mark" aria-hidden="true">
          <div className="booking-mark-circle"><CalendarDays size={34} strokeWidth={1.5} /></div>
          <span>TERAS<br />STUDENT CENTER</span>
        </div>
      </section>

      <section className="booking-search-panel" aria-label="Cari dan filter ruangan">
        <div className="booking-search-field">
          <Search size={19} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama ruangan atau lokasi..."
            aria-label="Cari ruangan"
          />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Hapus pencarian">×</button>}
        </div>
        <div className="booking-filter-control">
          <span className="booking-filter-label">Tampilkan</span>
          <div className="booking-filter-tabs">
            <button type="button" className={availabilityFilter === 'all' ? 'active' : ''} onClick={() => setAvailabilityFilter('all')}>Semua ruang</button>
            <button type="button" className={availabilityFilter === 'available' ? 'active' : ''} onClick={() => setAvailabilityFilter('available')}>Tersedia</button>
          </div>
        </div>
      </section>

      <section className="booking-date-row">
        <div>
          <span className="eyebrow">PILIH TANGGAL</span>
          <p>Jadwal akan menyesuaikan tanggal pilihanmu.</p>
        </div>
        <DateNavigator selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </section>

      <section className="booking-results-heading">
        <div>
          <h2>Ruang yang bisa dipesan</h2>
          <p>{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        {!roomsLoading && <span className="booking-result-count"><strong>{availableRooms}</strong> dari {rooms.length} ruang tersedia</span>}
      </section>

      <div className="room-legend">
        <span><i className="legend-dot available" /> Slot tersedia</span>
        <span><i className="legend-dot booked" /> Sudah dipesan</span>
        <span className="room-legend-note">Pilih slot hijau untuk mulai reservasi</span>
      </div>

      {roomsLoading ? (
        <div className="booking-state-panel"><div className="booking-loader" />Memuat ruang yang tersedia...</div>
      ) : roomsError ? (
        <div className="booking-state-panel is-error">{roomsError}</div>
      ) : filteredRooms.length === 0 ? (
        <div className="booking-empty-state">
          <div className="booking-empty-icon"><Search size={25} /></div>
          <h3>Tidak ada ruangan yang cocok</h3>
          <p>Coba kata kunci lain atau tampilkan semua ruangan.</p>
          <button type="button" onClick={() => { setQuery(''); setAvailabilityFilter('all'); }}>Reset pencarian</button>
        </div>
      ) : (
        <div className="room-card-grid">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} room={room} selectedDate={selectedDate} bookings={bookings} onDetail={handleDetail} onBook={handleBook} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DaftarRuangan;
