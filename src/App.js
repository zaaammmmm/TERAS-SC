// src/App.js (Kode UTUH)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Layout dan Halaman Utama
import DashboardLayout from './components/DashboardLayout'; 
import LandingPage from './components/LandingPage'; 
import Login from './components/Login'; 

// Import Halaman Aplikasi (Dashboard)
import DaftarRuangan from './components/DaftarRuangan'; 
import FormPeminjaman from './components/FormPeminjaman'; 
import RiwayatPeminjaman from './components/RiwayatPeminjaman'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* ======================================================== */}
        {/* RUTE PUBLIK (TIDAK menggunakan DashboardLayout)           */}
        {/* ======================================================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* ======================================================== */}
        {/* RUTE APLIKASI (MENGGUNAKAN DashboardLayout + Sidebar)    */}
        {/* ======================================================== */}
        
        {/* Halaman Daftar Ruangan (Rooms) */}
        <Route path="/ruangan" element={<DashboardLayout><DaftarRuangan /></DashboardLayout>} />
        
        {/* Halaman Form Peminjaman (Reservations) */}
        <Route path="/pinjam" element={<DashboardLayout><FormPeminjaman /></DashboardLayout>} /> 
        
        {/* Halaman Riwayat Peminjaman (History) */}
        <Route path="/riwayat" element={<DashboardLayout><RiwayatPeminjaman /></DashboardLayout>} /> 
        
        {/* Rute Eksternal/Lainnya */}
        <Route path="/forgot-password" element={<div>Halaman Lupa Password</div>} />
        <Route path="/about" element={<div>Halaman About Eksternal</div>} />
        <Route path="/tutorial" element={<div>Halaman Tutorial Eksternal</div>} />
        <Route path="/tentangkami" element={<div>Halaman Tentang Kami Eksternal</div>} />
        <Route path="/reservations" element={<div>Halaman Reservations (redirect ke Riwayat)</div>} />
        <Route path="/help" element={<div>Halaman Bantuan</div>} />
      </Routes>
    </Router>
  );
}

export default App;