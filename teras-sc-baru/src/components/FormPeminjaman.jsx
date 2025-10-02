// file: src/components/FormPeminjaman.jsx

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import './FormPeminjaman.css'; // HAPUS - Menggunakan kelas Tailwind
import React from 'react';

const roomList = [
    { value: 'Co-Working Space A', label: 'Co-Working Space A (Max 15)' },
    { value: 'Co-Working Space B', label: 'Co-Working Space B (Max 8)' },
    { value: 'Co-Working Space C', label: 'Co-Working Space C (Max 10)' },
    { value: 'Co-Working Space D', label: 'Co-Working Space D (Max 12)' },
    { value: 'Co-Working Space E', label: 'Co-Working Space E (Max 6)' },
    { value: 'Co-Working Space F', label: 'Co-Working Space F (Max 18)' },
    { value: 'Co-Working Space EAST', label: 'Co-Working Space EAST (Max 20)' },
];

const timeSlots = [
  { value: '07:00-09:00', label: '07:00 - 09:00' },
  { value: '09:00-11:00', label: '09:00 - 11:00' },
  { value: '11:00-13:00', label: '11:00 - 13:00' },
  { value: '13:00-15:00', label: '13:00 - 15:00' },
  { value: '15:00-17:00', label: '15:00 - 17:00' },
  { value: '17:00-19:00', label: '17:00 - 19:00' },
  { value: '19:00-21:00', label: '19:00 - 21:00' },
];

const FormPeminjaman = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledData = location.state || {}; 

  const [formData, setFormData] = useState({
    room: prefilledData.room || '',
    date: prefilledData.date || new Date().toISOString().split('T')[0],
    timeSlot: '', 
    purpose: '',
    capacity: 1,
    peminjam: prefilledData.peminjam || '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    setError('');
    return true; 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const [startTime, endTime] = formData.timeSlot.split('-');
    const existingPeminjaman = JSON.parse(localStorage.getItem('peminjaman') || '[]');
    
    const newPeminjaman = {
      id: Date.now(),
      ruangan: formData.room,
      tanggal: formData.date,
      waktuMulai: startTime,
      waktuSelesai: endTime,
      keperluan: formData.purpose,
      jumlahPeserta: formData.capacity,
      peminjam: formData.peminjam,
      status: 'Menunggu',
      tanggalPengajuan: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    localStorage.setItem('peminjaman', JSON.stringify([...existingPeminjaman, newPeminjaman]));
    
    setFormData({
      room: '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '',
      purpose: '',
      capacity: 1,
      peminjam: ''
    });

    alert(`Peminjaman ruangan ${newPeminjaman.ruangan} berhasil diajukan!\nSilakan cek status peminjaman di halaman Riwayat Peminjaman.`);
    navigate('/riwayat');
  };

  return (
    // .peminjaman-page-container -> flex justify-center pt-2.5 bg-gray-100
    <div className="flex justify-center bg-[#F0F8FF] w-full pt-2.5">

      {/* .peminjaman-content-wrapper -> w-11/12 max-w-4xl p-8 mb-12 bg-white rounded-xl shadow-2xl */}
      <div className="w-11/12 max-w-full p-8 my-5 bg-white rounded-xl shadow-2xl shadow-black/10">
        
        {/* .peminjaman-title */}
        <h1 className="text-[#3D5B81] text-3xl font-bold mb-1">Ajukan Peminjaman Ruangan</h1>
        
        {/* .peminjaman-subtitle */}
        <p className="text-gray-600 mb-8 border-b border-gray-200 pb-4 text-base">
          Silakan isi detail kegiatan dan ruangan yang Anda butuhkan. (Maksimal 2 jam, batas akhir 21:00)
        </p>
        
        {/* .form-error-message */}
        {error && <div className="bg-red-100 text-red-800 p-4 border border-red-800 rounded-md mb-5 font-medium">{error}</div>}

        {/* .peminjaman-form -> flex-col gap-5 */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          {/* BAGIAN 1: RUANGAN DAN KAPASITAS */}
          {/* .form-group-row -> flex gap-5 w-full md:flex-row flex-col */}
          <div className="flex gap-5 w-full flex-col md:flex-row">
            
            {/* .form-group -> flex flex-col flex-1 */}
            <div className="flex flex-col flex-1">
              <label htmlFor="room" className="font-semibold text-[#3D5B81] mb-1 text-base">Pilih Ruangan</label>
              <select 
                id="room" 
                name="room" 
                value={formData.room} 
                onChange={handleChange} 
                // .input-field -> p-3 border rounded-lg text-base transition focus:border-blue-500
                className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">-- Pilih Ruangan --</option> 
                {roomList.map((room) => (
                    <option key={room.value} value={room.value}>
                        {room.label}
                    </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label htmlFor="capacity" className="font-semibold text-[#3D5B81] mb-1 text-base">Jumlah Peserta</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                min="1"
                required
              />
            </div>
          </div>

          {/* BAGIAN 2: TANGGAL DAN WAKTU */}
          <div className="flex gap-5 w-full flex-col md:flex-row">
            <div className="flex flex-col flex-1">
              <label htmlFor="date" className="font-semibold text-[#3D5B81] mb-1 text-base">Tanggal Peminjaman</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            
            <div className="flex flex-col flex-1">
              <label htmlFor="timeSlot" className="font-semibold text-[#3D5B81] mb-1 text-base">Waktu Peminjaman</label>
              <select 
                id="timeSlot" 
                name="timeSlot" 
                value={formData.timeSlot} 
                onChange={handleChange} 
                className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
              >
                <option value="">-- Pilih Waktu --</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BAGIAN 3: TUJUAN */}
          <div className="flex flex-col w-full">
            <label htmlFor="purpose" className="font-semibold text-[#3D5B81] mb-1 text-base">Tujuan Kegiatan</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              // .textarea-field
              className="p-3 border border-gray-300 rounded-lg text-base resize-y transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows="4"
              placeholder="Jelaskan tujuan peminjaman"
              required
            ></textarea>
          </div>

          {/* BAGIAN 4: DATA PEMINJAM (NAMA PEMINJAM) */}
          <div className="flex flex-col w-full">
            <label htmlFor="peminjam" className="font-semibold text-[#3D5B81] mb-1 text-base">Nama Pemohon</label>
            <input
              type="text"
              id="peminjam"
              name="peminjam"
              value={formData.peminjam}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan nama Anda"
              required
            />
          </div>
          
          {/* Tombol Submit */}
          <button 
            type="submit" 
            // .submit-btn -> bg-[#3D5B81] p-4 rounded-lg text-xl font-semibold hover:bg-[#2e4764]
            className="bg-[#3D5B81] text-white p-4 rounded-lg text-xl font-semibold mt-3 transition-colors duration-300 hover:bg-[#2e4764] shadow-md"
          >
            Ajukan Peminjaman
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPeminjaman;