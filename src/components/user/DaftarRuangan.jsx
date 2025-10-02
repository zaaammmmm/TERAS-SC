// src/components/Ruangan.js (Kode UTUH dan Direvisi dengan Chart)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DaftarRuangan.css';

// Sumber tunggal (Source of Truth) untuk data ruangan (A sampai F dan EAST)
const ruanganData = [
  // Tambahkan field 'usage' untuk statistik chart
  { id: 1, name: 'Co-Working Space A', usage: 15, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 2, name: 'Co-Working Space B', usage: 22, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 3, name: 'Co-Working Space C', usage: 10, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 4, name: 'Co-Working Space D', usage: 5, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 5, name: 'Co-Working Space E', usage: 30, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 6, name: 'Co-Working Space F', usage: 25, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] }, 
  { id: 7, name: 'Co-Working Space EAST', usage: 40, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] }, // Ini akan menjadi bar terpanjang
];

const DaftarRuangan = () => {
  const [ruangan, setRuangan] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check room availability based on peminjaman data
    const peminjaman = JSON.parse(localStorage.getItem('peminjaman') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    // Example room list - you can modify this
    const daftarRuangan = [
      { id: 1, nama: 'Ruang A', kapasitas: 20 },
      { id: 2, nama: 'Ruang B', kapasitas: 30 },
      { id: 3, nama: 'Ruang C', kapasitas: 40 }
    ];

    // Check availability
    const ruanganWithStatus = daftarRuangan.map(ruang => {
      const isBooked = peminjaman.some(p => 
        p.ruangan === ruang.nama && 
        p.tanggal === today &&
        p.status === 'Approved'
      );

      return {
        ...ruang,
        status: isBooked ? 'Booked' : 'Available'
      };
    });

    setRuangan(ruanganWithStatus);
  }, []);

  // Fungsi untuk menangani klik pada slot waktu
  const handleTimeSlotClick = (roomName, startTime) => {
    navigate('/pinjam', { 
      state: { 
        room: roomName, 
        startTime: startTime, 
        date: new Date().toISOString().split('T')[0] 
      } 
    });
  };
  
  // Fungsi untuk menangani klik pada tombol Pinjam (jika tanpa memilih jam spesifik)
  const handlePinjamClick = (roomName) => {
    navigate('/detailRuangan', { 
      state: { 
        room: roomName,
        date: new Date().toISOString().split('T')[0] 
      } 
    });
  };

  return (
    <div className="content-wrapper">
        
        
        <h2 className="content-title" style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            Cek Ketersediaan Ruangan Hari Ini
        </h2>

        <div className="ruangan-list">
          {ruanganData.map((ruangan) => (
            <div key={ruangan.id} className="ruangan-card">
              <div className="ruangan-image-placeholder"></div>
              <div className="ruangan-details">
                <div className="ruangan-header-detail">
                    <h3>{ruangan.name}</h3>
                    {/* Tombol Pinjam yang mengarah ke Form Peminjaman */}
                    <button 
                        onClick={() => handlePinjamClick(ruangan.name)}
                        className="pinjam-button"
                    >
                        Lihat Selengkapnya
                    </button>
                </div>
                <p className="ruangan-location">{ruangan.location}</p>
                <p className="ruangan-available-time">Waktu Tersedia</p>
                <div className="time-slots">
                  {ruangan.times.map((time, index) => (
                    <span 
                      key={index} 
                      className="time-slot-tag"
                      onClick={() => handleTimeSlotClick(ruangan.name, time)}
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default DaftarRuangan;