// src/components/Header.js (Kode UTUH)

import React, { useState, useEffect } from 'react'; // Import Hooks
import { Link, useLocation } from 'react-router-dom'; 
import LogoImage from '../assets/logo.png'; 
import './Header.css';

const Header = ({ isLandingPage }) => {
  // STATE untuk mengontrol kelas CSS (true = header berwarna solid)
  const [isScrolled, setIsScrolled] = useState(false); 
  
  // ======================================
  // LOGIKA SCROLL TRANSITION
  // ======================================
  useEffect(() => {
    // Fungsi untuk mendeteksi posisi scroll
    const handleScroll = () => {
      // Aktifkan kelas solid jika posisi scroll lebih dari 50px (untuk transisi)
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Logika pengaktifan listener
    if (isLandingPage) {
      // Set awal ke transparan jika di Landing Page
      setIsScrolled(window.scrollY > 50); 
      window.addEventListener('scroll', handleScroll);
    } else {
      // Jika tidak di Landing Page (Login, Ruangan, dll.), header selalu solid
      setIsScrolled(true);
    }

    // Cleanup function: Hapus listener saat komponen di-unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLandingPage]);
  // ======================================

  // Tentukan komponen dan destinasi (Logika smooth scroll tetap sama)
  const NavLinkComponent = isLandingPage ? 'a' : Link;
  const BerandaTo = isLandingPage ? '#beranda' : '/';
  // Jika tidak di LandingPage, semua navigasi internal mengarah ke root '/'
  const AboutTo = isLandingPage ? '#about' : '/'; 
  const TutorialTo = isLandingPage ? '#tutorial' : '/'; 
  const TentangKamiTo = isLandingPage ? '#tutorial' : '/'; 

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  const getLinkProps = (targetTo) => {
    if (isLandingPage) {
      return { href: targetTo, to: targetTo };
    } else {
      return { to: targetTo };
    }
  };

  // Kelas CSS dinamis: tambahkan 'header-solid' jika sudah di-scroll atau bukan di Landing Page
  const headerClasses = `header-bar ${isScrolled ? 'header-solid' : 'header-transparent'}`;

  return (
    <header className={headerClasses}>
      {/* Logo selalu Link ke root */}
      <Link to="/" className="logo">
        <img src={LogoImage} alt="Teras SC Logo" className="logo-image" />
        Teras SC
      </Link>
      
      <nav className="nav-links">
        <NavLinkComponent {...getLinkProps(BerandaTo)} className={isLoginPage ? 'nav-disabled' : ''}>Beranda</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(AboutTo)} className={isLoginPage ? 'nav-disabled' : ''}>About</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(TutorialTo)} className={isLoginPage ? 'nav-disabled' : ''}>Tutorial</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(TentangKamiTo)} className={isLoginPage ? 'nav-disabled' : ''}>Tentang Kami</NavLinkComponent>
      </nav>
      
      {/* Tombol Login */}
      <Link to="/login" className="login-button-header">
        Login
      </Link>
    </header>
  );
};

export default Header;