// src/components/LandingPage.js (Kode UTUH)

import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom'; 
import './LandingPage.css';
import HeroBgImage from '../assets/background.png';
import AboutImage from '../assets/About.jpg';

// --- IMPOR Ikon Baru (Pastikan File ada di src/assets) ---
import IconSearch from '../assets/icon-search.png'; 
import IconSelect from '../assets/icon-select.png'; 
import IconForm from '../assets/icon-form.png';   
import IconConfirm from '../assets/icon-confirm.png'; 
// -----------------------------

// === Ikon Sosial Media (pakai react-icons) ===
import { FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      {/* Panggil Header dengan prop isLandingPage=true */}
      <Header isLandingPage={true} />

      {/* Scroll 1: HERO SECTION (ID: BERANDA) */}
      <section 
          className="hero-section" 
          id="beranda" 
          style={{ backgroundImage: `url(${HeroBgImage})` }} 
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Reserve Your Space at Teras SC</h1>
            <p>
              Find the perfect for your study group, club meeting, or event. Our easy-to-use reservation
              system ensures you get the space you need, when you need it.
            </p>
            <Link to="/ruangan" className="hero-cta-link">
               <button className="hero-cta">Mulai Reservasi</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll 2: ABOUT SECTION (ID: ABOUT) */}
      <section className="about-section" id="about">
        <div className="about-content">
          <h2>Apa itu Teras SC ?</h2>
          <p>
            Teras Student Center (SC) adalah platform pemesanan ruangan serbaguna yang nyaman untuk
            kegiatan mahasiswa, dengan didukung akses mudah, cek ketersediaan, disertai cepat. Fasilitas
            akurat, jadwal terpadu. Solusi digital efisien.
          </p>
        </div>
        <div className="about-image-placeholder">
          <img 
            src={AboutImage} 
            alt="UIN Sunan Kalijaga" 
            className="about-image-content"
          />
        </div>
      </section>

      {/* Scroll 3: TUTORIAL/RESERVASI SECTION (ID: TUTORIAL) */}
      <section className="reservasi-section" id="tutorial">
        <h3>Cara Reservasi</h3>
        <p className="reservasi-subtitle">A simple, four-step process to secure your ideal space on campus</p>
        <div className="steps-container">
          
          <div className="step-card">
            <span className="step-icon">
              <img src={IconSearch} alt="Cek Ketersediaan" className="icon-image"/> 
            </span>
            <h4>Cek Ketersediaan</h4>
            <p>Klik tombol "Cek Ketersediaan & Pesan" untuk melihat jadwal</p>
          </div>
          
          <div className="step-card">
            <span className="step-icon">
              <img src={IconSelect} alt="Pilih Ruangan & waktu" className="icon-image"/> 
            </span>
            <h4>Pilih Ruangan & waktu</h4>
            <p>Pilih ruangan, tanggal, dan waktu yang Anda inginkan.</p>
          </div>
          
          <div className="step-card">
            <span className="step-icon">
              <img src={IconForm} alt="Isi Detail & Kirim" className="icon-image"/> 
            </span>
            <h4>Isi Detail & Kirim</h4>
            <p>Klik tombol "Cek Ketersediaan & Pesan" untuk melihat jadwal</p>
          </div>
          
          <div className="step-card">
            <span className="step-icon">
              <img src={IconConfirm} alt="Tunggu Konfirmasi" className="icon-image"/> 
            </span>
            <h4>Tunggu Konfirmasi</h4>
            <p>Anda akan menerima konfirmasi saat pesanan Anda disetujui</p>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION (Tambahkan id="footer") */}
      <footer className="footer-section" id="footer">
        <div className="footer-content">
          <div className="contact-info">
            <h4>Contact Person</h4>
            <p>Email: terassc@gmail.com</p>
            <p>Telp/WA: +62 812 3456 7890</p>
          </div>
          <div className="social-icons">
            <a href="https://www.instagram.com/terassc" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
            </a>
            <a href="https://www.linkedin.com/company/terassc" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
        <p className="footer-bottom">© 2025 Teras SC. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
