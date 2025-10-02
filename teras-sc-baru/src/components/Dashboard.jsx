// file: src/components/Dashboard.jsx

import React from 'react';
import RoomUsageChart from './RoomUsageChart';
// Catatan: import './Dashboard.css'; telah dihapus dan diganti dengan kelas Tailwind

// Data Dummy Ruangan (sebagai Sumber Tunggal untuk Chart)
const ruanganData = [
  { id: 1, name: 'Co-Working Space A', usage: 15, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 2, name: 'Co-Working Space B', usage: 22, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 3, name: 'Co-Working Space C', usage: 10, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 4, name: 'Co-Working Space D', usage: 5, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 5, name: 'Co-Working Space E', usage: 30, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 6, name: 'Co-Working Space F', usage: 25, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] }, 
  { id: 7, name: 'Co-Working Space EAST', usage: 40, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] }, 
];


const Dashboard = () => {
    return (
        <div className="w-full space-y-6">
            
            {/* Judul Halaman */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Dashboard Pengguna
            </h1>

            {/* Konten Greeting Sederhana (Menggantikan Stats Card/Ikhtisar) */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-700 mb-2">
                    Selamat Datang di Teras SC
                </h2>
                <p className="text-gray-600">
                    Anda berhasil login sebagai pengguna. Silakan Ajukan Reservasi Baru atau lihat Riwayat Peminjaman Anda melalui menu di samping.
                </p>
            </div>
            
            {/* ================================================= */}
            {/* CHART DASHBOARD (Memanggil Komponen Chart) */}
            {/* ================================================= */}
            <RoomUsageChart data={ruanganData} />
        </div>
    );
};

export default Dashboard;