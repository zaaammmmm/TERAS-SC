// file: src/components/HeaderAdmin.jsx (KODE UTUH & REVISI)

import { Link } from 'react-router-dom';
// Mengganti ikon FaHeadset dengan FaQuestionCircle (ikon bantuan)
import { FaBars } from 'react-icons/fa';
import Logo from '../../assets/logo.png'; // Pastikan path ini sesuai

const HeaderAdmin = ({ sidebarOpen, onToggleSidebar }) => {
  const PRIMARY_COLOR = '#3D5B81';

  const baseClasses = "w-full px-4 sm:px-12 py-4 flex justify-between items-center fixed top-0 left-0 z-10 transition-all duration-300 ease-in-out box-border";

  return (
    // Header selalu solid
    <header className={`${baseClasses} bg-white shadow-lg shadow-black/10`}>

      {/* Kiri: Logo */}
      <div className="flex items-center">
        <Link to="/" className={`text-xl font-bold flex items-center no-underline text-[${PRIMARY_COLOR}]`}>
          <img src={Logo} alt="Teras SC Logo" className="h-9 mr-2" />
          Teras SC
        </Link>
      </div>

      {/* Tengah: Kosong */}
      <nav className="flex-grow"></nav>

      {/* Kanan: Hamburger */}
      <div className="flex items-center space-x-6">
        <button
          onClick={onToggleSidebar}
          className="text-gray-700 hover:text-[#3D5B81] md:hidden"
        >
          <FaBars className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;