import { Link } from 'react-router-dom';
import LogoImage from '../../../assets/logo.png'; // Pastikan path ini benar
import './HeaderMain.css'; // Gunakan CSS yang sama untuk styling dasar

const HeaderMain = () => {
  return (
    // Header selalu solid dan statis (gunakan kelas header-solid dari Header.css)
    <header className="header-bar header-solid">
      
      {/* Kiri: Logo selalu Link ke root atau dashboard */}
      <Link to="/" className="logo">
        <img src={LogoImage} alt="Teras SC Logo" className="logo-image" />
        Teras SC
      </Link>
      
      {/* Tengah: Kosong, agar Profile berada di ujung kanan */}
      <nav className="nav-links">
        {/* Navigasi dikosongkan */}
      </nav>
      
      {/* Kanan: Ikon Profil Default */}
      <Link to="/profile" className="profile-icon-header">
        {/* Placeholder untuk Ikon Profil (Ganti dengan <img> jika ada file ikon) */}
        <span role="img" aria-label="profile" style={{ fontSize: '24px' }}>
          👤
        </span>
        {/* Jika menggunakan gambar: <img src={ProfileIcon} alt="Profil" className="profile-image" /> */}
      </Link>
    </header>
  );
};

export default HeaderMain;