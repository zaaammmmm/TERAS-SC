import { Calendar, History, LayoutDashboard, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SidebarUser = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState('');

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const handleLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userRole');

    // Notifikasi berhasil logout
    setLogoutMessage('Anda telah berhasil logout.');

    // Hilangkan pesan otomatis setelah 3 detik
    setTimeout(() => setLogoutMessage(''), 3000);

    // Redirect ke halaman login setelah 1.5 detik
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);
  };

  const baseLinkClass =
    'flex items-center gap-3 p-2 rounded-xl text-gray-700 transition-colors duration-200 hover:bg-blue-100 hover:text-blue-700';
  const activeLinkClass = 'bg-[#3D5B81] text-white shadow-lg hover:bg-[#2e4764]';

  const getLinkClass = (path) => {
    return `${baseLinkClass} ${location.pathname === path ? activeLinkClass : ''}`;
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`
          w-11/12 max-w-[280px] h-screen fixed top-0 right-0 p-5 
          bg-white flex flex-col z-50 transition-transform duration-300 shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          md:w-[280px] md:min-w-[280px] md:h-[calc(100vh-80px)] md:sticky md:top-[80px] 
          md:translate-x-0 md:shadow-lg md:border-l md:border-gray-200
        `}
      >
        {/* Tombol close (mobile only) */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Header */}
        <h4 className="px-2 text-xs text-gray-500 tracking-wider font-medium mb-5 uppercase">
          Menu Reservasi
        </h4>

        {/* Navigasi */}
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
          <Link to="/dashboard" className={getLinkClass('/dashboard')} onClick={onClose}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link to="/ruangan" className={getLinkClass('/ruangan')} onClick={onClose}>
            <Calendar className="w-5 h-5" />
            Cek Ruangan
          </Link>

          <Link to="/pinjam" className={getLinkClass('/pinjam')} onClick={onClose}>
            <Calendar className="w-5 h-5" />
            Ajukan Reservasi
          </Link>

          <Link to="/riwayat" className={getLinkClass('/riwayat')} onClick={onClose}>
            <History className="w-5 h-5" />
            Riwayat
          </Link>

          {/* Logout */}
          <a
            href="/"
            onClick={(e) => {
              handleLogout(e);
              onClose();
            }}
            className="flex items-center gap-3 p-2 rounded-xl text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700 mt-auto shadow-md"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </a>
        </nav>
      </div>

      {/* Custom Logout Message (posisi tengah atas) */}
      {logoutMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] px-5 py-3 bg-green-600 text-white rounded-xl shadow-xl transition-all duration-300 animate-fadeInDown">
          {logoutMessage}
        </div>
      )}
    </>
  );
};

export default SidebarUser;
