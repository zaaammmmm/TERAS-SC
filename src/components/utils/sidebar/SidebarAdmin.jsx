// src/components/Sidebar.js

import { Link, useLocation } from 'react-router-dom';
import './SidebarAdmin.css';

const SidebarAdmin = () => {
    const location = useLocation();

    return (
        <div className="sidebar-container">
            <h4 className="sidebar-title">MENU RESERVASI</h4>
            <nav className="sidebar-nav">
                {/* Link Dashboard */}
                <Link 
                    to="/dashboardAdmin" 
                    className={location.pathname === '/dashboardAdmin' ? 'active' : ''}
                >
                    Dashboard
                </Link>

                {/* Link ke Riwayat Peminjaman */}
                <Link to="/riwayatAdmin" className={location.pathname === '/riwayatAdmin' ? 'active' : ''}>
                    Riwayat Peminjaman
                </Link>

                {/* Link kembali ke Landing Page */}
                <Link to="/" className={location.pathname === '/' ? '' : 'logout'}>
                    Logout
                </Link>
            </nav>
        </div>
    );
};

export default SidebarAdmin;