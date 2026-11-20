import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft, CalendarDays, Check, Clock3, Mail, MapPin,
  Users, XCircle,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookings } from '../../contexts/BookingContext';

const formatDate = (value) => new Date(value).toLocaleDateString('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const DetailRooms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, selectedDate } = location.state || {};
  const { getAllBookings: fetchAllBookingsAPI, updateBookingStatus } = useBookings();
  const [roomBookings, setRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [feedback, setFeedback] = useState('');

  const dateKey = selectedDate ? (() => {
    const date = new Date(selectedDate);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  })() : '';

  const fetchAndFilterBookings = useCallback(async () => {
    if (!room || !dateKey) return;
    try {
      setLoading(true);
      setError('');
      const allBookings = await fetchAllBookingsAPI();
      const filtered = allBookings.filter((booking) =>
        booking.room?.name === room.name && String(booking.date || '').slice(0, 10) === dateKey
      ).sort((a, b) => a.startTime.localeCompare(b.startTime));
      setRoomBookings(filtered);
    } catch (err) {
      setError(err.message || 'Gagal memuat jadwal ruangan.');
    } finally {
      setLoading(false);
    }
  }, [room, dateKey, fetchAllBookingsAPI]);

  useEffect(() => { fetchAndFilterBookings(); }, [fetchAndFilterBookings]);

  const handleAction = async (bookingId, status) => {
    setUpdatingId(bookingId);
    setError('');
    setFeedback('');
    try {
      await updateBookingStatus(bookingId, status);
      setFeedback(`Reservasi berhasil ${status.toLowerCase()}.`);
      await fetchAndFilterBookings();
    } catch (err) {
      setError(err.message || 'Gagal memperbarui status reservasi.');
    } finally {
      setUpdatingId('');
    }
  };

  if (!room || !selectedDate) {
    return <div className="admin-page"><div className="admin-panel admin-detail-empty"><strong>Data ruangan tidak ditemukan</strong><p>Kembali ke daftar ruangan untuk memilih jadwal.</p><button className="admin-button admin-button-primary" onClick={() => navigate('/admin/rooms')}>Kembali ke ruangan</button></div></div>;
  }

  const pendingCount = roomBookings.filter((booking) => booking.status === 'Menunggu').length;
  const approvedCount = roomBookings.filter((booking) => booking.status === 'Disetujui').length;

  return (
    <div className="admin-page">
      <button type="button" className="admin-back-link" onClick={() => navigate('/admin/rooms')}><ArrowLeft size={16} /> Kembali ke manajemen ruangan</button>
      <section className="admin-detail-hero">
        <div className="admin-detail-cover">{room.image ? <img src={room.image} alt={room.name} /> : <div><span><MapPin size={32} /></span></div>}</div>
        <div className="admin-detail-info">
          <span className="admin-eyebrow">JADWAL RUANGAN</span>
          <h1>{room.name}</h1>
          <p><MapPin size={15} /> {room.location || 'Student Center'}</p>
          <div className="admin-detail-date"><CalendarDays size={16} /> {formatDate(selectedDate)}</div>
        </div>
        <div className="admin-detail-stats">
          <div><strong>{roomBookings.length}</strong><span>Total pengajuan</span></div>
          <div><strong>{pendingCount}</strong><span>Menunggu</span></div>
          <div><strong>{approvedCount}</strong><span>Disetujui</span></div>
        </div>
      </section>

      {(feedback || error) && <div className={`admin-notice ${error ? 'is-error' : ''}`}>{error || feedback}</div>}

      <section className="admin-panel">
        <div className="admin-panel-heading admin-table-heading">
          <div><span className="admin-eyebrow">DAFTAR PENGGUNAAN</span><h3>Pengajuan pada tanggal ini</h3></div>
          <span className="admin-panel-chip"><Clock3 size={14} /> Urut berdasarkan waktu mulai</span>
        </div>
        {loading ? <div className="admin-table-state"><span className="admin-loader" /> Memuat jadwal…</div>
          : roomBookings.length ? <div className="admin-booking-timeline">
            {roomBookings.map((booking) => (
              <article className="admin-timeline-item" key={booking._id}>
                <div className="admin-timeline-time"><strong>{booking.startTime}</strong><span>{booking.endTime}</span></div>
                <div className="admin-timeline-line"><i /></div>
                <div className="admin-timeline-card">
                  <div className="admin-timeline-main">
                    <div className="admin-timeline-title"><div><strong>{booking.purpose || 'Peminjaman ruangan'}</strong><span>{booking.user?.name || 'Pengguna'} · ID #{String(booking._id).slice(-6)}</span></div><span className={`admin-status ${booking.status === 'Disetujui' ? 'approved' : booking.status === 'Ditolak' ? 'rejected' : 'pending'}`}><i />{booking.status}</span></div>
                    <div className="admin-timeline-meta"><span><Mail size={13} /> {booking.user?.email || 'Email tidak tersedia'}</span><span><Users size={13} /> {booking.participants ?? '—'} peserta</span></div>
                  </div>
                  {booking.status === 'Menunggu' && <div className="admin-row-actions"><button type="button" className="admin-approve-button" disabled={updatingId === booking._id} onClick={() => handleAction(booking._id, 'Disetujui')}><Check size={14} /> Setujui</button><button type="button" className="admin-reject-button" disabled={updatingId === booking._id} onClick={() => handleAction(booking._id, 'Ditolak')}><XCircle size={14} /> Tolak</button></div>}
                </div>
              </article>
            ))}
          </div> : <div className="admin-table-state"><div className="admin-empty-icon"><CalendarDays size={22} /></div><strong>Belum ada pengajuan</strong><span>Tidak ada reservasi untuk ruangan ini pada tanggal yang dipilih.</span></div>}
      </section>
    </div>
  );
};

export default DetailRooms;
