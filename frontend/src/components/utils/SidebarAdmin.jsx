import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarClock, ChartNoAxesCombined, DoorOpen, History,
  LayoutDashboard, LogOut, ShieldCheck, X,
} from 'lucide-react';

const SidebarAdmin = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState('');

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');
    setLogoutMessage('Anda telah keluar dari akun.');
    window.setTimeout(() => {
      onClose?.();
      navigate('/', { replace: true });
    }, 700);
  };

  const links = [
    { to: '/admin/dashboard', label: 'Ringkasan', icon: LayoutDashboard, end: true },
    { to: '/admin/rooms', label: 'Manajemen ruangan', icon: DoorOpen },
    { to: '/admin/bookings', label: 'Kelola peminjaman', icon: CalendarClock },
    { to: '/admin/riwayat', label: 'Riwayat reservasi', icon: History },
  ];

  return (
    <>
      {isOpen && <button type="button" className="admin-sidebar-overlay" onClick={onClose} aria-label="Tutup navigasi" />}
      <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-brand-mark"><ShieldCheck size={19} /></span>
          <div><strong>TERAS SC</strong><span>ADMIN WORKSPACE</span></div>
          <button type="button" className="admin-sidebar-close" onClick={onClose} aria-label="Tutup menu"><X size={19} /></button>
        </div>

        <div className="admin-sidebar-section-label">WORKSPACE</div>
        <nav className="admin-sidebar-nav">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {to === '/admin/bookings' && <i className="admin-sidebar-link-indicator" />}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-spacer" />
        <div className="admin-sidebar-help">
          <div className="admin-sidebar-help-icon"><ChartNoAxesCombined size={17} /></div>
          <strong>Kelola ruang lebih baik</strong>
          <p>Pantau permintaan dan penggunaan ruang Student Center.</p>
        </div>
        <button type="button" className="admin-sidebar-logout" onClick={handleLogout}><LogOut size={17} /> Keluar dari akun</button>
        {logoutMessage && <div className="admin-logout-toast">{logoutMessage}</div>}
      </aside>
    </>
  );
};

export default SidebarAdmin;
