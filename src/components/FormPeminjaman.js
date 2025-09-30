// src/components/FormPeminjaman.js (Kode UTUH dan Direvisi)

import React, { useState } from 'react';
import Header from './Header';
import { useNavigate, useLocation } from 'react-router-dom';
import './FormPeminjaman.css';

// Sumber Data Ruangan yang harus SAMA dengan DaftarRuangan.js (A sampai F dan EAST)
const roomList = [
    { value: 'Co-Working Space A', label: 'Co-Working Space A (Max 15)' },
    { value: 'Co-Working Space B', label: 'Co-Working Space B (Max 8)' },
    { value: 'Co-Working Space C', label: 'Co-Working Space C (Max 10)' },
    { value: 'Co-Working Space D', label: 'Co-Working Space D (Max 12)' },
    { value: 'Co-Working Space E', label: 'Co-Working Space E (Max 6)' },
    { value: 'Co-Working Space F', label: 'Co-Working Space F (Max 18)' }, // DITAMBAHKAN
    { value: 'Co-Working Space EAST', label: 'Co-Working Space EAST (Max 20)' }, // DIPERTAHANKAN
];


const FormPeminjaman = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledData = location.state || {}; 

  const [formData, setFormData] = useState({
    room: prefilledData.room || '', 
    date: prefilledData.date || new Date().toISOString().split('T')[0],
    startTime: prefilledData.startTime || '', 
    endTime: '',
    purpose: '',
    capacity: 1,
  });

  const [error, setError] = useState('');

  // Handler untuk memperbarui state saat input berubah
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // ======================================
  // LOGIKA VALIDASI
  // ======================================
  const validateForm = () => {
    setError('');
    const { startTime, endTime } = formData;
    
    if (startTime && endTime) {
        
        const endHour = parseInt(endTime.split(':')[0]);
        
        // 1. Batas Akhir Peminjaman (Maksimal jam 21:00)
        if (endHour > 21 || (endHour === 21 && endTime.split(':')[1] !== '00')) {
            setError('Peminjaman maksimal hanya sampai Pukul 21:00.');
            return false;
        }

        // 2. Batas Durasi (Maksimal 2 jam)
        const start = new Date(`2000/01/01 ${startTime}`);
        const end = new Date(`2000/01/01 ${endTime}`);
        const durationMs = end - start;
        const maxDurationMs = 2 * 60 * 60 * 1000; // 2 jam dalam milidetik

        if (durationMs > maxDurationMs) {
            setError('Durasi peminjaman tidak boleh lebih dari 2 jam.');
            return false;
        }
        
        // 3. Waktu selesai harus setelah waktu mulai
        if (durationMs <= 0) {
            setError('Waktu selesai harus setelah waktu mulai.');
            return false;
        }
    }
    
    return true;
  };

  // Handler saat formulir disubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    console.log("Data Peminjaman Dikirim:", formData);
    alert(`Permohonan peminjaman untuk ${formData.room} berhasil diajukan!`);
    
    navigate('/riwayat');
  };
  // ======================================


  return (
    <div className="peminjaman-page-container">
      <Header isLandingPage={false} /> 

      <div className="peminjaman-content-wrapper">
        <h1 className="peminjaman-title">Ajukan Peminjaman Ruangan</h1>
        <p className="peminjaman-subtitle">
          Silakan isi detail kegiatan dan ruangan yang Anda butuhkan. (Maksimal 2 jam, batas akhir 21:00)
        </p>
        
        {error && <div className="form-error-message">{error}</div>}

        <form className="peminjaman-form" onSubmit={handleSubmit}>
          
          {/* BAGIAN 1: RUANGAN DAN KAPASITAS */}
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="room">Pilih Ruangan</label>
              <select 
                id="room" 
                name="room" 
                value={formData.room} 
                onChange={handleChange} 
                className="input-field"
                required
              >
                {/* Opsi default */}
                <option value="">-- Pilih Ruangan --</option> 
                
                {/* Generasi opsi ruangan secara dinamis */}
                {roomList.map((room) => (
                    <option key={room.value} value={room.value}>
                        {room.label}
                    </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Jumlah Peserta</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="input-field"
                min="1"
                required
              />
            </div>
          </div>

          {/* BAGIAN 2: TANGGAL DAN WAKTU */}
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="date">Tanggal Peminjaman</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
          
          <div className="form-group-row">
             <div className="form-group">
              <label htmlFor="startTime">Waktu Mulai</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
             <div className="form-group">
              <label htmlFor="endTime">Waktu Selesai</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* BAGIAN 3: TUJUAN */}
          <div className="form-group full-width">
            <label htmlFor="purpose">Tujuan Kegiatan</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="input-field textarea-field"
              rows="4"
              placeholder="Jelaskan tujuan peminjaman"
              required
            ></textarea>
          </div>
          
          {/* Tombol Submit */}
          <button type="submit" className="submit-btn">
            Ajukan Peminjaman
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPeminjaman;