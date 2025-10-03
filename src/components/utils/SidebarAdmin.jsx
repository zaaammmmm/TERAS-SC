// file: src/components/SidebarAdmin.jsx (KODE UTUH - KHUSUS ADMIN)

import { FaClipboardList, FaHistory, FaLayerGroup, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SidebarAdmin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleLogout = (e) => {
        e.preventDefault();

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
    const baseLinkClass = "flex items-center gap-3 p-2 rounded-lg text-gray-700 transition-colors duration-200 hover:bg-blue-100 hover:text-[#3D5B81]";
    // Kelas untuk tautan yang sedang aktif (menggunakan warna primer)
    const activeLinkClass = `bg-[${PRIMARY_COLOR}] text-white shadow-md hover:bg-[#2e4764]`; 

    const getLinkClass = (path) => {
        return `${baseLinkClass} ${location.pathname === path ? activeLinkClass : ''}`;
    };

    return (
        <div className="w-[250px] min-w-[250px] h-[calc(100vh-80px)] sticky top-[80px] p-5 bg-white border-r border-gray-200 shadow-lg shadow-black/5 flex flex-col z-10">
            
            <h4 className="px-2 text-xs text-gray-500 tracking-wider font-medium mb-5 uppercase">
              Menu Administrator
            </h4>
            
            <nav className="flex flex-col gap-2 flex-grow">
                
                {/* 1. Dashboard Admin (Link utama Admin) */}
                <Link 
                    to="/admin/dashboard" 
                    className={getLinkClass('/admin/dashboard')}
                >
                    <FaUserShield className="w-5 h-5" />
                    Dashboard Admin
                </Link>
                
                {/* 2. Rooms / Kelola Data Ruangan */}
                <Link
                    to="/admin/rooms"
                    className={getLinkClass('/admin/rooms')}
                >
                    <FaLayerGroup className="w-5 h-5" />
                    Rooms (Kelola Data)
                </Link>

                {/* 3. Kelola Peminjaman */}
                <Link
                    to="/admin/bookings"
                    className={getLinkClass('/admin/bookings')}
                >
                    <FaClipboardList className="w-5 h-5" />
                    Kelola Peminjaman
                </Link>

                {/* 4. Riwayat Peminjaman (Admin View) */}
                <Link
                    to="/admin/riwayat"
                    className={getLinkClass('/admin/riwayat')}
                >
                    <FaHistory className="w-5 h-5" />
                    Riwayat Peminjaman
                </Link>

                {/* 4. Logout */}
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

export default SidebarAdmin;