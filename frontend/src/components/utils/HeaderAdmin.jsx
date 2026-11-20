import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import Logo from '../../assets/logo.png';

const PAGE_TITLES = {
  '/admin/dashboard': 'Ringkasan',
  '/admin/rooms': 'Manajemen ruangan',
  '/admin/bookings': 'Kelola peminjaman',
  '/admin/riwayat': 'Riwayat reservasi',
  '/admin/detail': 'Detail jadwal ruangan',
  '/detailRuanganAdmin': 'Detail ruangan',
};

const HeaderAdmin = ({ onToggleSidebar }) => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Administrator';

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button type="button" onClick={onToggleSidebar} className="admin-mobile-menu" aria-label="Buka navigasi"><Menu size={21} /></button>
        <Link to="/admin/dashboard" className="admin-topbar-brand"><img src={Logo} alt="Teras SC" /><span>TERAS SC</span></Link>
        <span className="admin-topbar-divider" />
        <span className="admin-topbar-current">{title}</span>
      </div>
      <div className="admin-topbar-right">
        <span className="admin-topbar-role"><span /> Administrator</span>
        <Link to="/admin/bookings" className="admin-topbar-notification" aria-label="Lihat pengajuan reservasi"><Bell size={17} /></Link>
        <span className="admin-topbar-avatar">A</span>
      </div>
    </header>
  );
};

export default HeaderAdmin;
