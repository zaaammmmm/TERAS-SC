// file: src/components/Sidebar.jsx (KODE UTUH - KHUSUS USER)

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTachometerAlt, FaRegCalendarAlt, FaHistory } from 'react-icons/fa';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userRole');
        alert('Anda telah berhasil logout.');
        navigate('/', { replace: true });
    };

    // Warna Primer Aplikasi: #3D5B81
    const PRIMARY_COLOR = '#3D5B81';
    
    // Kelas dasar Tailwind untuk tautan menu
    const baseLinkClass = "flex items-center gap-3 p-2 rounded-lg text-gray-700 transition-colors duration-200 hover:bg-indigo-100 hover:text-[#3D5B81]";
    // Kelas untuk tautan yang sedang aktif
    const activeLinkClass = `bg-[${PRIMARY_COLOR}] text-white shadow-md hover:bg-[#2e4764]`; // Darker hover

    const getLinkClass = (path) => {
        return `${baseLinkClass} ${location.pathname === path ? activeLinkClass : ''}`;
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="w-[250px] min-w-[250px] h-[calc(100vh-80px)] sticky top-[80px] p-5 bg-white border-r border-gray-200 shadow-lg shadow-black/5 flex flex-col z-10">
            
            <h4 className="px-2 text-xs text-gray-500 tracking-wider font-medium mb-5 uppercase">
              Menu Reservasi
            </h4>
            
            <nav className="flex flex-col gap-2 flex-grow">
                
                {/* 1. DASHBOARD USER */}
                <Link 
                    to="/dashboard" 
                    className={getLinkClass('/dashboard')}
                >
                    <FaTachometerAlt className="w-5 h-5" />
                    Dashboard User
                </Link>
                
                {/* 2. Cek Ketersediaan/Rooms */}
                <Link 
                    to="/ruangan" 
                    className={getLinkClass('/ruangan')}
                >
                    <FaRegCalendarAlt className="w-5 h-5" />
                    Cek Ketersediaan Ruangan
                </Link>
                
                {/* 3. Ajukan Reservasi Baru (CTA) */}
                <Link 
                    to="/pinjam" 
                    className={getLinkClass('/pinjam')}
                >
                    <FaTachometerAlt className="w-5 h-5" />
                    Ajukan Reservasi Baru
                </Link>

                {/* 4. Riwayat Peminjaman */}
                <Link 
                    to="/riwayat" 
                    className={getLinkClass('/riwayat')}
                >
                    <FaHistory className="w-5 h-5" />
                    Riwayat Peminjaman
                </Link>
                
                {/* 5. Logout */}
                <a 
                    href="#" 
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-2 rounded-lg text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700 mt-auto"
                >
                    <FaSignOutAlt className="w-5 h-5" />
                    Log out
                </a>
            </nav>
        </div>
    );
};

export default Sidebar;