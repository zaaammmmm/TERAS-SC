import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays, CheckCircle2, ChevronRight, DoorOpen,
  MapPin, Search, XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllRooms } from '../../api/rooms';
import { useBookings } from '../../contexts/BookingContext';

const TIME_SLOTS = [
  { label: '07.00', start: '07:00', end: '09:00' },
  { label: '09.00', start: '09:00', end: '11:00' },
  { label: '11.00', start: '11:00', end: '13:00' },
  { label: '13.00', start: '13:00', end: '15:00' },
  { label: '15.00', start: '15:00', end: '17:00' },
  { label: '17.00', start: '17:00', end: '19:00' },
  { label: '19.00', start: '19:00', end: '21:00' },
];

const toDateKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
};

const slotStatus = (bookings, roomName, date, slot) => {
  const matches = bookings.filter((booking) => {
    if (booking.room?.name !== roomName || String(booking.date || '').slice(0, 10) !== date || booking.status !== 'Disetujui') return false;
    return booking.startTime < slot.end && booking.endTime > slot.start;
  });
  return matches.length ? 'booked' : 'free';
};

const AdminRoomCard = ({ room, selectedDate, bookings, onOpen }) => {
  const dateKey = toDateKey(selectedDate);
  const roomBookings = bookings.filter((booking) =>
    booking.room?.name === room.name
    && String(booking.date || '').slice(0, 10) === dateKey
    && booking.status === 'Disetujui'
  );
  const usedSlots = TIME_SLOTS.filter((slot) => slotStatus(bookings, room.name, dateKey, slot) === 'booked').length;
  const availableSlots = TIME_SLOTS.length - usedSlots;

  return (
    <article className="admin-room-card">
      <div className="admin-room-cover">
        {room.image ? <img src={room.image} alt={room.name} onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <div className="admin-room-cover-fallback"><DoorOpen size={42} strokeWidth={1.2} /></div>}
        <span className={`admin-room-live-tag ${availableSlots ? 'available' : 'full'}`}><i />{availableSlots ? 'Ada slot tersedia' : 'Jadwal penuh'}</span>
      </div>
      <div className="admin-room-card-body">
        <div className="admin-room-card-title"><div><span className="admin-eyebrow">STUDENT CENTER</span><h3>{room.name}</h3></div><button type="button" onClick={onOpen} className="admin-room-open" aria-label={`Lihat ${room.name}`}><ChevronRight size={18} /></button></div>
        <div className="admin-room-location"><MapPin size={14} /> {room.location || 'Lokasi belum ditentukan'}</div>
        <div className="admin-room-availability-summary">
          <div><strong>{availableSlots}</strong><span>slot tersedia</span></div>
          <div><strong>{roomBookings.length}</strong><span>reservasi disetujui</span></div>
        </div>
        <div className="admin-room-slot-label"><span>Ketersediaan jadwal</span><span>{selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span></div>
        <div className="admin-room-slot-grid">
          {TIME_SLOTS.map((slot) => {
            const state = slotStatus(bookings, room.name, dateKey, slot);
            return <span className={`admin-room-slot ${state}`} key={slot.start} title={`${slot.label} · ${state === 'free' ? 'Belum ada reservasi disetujui' : 'Sudah terjadwal'}`}>{slot.label}</span>;
          })}
        </div>
        <button type="button" className="admin-room-detail-button" onClick={onOpen}>Lihat jadwal & detail <ChevronRight size={15} /></button>
      </div>
    </article>
  );
};

const RoomsAdmin = () => {
  const navigate = useNavigate();
  const { bookings = [] } = useBookings();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    let active = true;
    getAllRooms()
      .then((data) => { if (active) setRooms(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err.message || 'Gagal memuat data ruangan.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const dateKey = toDateKey(selectedDate);
  const filteredRooms = useMemo(() => rooms.filter((room) => {
    const matchQuery = `${room.name || ''} ${room.location || ''}`.toLowerCase().includes(query.toLowerCase());
    const freeCount = TIME_SLOTS.filter((slot) => slotStatus(bookings, room.name, dateKey, slot) === 'free').length;
    return matchQuery && (availabilityFilter === 'all' || (availabilityFilter === 'available' ? freeCount > 0 : freeCount === 0));
  }), [rooms, bookings, dateKey, query, availabilityFilter]);

  const shiftDate = (amount) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + amount);
    setSelectedDate(next);
  };

  const totalConfirmed = bookings.filter((booking) =>
    String(booking.date || '').slice(0, 10) === dateKey && booking.status === 'Disetujui'
  ).length;

  return (
    <div className="admin-page">
      <section className="admin-page-heading">
        <div><span className="admin-eyebrow">INVENTARIS & KETERSEDIAAN</span><h1>Manajemen ruangan</h1><p>Pantau jadwal penggunaan setiap ruang dan temukan waktu yang masih tersedia.</p></div>
        <div className="admin-heading-meta"><span className="admin-heading-date"><DoorOpen size={15} /> {rooms.length} ruang terdaftar</span></div>
      </section>

      <section className="admin-room-overview">
        <div className="admin-room-overview-icon"><CalendarDays size={21} /></div>
        <div className="admin-room-date-copy"><span>JADWAL YANG DITINJAU</span><strong>{selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong><small>{totalConfirmed} reservasi disetujui pada tanggal ini</small></div>
        <div className="admin-date-navigator"><button type="button" onClick={() => shiftDate(-1)} aria-label="Hari sebelumnya">‹</button><input type="date" value={dateKey} onChange={(event) => setSelectedDate(new Date(`${event.target.value}T12:00:00`))} /><button type="button" onClick={() => shiftDate(1)} aria-label="Hari berikutnya">›</button><button type="button" className="admin-today-button" onClick={() => setSelectedDate(new Date())}>Hari ini</button></div>
      </section>

      <section className="admin-room-toolbar">
        <label className="admin-search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau lokasi ruangan…" /></label>
        <div className="admin-filter-pills"><button type="button" className={availabilityFilter === 'all' ? 'active' : ''} onClick={() => setAvailabilityFilter('all')}>Semua ruang</button><button type="button" className={availabilityFilter === 'available' ? 'active' : ''} onClick={() => setAvailabilityFilter('available')}><CheckCircle2 size={13} /> Tersedia</button><button type="button" className={availabilityFilter === 'full' ? 'active' : ''} onClick={() => setAvailabilityFilter('full')}><XCircle size={13} /> Penuh</button></div>
      </section>

      {loading ? <div className="admin-table-state"><span className="admin-loader" /> Memuat daftar ruangan…</div>
        : error ? <div className="admin-notice is-error">{error}</div>
          : filteredRooms.length ? <section className="admin-room-grid">
            {filteredRooms.map((room) => <AdminRoomCard key={room._id} room={room} selectedDate={selectedDate} bookings={bookings} onOpen={() => navigate('/admin/detail', { state: { room, selectedDate } })} />)}
          </section>
            : <div className="admin-table-state"><div className="admin-empty-icon"><Search size={22} /></div><strong>Ruangan tidak ditemukan</strong><span>Ubah pencarian atau filter ketersediaan.</span><button type="button" onClick={() => { setQuery(''); setAvailabilityFilter('all'); }}>Reset pencarian</button></div>}
      <p className="admin-room-legend"><span><i className="free" /> Belum ada reservasi disetujui</span><span><i className="booked" /> Terjadwal / sudah disetujui</span><small>Slot ditampilkan dalam interval dua jam.</small></p>
    </div>
  );
};

export default RoomsAdmin;
