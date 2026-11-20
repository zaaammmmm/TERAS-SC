import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, CalendarDays, CheckCircle2, Clock3, DoorOpen,
  History, ListChecks, RefreshCw, TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllRooms } from '../../api/rooms';
import { useBookings } from '../../contexts/BookingContext';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const statusTone = (status) => {
  if (status === 'Disetujui') return 'admin-status approved';
  if (status === 'Ditolak') return 'admin-status rejected';
  return 'admin-status pending';
};

const DashboardAdmin = () => {
  const { bookings = [], isLoaded, error, loadAllBookings } = useBookings();
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    getAllRooms()
      .then((data) => { if (active) setRooms(Array.isArray(data) ? data : []); })
      .catch((err) => console.error('Gagal memuat daftar ruangan:', err))
      .finally(() => { if (active) setRoomsLoading(false); });
    return () => { active = false; };
  }, []);

  const metrics = useMemo(() => {
    const pending = bookings.filter((b) => b.status === 'Menunggu');
    const approved = bookings.filter((b) => b.status === 'Disetujui');
    const rejected = bookings.filter((b) => b.status === 'Ditolak');
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayBookings = bookings.filter((b) => String(b.date || '').slice(0, 10) === todayKey);
    const recent = [...bookings].sort((a, b) =>
      new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
    ).slice(0, 6);
    const roomCounts = rooms.map((room) => ({
      name: room.name,
      count: bookings.filter((b) => b.room?.name === room.name).length,
    })).sort((a, b) => b.count - a.count);
    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return {
        label: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        count: bookings.filter((b) => String(b.date || '').slice(0, 10) === key).length,
      };
    });
    return { pending, approved, rejected, todayBookings, recent, roomCounts, lastSevenDays };
  }, [bookings, rooms]);

  const maxDaily = Math.max(1, ...metrics.lastSevenDays.map((item) => item.count));
  const maxRoom = Math.max(1, ...metrics.roomCounts.map((item) => item.count));

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAllBookings?.();
      const freshRooms = await getAllRooms();
      setRooms(Array.isArray(freshRooms) ? freshRooms : []);
    } catch (err) {
      console.error('Gagal memperbarui dashboard:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="admin-welcome">
        <div>
          <span className="admin-eyebrow"><span className="admin-live-dot" /> TERAS SC / ADMINISTRATION</span>
          <h1>Ruang kendali reservasi.</h1>
          <p>Pantau aktivitas Student Center dan tindak lanjuti pengajuan ruangan dari satu tempat.</p>
          <div className="admin-welcome-actions">
            <Link to="/admin/bookings" className="admin-button admin-button-light">
              <ListChecks size={16} /> Tinjau pengajuan
              {metrics.pending.length > 0 && <span className="admin-button-count">{metrics.pending.length}</span>}
            </Link>
            <Link to="/admin/rooms" className="admin-button admin-button-outline">
              <DoorOpen size={16} /> Lihat ruangan
            </Link>
          </div>
        </div>
        <div className="admin-welcome-aside" aria-hidden="true">
          <div className="admin-orbit admin-orbit-one" />
          <div className="admin-orbit admin-orbit-two" />
          <div className="admin-welcome-symbol"><DoorOpen size={54} strokeWidth={1.15} /></div>
          <span>STUDENT CENTER<br />SPACE MANAGEMENT</span>
        </div>
      </section>

      {(error || (!isLoaded && bookings.length === 0)) && (
        <div className={`admin-notice ${error ? 'is-error' : ''}`}>
          {error || 'Mengambil data reservasi terbaru…'}
        </div>
      )}

      <div className="admin-section-heading">
        <div><span className="admin-eyebrow">RINGKASAN OPERASIONAL</span><h2>Aktivitas hari ini</h2></div>
        <button type="button" className="admin-icon-button" onClick={handleRefresh} disabled={refreshing} aria-label="Perbarui data">
          <RefreshCw size={16} className={refreshing ? 'admin-spin' : ''} />
        </button>
      </div>

      <section className="admin-metric-grid">
        <article className="admin-metric-card">
          <div className="admin-metric-top"><span>Total reservasi</span><span className="admin-metric-icon green"><CalendarDays size={18} /></span></div>
          <strong>{isLoaded ? bookings.length : '—'}</strong>
          <small>Seluruh data yang tercatat</small>
        </article>
        <article className="admin-metric-card">
          <div className="admin-metric-top"><span>Menunggu persetujuan</span><span className="admin-metric-icon amber"><Clock3 size={18} /></span></div>
          <strong>{isLoaded ? metrics.pending.length : '—'}</strong>
          <small>{metrics.pending.length ? 'Perlu ditinjau oleh admin' : 'Tidak ada antrean persetujuan'}</small>
        </article>
        <article className="admin-metric-card">
          <div className="admin-metric-top"><span>Telah disetujui</span><span className="admin-metric-icon blue"><CheckCircle2 size={18} /></span></div>
          <strong>{isLoaded ? metrics.approved.length : '—'}</strong>
          <small>Reservasi berstatus disetujui</small>
        </article>
        <article className="admin-metric-card">
          <div className="admin-metric-top"><span>Ruangan terdaftar</span><span className="admin-metric-icon gold"><DoorOpen size={18} /></span></div>
          <strong>{roomsLoading ? '—' : rooms.length}</strong>
          <small>{metrics.todayBookings.length} reservasi terjadwal hari ini</small>
        </article>
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel admin-trend-panel">
          <div className="admin-panel-heading">
            <div><span className="admin-eyebrow">TREN PERMINTAAN</span><h3>Reservasi 7 hari terakhir</h3></div>
            <span className="admin-panel-chip"><TrendingUp size={13} /> Berdasarkan tanggal penggunaan</span>
          </div>
          <div className="admin-chart">
            {metrics.lastSevenDays.map((item) => (
              <div className="admin-chart-column" key={item.label}>
                <span className="admin-chart-value">{item.count}</span>
                <div className="admin-chart-track"><div className="admin-chart-bar" style={{ height: `${Math.max(item.count ? 8 : 3, (item.count / maxDaily) * 100)}%` }} /></div>
                <span className="admin-chart-label">{item.label}</span>
              </div>
            ))}
          </div>
          {/* <p className="admin-chart-footnote">Jumlah reservasi per hari, termasuk seluruh status.</p> */}
        </article>

        <article className="admin-panel admin-pending-panel">
          <div className="admin-panel-heading">
            <div><span className="admin-eyebrow">BUTUH PERHATIAN</span><h3>Antrean persetujuan</h3></div>
            <span className="admin-count-pill">{metrics.pending.length}</span>
          </div>
          {metrics.pending.length ? (
            <div className="admin-pending-list">
              {metrics.pending.slice(0, 2).map((booking) => (
                <div className="admin-pending-item" key={booking._id}>
                  <span className="admin-pending-avatar">{(booking.user?.name || 'P').trim().charAt(0).toUpperCase()}</span>
                  <div className="admin-pending-copy">
                    <strong>{booking.user?.name || 'Pengguna'}</strong>
                    <span>{booking.room?.name || 'Ruangan'} · {formatDate(booking.date)}</span>
                    <small>{booking.startTime}–{booking.endTime}</small>
                  </div>
                  <span className={statusTone(booking.status)}>Menunggu</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty-compact"><CheckCircle2 size={24} /><strong>Semua pengajuan tertangani</strong><span>Belum ada reservasi yang menunggu persetujuan.</span></div>
          )}
          <Link to="/admin/bookings" className="admin-panel-link">Buka semua pengajuan <ArrowUpRight size={15} /></Link>
        </article>

        <article className="admin-panel admin-room-usage">
          <div className="admin-panel-heading">
            <div><span className="admin-eyebrow">RUANGAN</span><h3>Permintaan per ruangan</h3></div>
            <Link to="/admin/rooms" className="admin-text-link">Kelola ruangan <ArrowUpRight size={14} /></Link>
          </div>
          {roomsLoading ? <p className="admin-muted">Memuat daftar ruangan…</p> : metrics.roomCounts.length ? (
            <div className="admin-room-bars">
              {metrics.roomCounts.slice(0, 6).map((room) => (
                <div className="admin-room-bar-row" key={room.name}>
                  <span title={room.name}>{room.name}</span>
                  <div className="admin-room-bar-track"><div style={{ width: `${(room.count / maxRoom) * 100}%` }} /></div>
                  <strong>{room.count}</strong>
                </div>
              ))}
            </div>
          ) : <div className="admin-empty-compact">Belum ada data ruangan.</div>}
        </article>

        <article className="admin-panel admin-recent-panel">
          <div className="admin-panel-heading">
            <div><span className="admin-eyebrow">PEMBARUAN TERBARU</span><h3>Aktivitas reservasi</h3></div>
            <Link to="/admin/riwayat" className="admin-text-link">Lihat riwayat <ArrowUpRight size={14} /></Link>
          </div>
          {metrics.recent.length ? (
            <div className="admin-recent-list">
              {metrics.recent.slice(0, 3).map((booking) => (
                <div className="admin-recent-item" key={booking._id}>
                  <span className="admin-recent-icon"><History size={16} /></span>
                  <div><strong>{booking.room?.name || 'Ruangan'}</strong><span>{booking.user?.name || 'Pengguna'} · {formatDate(booking.date)}</span></div>
                  <span className={statusTone(booking.status)}>{booking.status}</span>
                </div>
              ))}
            </div>
          ) : <div className="admin-empty-compact">Belum ada aktivitas reservasi.</div>}
        </article>
      </section>
    </div>
  );
};

export default DashboardAdmin;
