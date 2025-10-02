// file: src/components/RiwayatPeminjaman.jsx

import { useEffect, useState } from 'react';
// import './RiwayatPeminjaman.css'; // HAPUS - Menggunakan kelas Tailwind & @layer components
import React from 'react';

const RiwayatPeminjaman = () => {
  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([]);

  useEffect(() => {
    const loadPeminjaman = () => {
      const data = JSON.parse(localStorage.getItem('peminjaman') || '[]');
      const sortedData = data.sort((a, b) => b.id - a.id);
      setRiwayatPeminjaman(sortedData);
    };

    loadPeminjaman();
    window.addEventListener('storage', loadPeminjaman);

    return () => {
      window.removeEventListener('storage', loadPeminjaman);
    };
  }, []);

  return (
    // .riwayat-peminjaman -> p-6 bg-white rounded-xl shadow-lg
    <div className="p-6 bg-white rounded-xl shadow-lg shadow-black/5 w-full overflow-x-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Riwayat Peminjaman</h2>
      
      {/* Tabel dengan kelas Tailwind untuk responsifitas */}
      <table className="min-w-full border-collapse mt-4 bg-white text-gray-700">
        <thead>
          <tr>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Tanggal Pengajuan</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Ruangan</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Tanggal</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Waktu</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Keperluan</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Peserta</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Peminjam</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {riwayatPeminjaman.map((peminjaman) => (
            <tr key={peminjaman.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-3 text-sm">{peminjaman.tanggalPengajuan}</td>
              <td className="p-3 text-sm font-medium text-[#3D5B81]">{peminjaman.ruangan}</td>
              <td className="p-3 text-sm">{peminjaman.tanggal}</td>
              <td className="p-3 text-sm">{`${peminjaman.waktuMulai} - ${peminjaman.waktuSelesai}`}</td>
              <td className="p-3 text-sm">{peminjaman.keperluan}</td>
              <td className="p-3 text-sm">{peminjaman.jumlahPeserta}</td>
              <td className="p-3 text-sm">{peminjaman.peminjam}</td>
              
              {/* Menggunakan kelas @layer components dari index.css */}
              <td className="p-3">
                <span className={`status-badge status-${peminjaman.status.toLowerCase()}`}>
                  {peminjaman.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Placeholder jika tabel kosong */}
      {riwayatPeminjaman.length === 0 && (
          <div className="p-10 mt-5 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-600 font-medium">
              Belum ada riwayat peminjaman yang tercatat.
          </div>
      )}
    </div>
  );
};

export default RiwayatPeminjaman;