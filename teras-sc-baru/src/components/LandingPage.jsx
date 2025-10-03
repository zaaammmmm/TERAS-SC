// file: src/components/LandingPage.jsx

import { Link } from 'react-router-dom';
import AboutImage from '../assets/About.jpg';
import HeroBgImage from '../assets/background.png';
import Header from './Header';
// import './LandingPage.css'; // HAPUS - Menggunakan kelas Tailwind

import IconConfirm from '../assets/icon-confirm.png';
import IconForm from '../assets/icon-form.png';
import IconSearch from '../assets/icon-search.png';
import IconSelect from '../assets/icon-select.png';
import React from 'react';

// === Ikon Sosial Media (pakai react-icons) ===
import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const LandingPage = () => {
  // Warna Primer: #3D5B81

  return (
    <div className="landing-page-container">
      <Header isLandingPage={true} />

      {/* Scroll 1: HERO SECTION (ID: BERANDA) */}
      <section 
          // .hero-section -> relative h-screen flex items-center justify-center text-white text-center bg-cover bg-center
          className="relative h-screen flex items-center justify-center text-white text-center bg-cover bg-center" 
          id="beranda" 
          style={{ backgroundImage: `url(${HeroBgImage})` }} 
      >
        {/* .hero-overlay -> absolute inset-0 bg-black/55 flex items-center justify-center */}
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <div className="max-w-4xl px-4">
            {/* h1 -> text-5xl font-extrabold mb-4 */}
            <h1 className="text-5xl font-extrabold mb-4">Reserve Your Space at Teras SC</h1>
            {/* p -> text-xl max-w-2xl mx-auto mb-8 */}
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Find the perfect for your study group, club meeting, or event. Our easy-to-use reservation
              system ensures you get the space you need, when you need it.
            </p>
            <Link to="/dashboard" className="no-underline">
               {/* .hero-cta -> bg-white text-[#3D5B81] px-10 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 */}
               <button className="bg-white text-[#3D5B81] px-10 py-4 rounded-lg text-xl font-bold cursor-pointer transition-colors duration-200 hover:bg-gray-100 shadow-xl">
                 Mulai Reservasi
               </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll 2: ABOUT SECTION (ID: ABOUT) */}
      <section 
        // .about-section -> bg-white h-screen p-20 flex justify-between items-center
        className="bg-white h-screen p-20 flex justify-between items-center max-lg:flex-col max-lg:h-auto max-lg:py-16 max-lg:px-8" 
        id="about"
      >
        {/* .about-content -> flex-1 max-w-3xl */}
        <div className="flex-1 max-w-3xl max-lg:max-w-full max-lg:mb-8">
          {/* h2 -> text-[#3D5B81] text-3xl font-bold mb-4 */}
          <h2 className="text-[#3D5B81] text-4xl font-bold mb-4 max-lg:text-3xl">Apa itu Teras SC ?</h2>
          {/* p -> line-height-relaxed text-gray-700 */}
          <p className="leading-relaxed text-gray-700 text-lg">
            Teras Student Center (SC) adalah platform pemesanan ruangan serbaguna yang nyaman untuk
            kegiatan mahasiswa, dengan didukung akses mudah, cek ketersediaan, disertai cepat. Fasilitas
            akurat, jadwal terpadu. Solusi digital efisien.
          </p>
        </div>
        {/* .about-image-placeholder -> w-96 h-72 shadow-xl overflow-hidden rounded-xl */}
        <div className="w-96 h-72 shadow-xl overflow-hidden rounded-xl flex-shrink-0">
          <img 
            src={AboutImage} 
            alt="UIN Sunan Kalijaga" 
            // .about-image-content -> w-full h-full object-cover rounded-xl
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Scroll 3: TUTORIAL/RESERVASI SECTION (ID: TUTORIAL) */}
      <section 
        // .reservasi-section -> bg-[#3D5B81] h-screen text-white p-20 flex-col justify-center items-center
        className="bg-[#3D5B81] h-screen text-white p-20 flex flex-col justify-center items-center max-lg:h-auto max-lg:py-16 max-lg:px-8" 
        id="tutorial"
      >
        {/* h3 -> text-4xl font-bold mb-1 */}
        <h3 className="text-4xl font-bold mb-1 text-white">Cara Reservasi</h3>
        {/* .reservasi-subtitle -> italic opacity-90 mb-16 text-lg */}
        <p className="italic opacity-90 mb-16 text-lg">A simple, four-step process to secure your ideal space on campus</p>
        
        {/* .steps-container -> flex justify-around gap-6 max-w-6xl w-full */}
        <div className="flex justify-around gap-6 max-w-6xl w-full max-lg:flex-col">
          
          <div 
            // .step-card -> bg-[#F8F8F8] text-[#333] p-8 rounded-[15px] flex-1 shadow-xl hover:-translate-y-2
            className="bg-[#F8F8F8] text-gray-800 p-8 rounded-2xl flex-1 min-w-[200px] shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-2 max-lg:mb-6"
          >
            {/* .step-icon -> flex justify-center items-center w-20 h-20 rounded-full bg-[#3D5B81] mx-auto mb-5 */}
            <span className="flex justify-center items-center w-20 h-20 rounded-full bg-[#3D5B81] mx-auto mb-5">
              {/* .icon-image -> w-12 h-12 object-contain */}
              <img src={IconSearch} alt="Cek Ketersediaan" className="w-12 h-12 object-contain"/> 
            </span>
            <h4 className="text-xl font-semibold mb-2 text-center">Cek Ketersediaan</h4>
            <p className="text-base text-gray-600 text-center">Klik tombol "Cek Ketersediaan & Pesan" untuk melihat jadwal</p>
          </div>
          
          <div className="bg-[#F8F8F8] text-gray-800 p-8 rounded-2xl flex-1 min-w-[200px] shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-2 max-lg:mb-6">
            <span className="flex justify-center items-center w-20 h-20 rounded-full bg-[#3D5B81] mx-auto mb-5">
              <img src={IconSelect} alt="Pilih Ruangan & waktu" className="w-12 h-12 object-contain"/> 
            </span>
            <h4 className="text-xl font-semibold mb-2 text-center">Pilih Ruangan & waktu</h4>
            <p className="text-base text-gray-600 text-center">Pilih ruangan, tanggal, dan waktu yang Anda inginkan.</p>
          </div>
          
          <div className="bg-[#F8F8F8] text-gray-800 p-8 rounded-2xl flex-1 min-w-[200px] shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-2 max-lg:mb-6">
            <span className="flex justify-center items-center w-20 h-20 rounded-full bg-[#3D5B81] mx-auto mb-5">
              <img src={IconForm} alt="Isi Detail & Kirim" className="w-12 h-12 object-contain"/> 
            </span>
            <h4 className="text-xl font-semibold mb-2 text-center">Isi Detail & Kirim</h4>
            <p className="text-base text-gray-600 text-center">Lengkapi formulir peminjaman dengan detail kegiatan Anda.</p>
          </div>
          
          <div className="bg-[#F8F8F8] text-gray-800 p-8 rounded-2xl flex-1 min-w-[200px] shadow-xl shadow-black/15 transition-transform duration-300 hover:-translate-y-2">
            <span className="flex justify-center items-center w-20 h-20 rounded-full bg-[#3D5B81] mx-auto mb-5">
              <img src={IconConfirm} alt="Tunggu Konfirmasi" className="w-12 h-12 object-contain"/> 
            </span>
            <h4 className="text-xl font-semibold mb-2 text-center">Tunggu Konfirmasi</h4>
            <p className="text-base text-gray-600 text-center">Anda akan menerima konfirmasi saat pesanan Anda disetujui</p>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION (Tambahkan id="footer") */}
      <footer 
        // .footer-section -> bg-[#2b3a55] text-white p-10 text-center
        className="bg-[#2b3a55] text-white p-10 text-center" 
        id="footer"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="contact-info">
            <h4 className="mb-2 text-lg font-bold text-gray-100">Contact Person</h4>
            <p className="m-0 text-base opacity-90">Email: 23106050065@gmail.com</p>
            <p className="m-0 text-base opacity-90">Telp/WA: +62 851 5649 5184</p>
          </div>
          <div className="flex gap-4 text-2xl">
            <a href="https://www.instagram.com/terassc" target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-300 hover:text-[#3D5B81]">
              <FaInstagram />
            </a>
            <a href="https://wa.me/6285156495184" target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-300 hover:text-[#3D5B81]">
              <FaWhatsapp />
            </a>
            <a href="https://www.linkedin.com/company/terassc" target="_blank" rel="noopener noreferrer" className="text-white transition-colors duration-300 hover:text-[#3D5B81]">
              <FaLinkedin />
            </a>
          </div>
        </div>
        <p className="mt-5 text-sm opacity-70">© 2025 Teras SC. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;