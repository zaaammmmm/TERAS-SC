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
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (isLandingPage) {
      setIsScrolled(window.scrollY > 50); 
      window.addEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLandingPage]);

  // Tentukan komponen dan destinasi
  const NavLinkComponent = isLandingPage ? 'a' : Link;
  const BerandaTo = isLandingPage ? '#beranda' : '/';
  const AboutTo = isLandingPage ? '#about' : '/'; 
  const TutorialTo = isLandingPage ? '#tutorial' : '/'; 
  const TentangKamiTo = isLandingPage ? '#footer' : '/';  // 👈 diarahkan ke footer

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  const getLinkProps = (targetTo) => {
    if (isLandingPage) {
      return { href: targetTo, to: targetTo };
    } else {
      return { to: targetTo };
    }
  };

  // ✅ Tambahan: fungsi scroll ke footer
  const scrollToFooter = (e) => {
    if (isLandingPage) {
      e.preventDefault();
      const footerEl = document.getElementById('footer');
      if (footerEl) {
        footerEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
        {/* 👇 Tambah onClick khusus untuk Tentang Kami */}
        <NavLinkComponent 
          {...getLinkProps(TentangKamiTo)} 
          onClick={scrollToFooter}
          className={isLoginPage ? 'nav-disabled' : ''}
        >
          Tentang Kami
        </NavLinkComponent>
      </nav>
      
      {/* Tombol Login */}
      <Link to="/login" className="login-button-header">
        Login
      </Link>
    </header>
  );
};

export default Header;
