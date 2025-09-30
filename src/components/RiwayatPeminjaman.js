// src/components/RiwayatPeminjaman.js (Kode UTUH)

import { useEffect, useState } from 'react';
import './RiwayatPeminjaman.css';

const RiwayatPeminjaman = () => {
  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([]);

  useEffect(() => {
    const loadPeminjaman = () => {
      const data = JSON.parse(localStorage.getItem('peminjaman') || '[]');
      // Sort by latest first
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
    <div className="riwayat-peminjaman">
      <h2>Riwayat Peminjaman</h2>
      <table>
        <thead>
          <tr>
            <th>Tanggal Pengajuan</th>
            <th>Ruangan</th>
            <th>Tanggal</th>
            <th>Waktu</th>
            <th>Keperluan</th>
            <th>Jumlah Peserta</th>
            <th>Peminjam</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {riwayatPeminjaman.map((peminjaman) => (
            <tr key={peminjaman.id}>
              <td>{peminjaman.tanggalPengajuan}</td>
              <td>{peminjaman.ruangan}</td>
              <td>{peminjaman.tanggal}</td>
              <td>{`${peminjaman.waktuMulai} - ${peminjaman.waktuSelesai}`}</td>
              <td>{peminjaman.keperluan}</td>
              <td>{peminjaman.jumlahPeserta}</td>
              <td>{peminjaman.peminjam}</td>
              <td className={`status-${peminjaman.status.toLowerCase()}`}>
                {peminjaman.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiwayatPeminjaman;