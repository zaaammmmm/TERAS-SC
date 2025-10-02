// file: src/components/DaftarRuangan.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './DaftarRuangan.css'; // HAPUS - Menggunakan kelas Tailwind
import React from 'react';

const ruanganData = [
  { id: 1, name: 'Co-Working Space A', usage: 15, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 2, name: 'Co-Working Space B', usage: 22, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 3, name: 'Co-Working Space C', usage: 10, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 4, name: 'Co-Working Space D', usage: 5, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 5, name: 'Co-Working Space E', usage: 30, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 6, name: 'Co-Working Space F', usage: 25, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] }, 
  { id: 7, name: 'Co-Working Space EAST', usage: 40, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
];

const DaftarRuangan = () => {
  const [ruangan, setRuangan] = useState([]);
  const navigate = useNavigate();
  
  // (Logika useEffect untuk mendapatkan data ruangan tidak diubah)
  useEffect(() => {
    const peminjaman = JSON.parse(localStorage.getItem('peminjaman') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    const daftarRuangan = [
      { id: 1, nama: 'Co-Working Space A', kapasitas: 20 },
      { id: 2, nama: 'Co-Working Space B', kapasitas: 30 },
      { id: 3, nama: 'Co-Working Space C', kapasitas: 40 }
    ];

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

    // Mengganti ruanganData statis dengan data yang sudah diolah
    setRuangan(ruanganData.map(r => ({ 
        ...r, 
        // Anda perlu menggabungkan data ini dengan status ketersediaan di atas jika ingin menampilkan status
    }))); 
  }, []);

  const handleTimeSlotClick = (roomName, startTime) => {
    navigate('/pinjam', { 
      state: { 
        room: roomName, 
        startTime: startTime, 
        date: new Date().toISOString().split('T')[0] 
      } 
    });
  };
  
  const handlePinjamClick = (roomName) => {
    navigate('/detail', { 
      state: { 
        room: roomName,
        date: new Date().toISOString().split('T')[0] 
      } 
    });
  };

  return (
    // .content-wrapper -> max-w-6xl w-11/12 mx-auto p-8 mb-12 bg-white rounded-xl shadow-2xl
    <div className="w-full max-w-6xl mx-auto p-8 mb-12 bg-white rounded-xl shadow-2xl shadow-black/10">
        
        {/* .content-title */}
        <h2 
            className="text-[#3D5B81] text-3xl font-bold mb-6 text-left border-b border-gray-200 pb-4"
        >
            Cek Ketersediaan Ruangan Hari Ini
        </h2>

        {/* .ruangan-list -> flex-col gap-4 */}
        <div className="flex flex-col gap-4 pt-5">
          {ruanganData.map((ruangan) => (
            // .ruangan-card -> flex bg-gray-50 border p-4 gap-5 hover:shadow-lg
            <div key={ruangan.id} className="flex bg-gray-50 border border-gray-200 rounded-lg p-5 gap-5 transition-all duration-200 hover:shadow-lg">
              
              {/* .ruangan-image-placeholder -> min-w-32 h-32 bg-blue-100 rounded-lg */}
              <div className="min-w-32 h-32 bg-blue-100 rounded-lg flex-shrink-0">
                {/* Placeholder Gambar */}
              </div>
              
              {/* .ruangan-details -> flex-grow */}
              <div className="flex-grow">
                
                {/* .ruangan-header-detail -> flex justify-between items-center mb-1 */}
                <div className="flex justify-between items-center mb-1">
                    {/* H3 -> text-xl font-bold text-[#3D5B81] */}
                    <h3 className="text-xl font-bold text-[#3D5B81] m-0">{ruangan.name}</h3>
                    
                    {/* Tombol Pinjam */}
                    <button 
                        onClick={() => handlePinjamClick(ruangan.name)}
                        className="bg-[#3D5B81] text-white px-4 py-2 rounded-md cursor-pointer text-sm font-semibold transition-colors duration-200 hover:bg-[#2e4764]"
                    >
                        Detail
                    </button>
                </div>
                
                {/* .ruangan-location */}
                <p className="text-sm text-gray-600 mb-3">{ruangan.location}</p>
                
                {/* .ruangan-available-time */}
                <p className="text-base font-semibold text-gray-800 mb-3">Waktu Tersedia</p>
                
                {/* .time-slots -> flex flex-wrap gap-2 */}
                <div className="flex flex-wrap gap-2">
                  {ruangan.times.map((time, index) => (
                    // .time-slot-tag -> bg-blue-100 border text-[#3D5B81] p-2 rounded-md text-sm hover:bg-[#3D5B81] hover:text-white
                    <span 
                      key={index} 
                      className="bg-blue-100 border border-blue-200 text-[#3D5B81] px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-[#3D5B81] hover:text-white"
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