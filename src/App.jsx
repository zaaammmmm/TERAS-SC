import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Import Layout dan Component Utama
import './components/admin/DetailRuanganAdmin.css';
import DetailRuanganAdmin from './components/admin/DetailRuanganAdmin.jsx';
import AdminRouteGuard from './components/guard/AdminRouteGuard';
import UserRouteGuard from './components/guard/UserRouteGuard';
import DashboardLayout from './components/utils/DashboardLayout';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BookingProvider } from './contexts/BookingContext.jsx';

// Import Halaman Publik
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';

// Import Halaman Aplikasi
import BookingsAdmin from './components/admin/BookingsAdmin';
import DashboardAdmin from './components/admin/DashboardAdmin';
import DetailRooms from './components/admin/DetailRooms';
import RiwayatAdmin from './components/admin/RiwayatAdmin';
import RoomsAdmin from './components/admin/RoomsAdmin';
import DaftarRuangan from './components/user/DaftarRuangan';
import Dashboard from './components/user/Dashboard';
import DetailRoomUser from './components/user/DetailRoomUser';
import FormPeminjaman from './components/user/FormPeminjaman';
import RiwayatPeminjaman from './components/user/RiwayatPeminjaman';
import HeaderAdmin from './components/utils/HeaderAdmin.jsx';
import Help from './components/utils/Help'; // <-- IMPORT BARU

function App() {
  return (
    <AuthProvider>
      <BookingProvider> 
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
              path="/admin/detail"
              element={<AdminRouteGuard><DashboardLayout><DetailRooms /></DashboardLayout></AdminRouteGuard>}
          />

          <Route
              path="/detailRuanganAdmin"
              element={<AdminRouteGuard><DashboardLayout><DetailRuanganAdmin /></DashboardLayout></AdminRouteGuard>}
          />

          <Route
              path="/admin/bookings"
              element={<AdminRouteGuard><DashboardLayout><BookingsAdmin /></DashboardLayout></AdminRouteGuard>}
          />

          <Route
              path="/admin/riwayat"
              element={<AdminRouteGuard><DashboardLayout><RiwayatAdmin /></DashboardLayout></AdminRouteGuard>}
          />
          
          <Route
              path="/utils/headeradmin"
              element={<AdminRouteGuard><><HeaderAdmin /></></AdminRouteGuard>}
          />

          {/* ======================================================== */}
          {/* RUTE USER (DashboardLayout sudah menyertakan Sidebar/Header) */}
          {/* ======================================================== */}
          
          <Route path="/dashboard" element={<UserRouteGuard><DashboardLayout><Dashboard /></DashboardLayout></UserRouteGuard>} />
          <Route path="/ruangan" element={<UserRouteGuard><DashboardLayout><DaftarRuangan /></DashboardLayout></UserRouteGuard>} />
          <Route path="/pinjam" element={<UserRouteGuard><DashboardLayout><FormPeminjaman /></DashboardLayout></UserRouteGuard>} /> 
          <Route path="/riwayat" element={<UserRouteGuard><DashboardLayout><RiwayatPeminjaman /></DashboardLayout></UserRouteGuard>} /> 
          <Route path="/detail" element={<UserRouteGuard><DashboardLayout><DetailRoomUser /></DashboardLayout></UserRouteGuard>} /> 
          
          <Route path="/admin/rooms/add" element={<AdminRouteGuard><DashboardLayout><div>Halaman Tambah Ruangan Baru</div></DashboardLayout></AdminRouteGuard>} />
        </Routes>
      </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
