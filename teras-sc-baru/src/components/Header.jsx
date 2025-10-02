// file: src/components/Header.jsx

import { useEffect, useState } from 'react'; 
import { Link, useLocation } from 'react-router-dom';
import LogoImage from '../assets/logo.png';
// import './Header.css'; // HAPUS

const Header = ({ isLandingPage }) => {
  const [isScrolled, setIsScrolled] = useState(false); 
  
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

  const NavLinkComponent = isLandingPage ? 'a' : Link;
  const BerandaTo = isLandingPage ? '#beranda' : '/';
  const AboutTo = isLandingPage ? '#about' : '/'; 
  const TutorialTo = isLandingPage ? '#tutorial' : '/'; 
  const TentangKamiTo = isLandingPage ? '#footer' : '/'; 

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  const getLinkProps = (targetTo) => {
    if (isLandingPage) {
      return { href: targetTo, to: targetTo };
    } else {
      return { to: targetTo };
    }
  };

  // Logika Kelas Tailwind untuk Header:
  // Default: fixed, p-4, flex, z-1000, transition-all
  const baseClasses = "w-full px-12 py-4 flex justify-between items-center fixed top-0 left-0 z-10 transition-all duration-300 ease-in-out box-border";
  
  // Kelas dinamis berdasarkan state
  let logoColor = isScrolled ? 'text-[#3D5B81]' : 'text-white';
  let navLinkColor = isScrolled ? 'text-gray-600 hover:text-[#3D5B81]' : 'text-white hover:text-white/70';
  let headerStyle = isScrolled 
    ? 'bg-white shadow-lg shadow-black/10' // header-solid
    : 'bg-transparent shadow-none';      // header-transparent

  // Menggabungkan semua kelas
  const headerClasses = `${baseClasses} ${headerStyle}`;

  return (
    <header className={headerClasses}>
      {/* Logo */}
      <Link to="/" className={`text-xl font-bold flex items-center no-underline ${logoColor}`}>
        <img src={LogoImage} alt="Teras SC Logo" className="h-9 mr-2" />
        Teras SC
      </Link>
      
      {/* Navigasi Links */}
      <nav className="flex space-x-9">
        <NavLinkComponent {...getLinkProps(BerandaTo)} className={`${navLinkColor} text-sm font-medium transition-colors ${isLoginPage ? 'pointer-events-none opacity-50' : ''}`}>Beranda</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(AboutTo)} className={`${navLinkColor} text-sm font-medium transition-colors ${isLoginPage ? 'pointer-events-none opacity-50' : ''}`}>About</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(TutorialTo)} className={`${navLinkColor} text-sm font-medium transition-colors ${isLoginPage ? 'pointer-events-none opacity-50' : ''}`}>Tutorial</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(TentangKamiTo)} className={`${navLinkColor} text-sm font-medium transition-colors ${isLoginPage ? 'pointer-events-none opacity-50' : ''}`}>Tentang Kami</NavLinkComponent>
      </nav>
      
      {/* Tombol Login */}
      <Link 
        to="/login" 
        className="bg-[#3D5B81] text-white px-6 py-2 rounded-md cursor-pointer text-sm font-semibold no-underline transition-colors duration-200 hover:bg-[#2e4764]"
      >
        Login
      </Link>
    </header>
  );
};

export default Header;