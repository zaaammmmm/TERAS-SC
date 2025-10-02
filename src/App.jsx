// src/App.js (Kode UTUH)

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Import Layout dan Halaman Utama
import LandingPage from './components/Home';
import Login from './components/auth/Login';
import DashboardLayout from './components/utils/Dashboard Layout/DashboardLayout';
import DashboardLayoutAdmin from './components/utils/Dashboard Layout/DashboardLayoutAdmin';

// Import Halaman Aplikasi (Dashboard)
import DaftarRuanganAdmin from './components/admin/DaftarRuanganAdmin';
import DashboardAdmin from './components/admin/DashboardAdmin';
import DetailRuanganAdmin from './components/admin/DetailRuanganAdmin';
import RiwayatPeminjamanAdmin from './components/admin/RiwayatPeminjamanAdmin';
import DaftarRuangan from './components/user/DaftarRuangan';
import Dashboard from './components/user/Dashboard';
import DetailRuangan from './components/user/DetailRuangan';
import FormPeminjaman from './components/user/FormPeminjaman';
import RiwayatPeminjaman from './components/user/RiwayatPeminjaman';


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
        
        {/* Halaman Routing User */}
        {/* Halaman Dashboard Utama */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        
        {/* Halaman Daftar Ruangan (Rooms) */}
        <Route path="/ruangan" element={<DashboardLayout><DaftarRuangan /></DashboardLayout>} />
        
        {/* Halaman Form Peminjaman (Reservations) */}
        <Route path="/pinjam" element={<DashboardLayout><FormPeminjaman /></DashboardLayout>} /> 
        
        {/* Halaman Riwayat Peminjaman (History) */}
        <Route path="/riwayat" element={<DashboardLayout><RiwayatPeminjaman /></DashboardLayout>} /> 

        {/* Halaman Detail Ruangan (Room Details) */}
        <Route path="/detailRuangan" element={<DetailRuangan />} />

        {/* ======================================================== */}
        {/* Halaman Routing Admin */}
        {/* Halaman Dashboard Utama Admin */}
        <Route path="/dashboardAdmin" element={<DashboardLayoutAdmin><DashboardAdmin /></DashboardLayoutAdmin>} />

        {/* Halaman Ruangan Admin */}
        <Route path="/ruanganAdmin" element={<DashboardLayoutAdmin><DaftarRuanganAdmin /></DashboardLayoutAdmin>} />

        {/* Halaman Riwayat Admin */}
        <Route path="/riwayatAdmin" element={<DashboardLayoutAdmin><RiwayatPeminjamanAdmin /></DashboardLayoutAdmin>} />

        {/* Halaman Detail Ruangan Admin */}
        <Route path="/detailRuanganAdmin" element={<DetailRuanganAdmin />} />

        {/* ======================================================== */}
        
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