import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Plus, Sparkles, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingContext';

const statusMeta = {
  Menunggu: { label: 'Menunggu', className: 'status-menunggu', icon: Clock3 },
  Disetujui: { label: 'Disetujui', className: 'status-diterima', icon: CheckCircle2 },
  Ditolak: { label: 'Ditolak', className: 'status-ditolak', icon: XCircle },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserBookings } = useBookings();
  const [userBookings, setUserBookings] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchUserBookings = async () => {
      try {
        setIsLoaded(false);
        setError(null);
        const bookings = await getUserBookings();
        if (active) setUserBookings(bookings || []);
      } catch (fetchError) {
        console.error('Error fetching user bookings:', fetchError);
        if (active) setError('Data reservasi belum dapat dimuat.');
      } finally {
        if (active) setIsLoaded(true);
      }
    };
    if (user) fetchUserBookings();
    return () => { active = false; };
  }, [user, getUserBookings]);

  const stats = {
    total: userBookings.length,
    pending: userBookings.filter((booking) => booking.status === 'Menunggu').length,
    approved: userBookings.filter((booking) => booking.status === 'Disetujui').length,
    rejected: userBookings.filter((booking) => booking.status === 'Ditolak').length,
  };

  const upcomingBookings = useMemo(() => [...userBookings]
    .filter((booking) => booking.status !== 'Ditolak')
    .sort((a, b) => `${a.date?.split('T')[0]}${a.startTime}`.localeCompare(`${b.date?.split('T')[0]}${b.startTime}`))
    .slice(0, 4), [userBookings]);

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || 'Mahasiswa';

  return (
    <div className="user-dashboard">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <span className="eyebrow"><Sparkles size={14} /> TERAS STUDENT CENTER</span>
          <h1>Halo, {firstName}.</h1>
          <p>Ruang yang tepat bisa membuat ide berkembang. Mau mulai kegiatan apa hari ini?</p>
          <Link to="/ruangan" className="dashboard-primary-action"><Plus size={17} /> Cari & pesan ruangan</Link>
        </div>
        <div className="dashboard-welcome-art" aria-hidden="true">
          <div className="dashboard-art-window"><span /><span /><span /><div className="dashboard-art-table" /><div className="dashboard-art-chair one" /><div className="dashboard-art-chair two" /></div>
          <div className="dashboard-art-note"><CalendarDays size={17} /><span>Make room<br />for ideas.</span></div>
        </div>
      </section>

      {error && <div className="dashboard-error">{error}</div>}

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div><span className="eyebrow">RINGKASAN</span><h2>Aktivitas reservasi</h2></div>
          <Link to="/riwayat" className="dashboard-text-link">Lihat riwayat <ArrowRight size={15} /></Link>
        </div>
        <div className="dashboard-stat-grid">
          <article className="dashboard-stat-card stat-total">
            <span className="dashboard-stat-icon"><CalendarDays size={19} /></span>
            <span className="dashboard-stat-label">Total reservasi</span>
            <strong>{isLoaded ? stats.total : '—'}</strong>
            <small>Seluruh pengajuan Anda</small>
          </article>
          <article className="dashboard-stat-card stat-pending">
            <span className="dashboard-stat-icon"><Clock3 size={19} /></span>
            <span className="dashboard-stat-label">Menunggu persetujuan</span>
            <strong>{isLoaded ? stats.pending : '—'}</strong>
            <small>Dalam proses peninjauan</small>
          </article>
          <article className="dashboard-stat-card stat-approved">
            <span className="dashboard-stat-icon"><CheckCircle2 size={19} /></span>
            <span className="dashboard-stat-label">Reservasi disetujui</span>
            <strong>{isLoaded ? stats.approved : '—'}</strong>
            <small>Siap digunakan sesuai jadwal</small>
          </article>
        </div>
      </section>

      <section className="dashboard-section dashboard-bookings-section">
        <div className="dashboard-section-heading">
          <div><span className="eyebrow">JADWAL ANDA</span><h2>Reservasi terbaru</h2></div>
          <Link to="/riwayat" className="dashboard-text-link">Semua reservasi <ArrowRight size={15} /></Link>
        </div>
        {!isLoaded ? (
          <div className="dashboard-list-state">Memuat aktivitas reservasi...</div>
        ) : upcomingBookings.length ? (
          <div className="dashboard-booking-list">
            {upcomingBookings.map((booking) => {
              const status = statusMeta[booking.status] || statusMeta.Menunggu;
              const StatusIcon = status.icon;
              const bookingDate = booking.date ? new Date(`${booking.date.split('T')[0]}T00:00:00`) : null;
              return (
                <article className="dashboard-booking-row" key={booking._id}>
                  <div className="dashboard-booking-date">
                    <strong>{bookingDate ? bookingDate.getDate() : '—'}</strong>
                    <span>{bookingDate ? bookingDate.toLocaleDateString('id-ID', { month: 'short' }) : '—'}</span>
                  </div>
                  <div className="dashboard-booking-info">
                    <h3>{booking.room?.name || 'Ruangan'}</h3>
                    <p>{booking.purpose || 'Kegiatan kampus'} · {booking.startTime}–{booking.endTime}</p>
                  </div>
                  <span className={`dashboard-booking-status ${status.className}`}><StatusIcon size={14} />{status.label}</span>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon"><CalendarDays size={24} /></div>
            <h3>Belum ada reservasi</h3>
            <p>Temukan ruang yang sesuai dan ajukan peminjaman pertamamu.</p>
            <Link to="/ruangan">Jelajahi ruangan <ArrowRight size={15} /></Link>
          </div>
        )}
      </section>

      <section className="dashboard-help-strip">
        <div><span className="eyebrow">BUTUH RUANG UNTUK BERKOLABORASI?</span><h2>Mulai dari ruang yang tepat.</h2><p>Cek jadwal, bandingkan pilihan, dan ajukan reservasi dalam beberapa langkah.</p></div>
        <Link to="/ruangan">Lihat semua ruangan <ArrowRight size={16} /></Link>
      </section>
    </div>
  );
};

export default Dashboard;
