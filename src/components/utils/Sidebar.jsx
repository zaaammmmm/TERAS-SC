// file: src/components/Sidebar.jsx (KODE UTUH - KHUSUS USER)

import { FaHistory, FaRegCalendarAlt, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    const handleLogout = async (e) => {
        e.preventDefault();

        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            <div className={`w-[250px] min-w-[250px] h-[calc(100vh-80px)] sticky top-[80px] p-5 bg-white border-r border-gray-200 shadow-lg shadow-black/5 flex flex-col z-10 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:z-10 fixed left-0 top-[80px] md:top-[80px]`}>

                <h4 className="px-2 text-xs text-gray-500 tracking-wider font-medium mb-5 uppercase">
                  Menu Reservasi
                </h4>

                <nav className="flex flex-col gap-2 flex-grow">

                    {/* 1. DASHBOARD USER */}
                    <Link
                        to="/dashboard"
                        className={getLinkClass('/dashboard')}
                        onClick={onClose}
                    >
                        <FaTachometerAlt className="w-5 h-5" />
                        Dashboard
                    </Link>

                    {/* 2. Cek Ketersediaan/Rooms */}
                    <Link
                        to="/ruangan"
                        className={getLinkClass('/ruangan')}
                        onClick={onClose}
                    >
                        <FaRegCalendarAlt className="w-5 h-5" />
                        Cek Ruangan
                    </Link>

                    {/* 3. Ajukan Reservasi Baru (CTA) */}
                    <Link
                        to="/pinjam"
                        className={getLinkClass('/pinjam')}
                        onClick={onClose}
                    >
                        <FaTachometerAlt className="w-5 h-5" />
                        Ajukan Reservasi
                    </Link>

                    {/* 4. Riwayat Peminjaman */}
                    <Link
                        to="/riwayat"
                        className={getLinkClass('/riwayat')}
                        onClick={onClose}
                    >
                        <FaHistory className="w-5 h-5" />
                        Riwayat
                    </Link>

                    {/* 5. Logout */}
                    <a
                        href="#"
                        onClick={(e) => { handleLogout(e); onClose(); }}
                        className="flex items-center gap-3 p-2 rounded-lg text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700 mt-auto"
                    >
                        <FaSignOutAlt className="w-5 h-5" />
                        Log out
                    </a>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;