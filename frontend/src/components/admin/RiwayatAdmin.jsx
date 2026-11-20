import { useMemo, useState } from 'react';
import { CalendarDays, History, Search, Users } from 'lucide-react';
import { useBookings } from '../../contexts/BookingContext';

const RiwayatAdmin = () => {
  const { bookings = [], isLoaded, error } = useBookings();
  const [query, setQuery] = useState('');
  const approvedBookings = useMemo(() => bookings
    .filter((booking) => booking.status === 'Disetujui')
    .filter((booking) => {
      const haystack = [booking._id, booking.room?.name, booking.user?.name, booking.purpose]
        .filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)), [bookings, query]);

  return (
    <div className="admin-page">
      <section className="admin-page-heading">
        <div><span className="admin-eyebrow">ARSIP RESERVASI</span><h1>Riwayat peminjaman</h1><p>Arsip seluruh peminjaman yang telah disetujui oleh administrator.</p></div>
        <div className="admin-history-total"><History size={18} /><strong>{bookings.filter((b) => b.status === 'Disetujui').length}</strong><span>reservasi disetujui</span></div>
      </section>

      {(error) && <div className="admin-notice is-error">{error}</div>}

      <section className="admin-panel">
        <div className="admin-panel-heading admin-table-heading">
          <div><span className="admin-eyebrow">CATATAN SELESAI DIVERIFIKASI</span><h3>Arsip reservasi <span className="admin-inline-count">{approvedBookings.length}</span></h3></div>
          <label className="admin-search-box admin-history-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari peminjam atau ruangan…" /></label>
        </div>
        {!isLoaded ? <div className="admin-table-state"><span className="admin-loader" /> Memuat riwayat…</div>
          : approvedBookings.length ? <div className="admin-table-scroll">
            <table className="admin-data-table">
              <thead><tr><th>Ruangan</th><th>Peminjam</th><th>Tanggal penggunaan</th><th>Waktu</th><th>Keperluan</th><th>Peserta</th><th>Status</th></tr></thead>
              <tbody>{approvedBookings.map((booking) => (
                <tr key={booking._id}>
                  <td><strong className="admin-room-name">{booking.room?.name || '—'}</strong><span className="admin-table-subline">ID #{String(booking._id).slice(-6)}</span></td>
                  <td><div className="admin-person-cell"><span className="admin-person-avatar">{(booking.user?.name || 'P').trim().charAt(0).toUpperCase()}</span><div><strong>{booking.user?.name || 'Pengguna'}</strong><span>{booking.user?.email || '—'}</span></div></div></td>
                  <td><span className="admin-date-cell"><strong>{booking.date ? new Date(booking.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</strong></span></td>
                  <td><span className="admin-history-time"><CalendarDays size={13} /> {booking.startTime}–{booking.endTime}</span></td>
                  <td><span className="admin-purpose" title={booking.purpose}>{booking.purpose || '—'}</span></td>
                  <td><span className="admin-participant-count"><Users size={13} /> {booking.participants ?? '—'}</span></td>
                  <td><span className="admin-status approved"><i /> Disetujui</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div> : <div className="admin-table-state"><div className="admin-empty-icon"><History size={22} /></div><strong>Riwayat tidak ditemukan</strong><span>{query ? 'Coba kata kunci pencarian lain.' : 'Belum ada peminjaman yang disetujui.'}</span></div>}
        <div className="admin-table-footer"><span>Menampilkan <strong>{approvedBookings.length}</strong> data arsip</span><span>Riwayat hanya menampilkan reservasi disetujui</span></div>
      </section>
    </div>
  );
};

export default RiwayatAdmin;
