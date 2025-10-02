// file: src/App.jsx (REVISI KODE UTUH)

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import React from 'react';

// Import Layout dan Component Utama
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminRouteGuard from './components/AdminRouteGuard'; 
import UserRouteGuard from './components/UserRouteGuard'; // <-- IMPORT BARU

// Import Halaman Aplikasi
import Dashboard from './components/Dashboard'; 
import DashboardAdmin from './components/DashboardAdmin'; 
import DaftarRuangan from './components/DaftarRuangan'; 
import RoomsAdmin from './components/RoomsAdmin'; 
import DetailRooms from './components/DetailRooms';
import RiwayatAdmin from './components/RiwayatAdmin';
import FormPeminjaman from './components/FormPeminjaman';
import RiwayatPeminjaman from './components/RiwayatPeminjaman'; 
import Help from './components/Help'; // <-- IMPORT BARU
import DetailRoomUser from './components/DetailRoomUser';

function App() {
  return (
    <Router>
      <Routes>
        {/* ======================================================== */}
        {/* RUTE PUBLIK (Landing Page & Login)                       */}
        {/* ======================================================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* ======================================================== */}
        {/* RUTE UMUM TERPROTEKSI (Untuk User atau Admin)            */}
        {/* ======================================================== */}
        <Route 
            path="/help" 
            element={<UserRouteGuard><Help /></UserRouteGuard>} 
        />
        
        {/* ======================================================== */}
        {/* RUTE ADMIN (Terproteksi AdminGuard)                      */}
        {/* ======================================================== */}
        <Route 
            path="/admin/dashboard" 
            element={<AdminRouteGuard><DashboardLayout><DashboardAdmin /></DashboardLayout></AdminRouteGuard>} 
        /> 
        
        <Route 
            path="/admin/rooms" 
            element={<AdminRouteGuard><DashboardLayout><RoomsAdmin /></DashboardLayout></AdminRouteGuard>} 
        /> 
        
        <Route 
            path="/admin/rooms/detail/:id" 
            element={<AdminRouteGuard><DashboardLayout><DetailRooms /></DashboardLayout></AdminRouteGuard>} 
        /> 
        
        <Route 
            path="/admin/riwayat" 
            element={<AdminRouteGuard><DashboardLayout><RiwayatAdmin /></DashboardLayout></AdminRouteGuard>} 
        /> 

        {/* ======================================================== */}
        {/* RUTE USER (DashboardLayout sudah menyertakan Sidebar/Header) */}
        {/* ======================================================== */}
        
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/ruangan" element={<DashboardLayout><DaftarRuangan /></DashboardLayout>} />
        <Route path="/pinjam" element={<DashboardLayout><FormPeminjaman /></DashboardLayout>} /> 
        <Route path="/riwayat" element={<DashboardLayout><RiwayatPeminjaman /></DashboardLayout>} /> 
        <Route path="/detail" element={<DashboardLayout><DetailRoomUser /></DashboardLayout>} /> 
        
        <Route path="/admin/rooms/add" element={<AdminRouteGuard><DashboardLayout><div>Halaman Tambah Ruangan Baru</div></DashboardLayout></AdminRouteGuard>} />


        
      </Routes>
    </Router>
  );
}

export default App;