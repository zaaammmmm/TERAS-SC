// src/components/FormPeminjaman.js (Kode UTUH dan Direvisi)

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    timeSlot: '', // Replace startTime and endTime with single timeSlot
    purpose: '',
    capacity: 1,
    peminjam: prefilledData.peminjam || '',
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
    return true; // Since we're using predefined slots, no need for time validation
  };

  // Handler saat formulir disubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Split timeSlot into startTime and endTime for storage
    const [startTime, endTime] = formData.timeSlot.split('-');
    
    // Get existing peminjaman from localStorage
    const existingPeminjaman = JSON.parse(localStorage.getItem('peminjaman') || '[]');
    
    // Create new peminjaman data structure that matches RiwayatPeminjaman display
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
    
    // Save to localStorage
    localStorage.setItem('peminjaman', JSON.stringify([...existingPeminjaman, newPeminjaman]));
    
    // Reset form
    setFormData({
      room: '',
      date: '',
      timeSlot: '',
      purpose: '',
      capacity: 1,
      peminjam: ''
    });

    // Show success message and navigate to riwayat
    alert(`Peminjaman ruangan ${newPeminjaman.ruangan} berhasil diajukan!\nSilakan cek status peminjaman di halaman Riwayat Peminjaman.`);
    navigate('/riwayat');
  };
  // ======================================


  return (
    <div className="peminjaman-page-container">

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
            
            <div className="form-group">
              <label htmlFor="timeSlot">Waktu Peminjaman</label>
              <select 
                id="timeSlot" 
                name="timeSlot" 
                value={formData.timeSlot} 
                onChange={handleChange} 
                className="input-field"
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

          {/* BAGIAN 4: DATA PEMINJAM (NAMA PEMINJAM) */}
          <div className="form-group full-width">
            <label htmlFor="peminjam">Nama Pemohon</label>
            <input
              type="text"
              id="peminjam"
              name="peminjam"
              value={formData.peminjam}
              onChange={handleChange}
              className="input-field"
              placeholder="Masukkan nama Anda"
              required
            />
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