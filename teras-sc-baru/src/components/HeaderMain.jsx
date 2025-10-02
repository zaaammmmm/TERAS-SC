// file: src/components/HeaderMain.jsx (KODE UTUH & REVISI)

import React from 'react';
import { Link } from 'react-router-dom';
// Mengganti ikon FaHeadset dengan FaQuestionCircle (ikon bantuan)
import { FaQuestionCircle } from 'react-icons/fa'; 
import Logo from '../assets/logo.png'; // Pastikan path ini sesuai

const HeaderMain = () => {
  const PRIMARY_COLOR = '#3D5B81';
  
  const baseClasses = "w-full px-12 py-4 flex justify-between items-center fixed top-0 left-0 z-10 transition-all duration-300 ease-in-out box-border";
  
  return (
    // Header selalu solid
    <header className={`${baseClasses} bg-white shadow-lg shadow-black/10`}>
      
      {/* Kiri: Logo */}
      <Link to="/" className={`text-xl font-bold flex items-center no-underline text-[${PRIMARY_COLOR}]`}>
        <img src={Logo} alt="Teras SC Logo" className="h-9 mr-2" />
        Teras SC
      </Link>
      
      {/* Tengah: Kosong */}
      <nav className="flex-grow"></nav>
      
      {/* Kanan: Hanya Contact Person / Helpdesk */}
      <div className="flex items-center space-x-6">
        
        {/* Tombol Contact Person / Helpdesk (MENGGANTIKAN PROFILE) */}
        <Link 
            to="/help" 
            className={`text-sm font-semibold text-gray-700 hover:text-[${PRIMARY_COLOR}] transition-colors flex items-center gap-2`}
            title="Hubungi Contact Person"
        >
            {/* Menggunakan ikon Question Circle sebagai ikon Help */}
            <FaQuestionCircle className="w-6 h-6" /> 
            Contact Person
        </Link>

        {/* Tautan Profile (Sebelumnya ada di sini) telah dihapus */}
        
      </div>
    </header>
  );
};

export default HeaderMain;