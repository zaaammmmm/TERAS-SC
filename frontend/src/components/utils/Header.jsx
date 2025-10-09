// file: src/components/Header.jsx

import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import LogoImage from '../../assets/logo.png';

const Header = ({ isLandingPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const isLoginPage = location.pathname === '/auth/login';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

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

  const getLinkProps = (targetTo) => (isLandingPage ? { href: targetTo } : { to: targetTo });

  const baseClasses = "w-full px-6 md:px-12 py-4 flex justify-between items-center fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out";
  const logoColor = isScrolled ? 'text-[#3D5B81]' : 'text-white';
  const navLinkColor = isScrolled ? 'text-gray-700 hover:text-[#3D5B81]' : 'text-white hover:text-white/80';
  const headerStyle = isScrolled ? 'bg-white shadow-md' : 'bg-transparent';
  const headerClasses = `${baseClasses} ${headerStyle}`;

  return (
    <header className={headerClasses}>
      {/* Logo */}
      <Link to="/" className={`flex items-center font-bold text-xl no-underline ${logoColor}`}>
        <img src={LogoImage} alt="Teras SC Logo" className="h-9 mr-2" />
        Teras SC
      </Link>

      {/* Tombol Hamburger (Mobile) */}
      <button
        className="md:hidden text-2xl focus:outline-none text-[#3D5B81]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigasi Utama (Desktop) */}
      <nav className="hidden md:flex space-x-8 items-center">
        <NavLinkComponent {...getLinkProps(BerandaTo)} className={`${navLinkColor} text-sm font-medium transition-colors ${isLoginPage ? 'pointer-events-none opacity-50' : ''}`}>Beranda</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(AboutTo)} className={`${navLinkColor} text-sm font-medium transition-colors ${isLoginPage ? 'pointer-events-none opacity-50' : ''}`}>About</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(TutorialTo)} className={`${navLinkColor} text-sm font-medium transition-colors ${isLoginPage ? 'pointer-events-none opacity-50' : ''}`}>Tutorial</NavLinkComponent>
        <NavLinkComponent {...getLinkProps(TentangKamiTo)} className={`${navLinkColor} text-sm font-medium transition-colors ${isLoginPage ? 'pointer-events-none opacity-50' : ''}`}>Tentang Kami</NavLinkComponent>
      </nav>

      {/* Tombol Login (Desktop) */}
      <Link
        to="/login"
        className="hidden md:inline-block bg-[#3D5B81] text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors hover:bg-[#2e4764] no-underline"
      >
        Login
      </Link>

      {/* Drawer Menu (Mobile) */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-white shadow-lg md:hidden rounded-b-lg transition-all">
          <nav className="flex flex-col space-y-4 py-5 px-6 text-center">
            <NavLinkComponent {...getLinkProps(BerandaTo)} onClick={() => setMenuOpen(false)} className="text-[#3D5B81] font-semibold text-base">Beranda</NavLinkComponent>
            <NavLinkComponent {...getLinkProps(AboutTo)} onClick={() => setMenuOpen(false)} className="text-[#3D5B81] font-semibold text-base">About</NavLinkComponent>
            <NavLinkComponent {...getLinkProps(TutorialTo)} onClick={() => setMenuOpen(false)} className="text-[#3D5B81] font-semibold text-base">Tutorial</NavLinkComponent>
            <NavLinkComponent {...getLinkProps(TentangKamiTo)} onClick={() => setMenuOpen(false)} className="text-[#3D5B81] font-semibold text-base">Tentang Kami</NavLinkComponent>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-[#3D5B81] text-white py-2 rounded-md font-semibold text-base no-underline hover:bg-[#2e4764] transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
