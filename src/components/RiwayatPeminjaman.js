// src/components/RiwayatPeminjaman.js (Kode UTUH)

import React from 'react';
// Kita mengimpor CSS DaftarRuangan agar styling wrapper/judul sama
import './DaftarRuangan.css'; 

const RiwayatPeminjaman = () => {
  
  // Data dummy untuk riwayat (contoh status)
  const riwayatData = [
    { id: 1, ruangan: 'Co-Working Space C', tanggal: '2025-10-05', jam: '11:00 - 13:00', status: 'DITERIMA' },
    { id: 2, ruangan: 'Co-Working Space A', tanggal: '2025-10-04', jam: '19:00 - 21:00', status: 'MENUNGGU VERIFIKASI' },
    { id: 3, ruangan: 'Co-Working Space F', tanggal: '2025-10-01', jam: '09:00 - 11:00', status: 'DITOLAK' },
  ];
  
  // Fungsi untuk mendapatkan kelas styling berdasarkan status
  const getStatusClass = (status) => {
      switch (status) {
          case 'DITERIMA':
              return 'status-diterima';
          case 'DITOLAK':
              return 'status-ditolak';
          default:
              return 'status-menunggu';
      }
  };

  return (
    // Gunakan class wrapper yang sudah di-style oleh DashboardLayout dan DaftarRuangan.css
    <div className="content-wrapper">
        <h2 className="content-title">Riwayat Peminjaman Ruangan</h2>
        <p className="peminjaman-subtitle" style={{marginBottom: '30px', color: '#777'}}>
          Lihat semua status permohonan peminjaman ruangan Anda di sini.
        </p>
        
        {riwayatData.length === 0 ? (
            <div className="riwayat-placeholder">
                <p>Belum ada riwayat peminjaman.</p>
            </div>
        ) : (
            <div className="riwayat-list">
                {riwayatData.map((item) => (
                    <div key={item.id} className="riwayat-card">
                        <div className="riwayat-info">
                            <h4>{item.ruangan} ({item.jam})</h4>
                            <p>Tanggal: {item.tanggal}</p>
                        </div>
                        <span className={`riwayat-status ${getStatusClass(item.status)}`}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        )}
        
    </div>
  );
};

export default RiwayatPeminjaman;