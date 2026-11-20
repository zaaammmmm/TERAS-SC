import { useMemo, useState } from 'react';
import {
  CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  Clock3, Filter, Search, SlidersHorizontal, Users, X, XCircle,
} from 'lucide-react';
import { useBookings } from '../../contexts/BookingContext';

const statusClass = (status) => {
  if (status === 'Disetujui') return 'admin-status approved';
  if (status === 'Ditolak') return 'admin-status rejected';
  return 'admin-status pending';
};

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

const BookingsAdmin = () => {
  const { bookings = [], updateBookingStatus, isLoaded, error, loadAllBookings } = useBookings();
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [query, setQuery] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [actionError, setActionError] = useState('');

  const roomOptions = useMemo(() => [...new Set(bookings.map((item) => item.room?.name).filter(Boolean))].sort(), [bookings]);
  const counts = useMemo(() => ({
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'Menunggu').length,
    approved: bookings.filter((b) => b.status === 'Disetujui').length,
    rejected: bookings.filter((b) => b.status === 'Ditolak').length,
  }), [bookings]);

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const normalizedQuery = query.trim().toLowerCase();
    const searchable = [
      booking.user?.name, booking.user?.email, booking.room?.name,
      booking.purpose, booking._id,
    ].filter(Boolean).join(' ').toLowerCase();
    const bookingDate = String(booking.date || '').slice(0, 10);
    return (statusFilter === 'All' || booking.status === statusFilter)
      && (roomFilter === 'All' || booking.room?.name === roomFilter)
      && (!dateFilter || bookingDate === dateFilter)
      && (!normalizedQuery || searchable.includes(normalizedQuery));
  }).sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)), [
    bookings, statusFilter, roomFilter, dateFilter, query,
  ]);

  const shiftDate = (amount) => {
    const date = dateFilter ? new Date(`${dateFilter}T12:00:00`) : new Date();
    date.setDate(date.getDate() + amount);
    const year = date.getFullYear();
    setDateFilter(`${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  };

  const resetFilters = () => {
    setStatusFilter('All');
    setRoomFilter('All');
    setDateFilter('');
    setQuery('');
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setFeedback('');
    setActionError('');
    try {
      await updateBookingStatus(id, status);
      setFeedback(`Reservasi berhasil ${status.toLowerCase()}.`);
      await loadAllBookings?.();
    } catch (err) {
      setActionError(err.message || 'Gagal memperbarui status reservasi.');
    } finally {
      setUpdatingId('');
      window.setTimeout(() => setFeedback(''), 3500);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-page-heading">
        <div><span className="admin-eyebrow">PENGELOLAAN OPERASIONAL</span><h1>Kelola peminjaman</h1><p>Tinjau permintaan, periksa jadwal, dan kelola keputusan reservasi ruangan.</p></div>
        <div className="admin-heading-meta"><span className="admin-heading-date"><CalendarDays size={15} /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
      </section>

      <section className="admin-booking-summary">
        <button className={`admin-summary-item ${statusFilter === 'All' ? 'is-selected' : ''}`} onClick={() => setStatusFilter('All')} type="button">
          <span className="admin-summary-label">Semua reservasi</span><strong>{isLoaded ? counts.all : '—'}</strong><small>Total pengajuan</small>
        </button>
        <button className={`admin-summary-item amber ${statusFilter === 'Menunggu' ? 'is-selected' : ''}`} onClick={() => setStatusFilter('Menunggu')} type="button">
          <span className="admin-summary-label">Menunggu</span><strong>{isLoaded ? counts.pending : '—'}</strong><small>Butuh persetujuan</small>
        </button>
        <button className={`admin-summary-item green ${statusFilter === 'Disetujui' ? 'is-selected' : ''}`} onClick={() => setStatusFilter('Disetujui')} type="button">
          <span className="admin-summary-label">Disetujui</span><strong>{isLoaded ? counts.approved : '—'}</strong><small>Reservasi terkonfirmasi</small>
        </button>
        <button className={`admin-summary-item red ${statusFilter === 'Ditolak' ? 'is-selected' : ''}`} onClick={() => setStatusFilter('Ditolak')} type="button">
          <span className="admin-summary-label">Ditolak</span><strong>{isLoaded ? counts.rejected : '—'}</strong><small>Pengajuan ditolak</small>
        </button>
      </section>

      {(feedback || actionError || error) && (
        <div className={`admin-notice ${(actionError || error) ? 'is-error' : ''}`}>{actionError || error || feedback}</div>
      )}

      <section className="admin-panel admin-bookings-panel">
        <div className="admin-panel-heading admin-table-heading">
          <div><span className="admin-eyebrow">DAFTAR PENGAJUAN</span><h3>Reservasi masuk <span className="admin-inline-count">{filteredBookings.length}</span></h3></div>
          <button type="button" className="admin-refresh-button" onClick={() => loadAllBookings?.()}><SlidersHorizontal size={15} /> Perbarui data</button>
        </div>

        <div className="admin-filter-toolbar">
          <label className="admin-search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama, email, ruangan, atau keperluan…" /><kbd>⌘ K</kbd></label>
          <div className="admin-filter-controls">
            <label className="admin-select-wrap"><Filter size={14} /><select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}><option value="All">Semua ruangan</option>{roomOptions.map((room) => <option key={room} value={room}>{room}</option>)}</select><ChevronDown size={14} /></label>
            <div className="admin-date-control"><button type="button" onClick={() => shiftDate(-1)} aria-label="Tanggal sebelumnya"><ChevronLeft size={15} /></button><input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} aria-label="Filter tanggal" /><button type="button" onClick={() => shiftDate(1)} aria-label="Tanggal berikutnya"><ChevronRight size={15} /></button></div>
            {(statusFilter !== 'All' || roomFilter !== 'All' || dateFilter || query) && <button className="admin-clear-filter" onClick={resetFilters} type="button"><X size={14} /> Reset</button>}
          </div>
        </div>

        {!isLoaded ? <div className="admin-table-state"><span className="admin-loader" /> Memuat data reservasi…</div>
          : filteredBookings.length === 0 ? (
            <div className="admin-table-state"><div className="admin-empty-icon"><Search size={22} /></div><strong>Tidak ada reservasi ditemukan</strong><span>Coba ubah kata kunci atau filter yang digunakan.</span><button type="button" onClick={resetFilters}>Hapus semua filter</button></div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-data-table">
                <thead><tr><th>Peminjam</th><th>Ruangan</th><th>Tanggal & waktu</th><th>Keperluan</th><th>Peserta</th><th>Status</th><th className="admin-action-head">Tindakan</th></tr></thead>
                <tbody>{filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td><div className="admin-person-cell"><span className="admin-person-avatar">{(booking.user?.name || 'P').trim().charAt(0).toUpperCase()}</span><div><strong>{booking.user?.name || 'Pengguna'}</strong><span>{booking.user?.email || '—'}</span></div></div></td>
                    <td><strong className="admin-room-name">{booking.room?.name || '—'}</strong></td>
                    <td><div className="admin-date-cell"><strong>{formatDate(booking.date)}</strong><span><Clock3 size={12} /> {booking.startTime}–{booking.endTime}</span></div></td>
                    <td><span className="admin-purpose" title={booking.purpose}>{booking.purpose || '—'}</span></td>
                    <td><span className="admin-participant-count"><Users size={13} /> {booking.participants ?? '—'}</span></td>
                    <td><span className={statusClass(booking.status)}><i />{booking.status}</span></td>
                    <td>{booking.status === 'Menunggu' ? <div className="admin-row-actions">
                      <button type="button" className="admin-approve-button" disabled={updatingId === booking._id} onClick={() => updateStatus(booking._id, 'Disetujui')}><Check size={14} /> Setujui</button>
                      <button type="button" className="admin-reject-button" disabled={updatingId === booking._id} onClick={() => updateStatus(booking._id, 'Ditolak')}><XCircle size={14} /> Tolak</button>
                    </div> : <span className="admin-no-action">—</span>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        <div className="admin-table-footer"><span>Menampilkan <strong>{filteredBookings.length}</strong> dari <strong>{bookings.length}</strong> reservasi</span><span>Data diperbarui dari sistem reservasi</span></div>
      </section>
    </div>
  );
};

export default BookingsAdmin;
