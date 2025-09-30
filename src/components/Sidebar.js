// src/components/Sidebar.js

import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="sidebar-container">
            <h4 className="sidebar-title">MENU RESERVASI</h4>
            <nav className="sidebar-nav">
                {/* Link Dashboard */}
                <Link 
                    to="/dashboard" 
                    className={location.pathname === '/dashboard' ? 'active cta-link' : 'cta-link'}
                >
                    Dashboard
                </Link>

                {/* Link ke Daftar Ruangan */}
                <Link to="/ruangan" className={location.pathname === '/ruangan' ? 'active' : ''}>
                    Rooms (Cek Ketersediaan)
                </Link>
                
                {/* Link ke Form Peminjaman */}
                <Link 
                    to="/pinjam" 
                    className={location.pathname === '/pinjam' ? 'active cta-link' : 'cta-link'}
                >
                    Ajukan Reservasi Baru
                </Link>

                {/* Link ke Riwayat Peminjaman */}
                <Link to="/riwayat" className={location.pathname === '/riwayat' ? 'active' : ''}>
                    Riwayat Peminjaman
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;