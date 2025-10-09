import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Memastikan Lucide Icons diimpor dengan benar.
import { History, ListChecks, LogOut, ShieldCheck, X } from 'lucide-react';

const SidebarAdmin = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [logoutMessage, setLogoutMessage] = useState('');
    
    // Warna Primer Aplikasi: #3D5B81
    const PRIMARY_COLOR = '#3D5B81';
    
    const handleLogout = (e) => {
        e.preventDefault();

        // Mengganti alert() dengan state message
        setLogoutMessage('Anda telah berhasil logout.');
        
        // Hapus data autentikasi
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userRole');

        // Tunggu sebentar sebelum redirect agar pesan terlihat
        setTimeout(() => {
            onClose();
            setLogoutMessage('');
            navigate('/', { replace: true });
        }, 1500);
    };
    
    // Kelas dasar Tailwind untuk tautan menu
    const baseLinkClass = "flex items-center gap-3 p-2 rounded-xl text-gray-700 transition-colors duration-200 hover:bg-blue-100 hover:text-blue-700";
    
    // Kelas aktif (Menggunakan string literal untuk memastikan Tailwind JIT bekerja dengan baik)
    const activeLinkClass = 'bg-[#3D5B81] text-white shadow-lg hover:bg-[#2e4764]'; 

    const getLinkClass = (path) => {
        // Karena Link/a tag tidak bisa menggunakan variabel di class yang dinamis (seperti bg-[${PRIMARY_COLOR}]), 
        // kita menggunakan string literal untuk warna primary (#3D5B81) agar Tailwind JIT bekerja.
        return `${baseLinkClass} ${location.pathname === path ? activeLinkClass : ''}`;
    };

    return (
        <>
            {/* Overlay for mobile (Z-index 50 agar menimpa konten) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar Container: Fixed right for mobile overlay, sticky/relative for desktop */}
            <div className={`
                w-11/12 max-w-[280px] h-screen fixed top-0 right-0 p-5 
                bg-white flex flex-col z-50 transition-transform duration-300 shadow-2xl
                ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
                md:w-[280px] md:min-w-[280px] md:h-[calc(100vh-80px)] md:sticky md:top-[80px] md:translate-x-0 md:shadow-lg md:border-l md:border-gray-200
            `}>
                
                {/* Close Button (Mobile Only) */}
                <div className="md:hidden flex justify-end mb-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <h4 className="px-2 text-xs text-gray-500 tracking-wider font-medium mb-5 uppercase">
                    Menu Administrator
                </h4>

                <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">

                    {/* 1. Dashboard Admin (Link utama Admin) */}
                    <Link
                        to="/admin/dashboard"
                        className={getLinkClass('/admin/dashboard')}
                        onClick={onClose}
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Dashboard Admin
                    </Link>

                    {/* 3. Kelola Peminjaman */}
                    <Link
                        to="/admin/bookings"
                        className={getLinkClass('/admin/bookings')}
                        onClick={onClose}
                    >
                        <ListChecks className="w-5 h-5" />
                        Kelola Peminjaman
                    </Link>

                    {/* 4. Riwayat Peminjaman (Admin View) */}
                    <Link
                        to="/admin/riwayat"
                        className={getLinkClass('/admin/riwayat')}
                        onClick={onClose}
                    >
                        <History className="w-5 h-5" />
                        Riwayat Peminjaman
                    </Link>

                    {/* 5. Logout */}
                    <a
                        href="#"
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-2 rounded-xl text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700 mt-auto shadow-md"
                    >
                        <LogOut className="w-5 h-5" />
                        Log out
                    </a>
                </nav>
            </div>
            
{/* ✅ Custom Logout Message (Center Top) */}
{logoutMessage && (
  <div
    className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] 
               bg-green-600 text-white font-medium py-3 px-5 rounded-xl 
               shadow-2xl transition-all duration-300 animate-fadeInDown"
  >
    {logoutMessage}

    {/* Animasi fade-in dari atas */}
    <style>{`
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translate(-50%, -20px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
      .animate-fadeInDown {
        animation: fadeInDown 0.4s ease-out;
      }
    `}</style>
  </div>
)}

        </>
    );
};

export default SidebarAdmin;
