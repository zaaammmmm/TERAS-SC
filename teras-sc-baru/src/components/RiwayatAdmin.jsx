// file: src/components/RiwayatAdmin.jsx

import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaRegTrashAlt, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';
import DateNavigator from './DateNavigator'; // <-- IMPORT BARU

const dummyPeminjaman = [
    { id: 301, ruangan: 'Co-Working Space A', tanggal: '01 - 10 -2025', waktuMulai: '09:00', waktuSelesai: '11:00', peminjam: 'Budi', keperluan: 'Belajar Kelompok', status: 'Menunggu' },
    { id: 302, ruangan: 'Co-Working Space C', tanggal: '02 - 10 -2025', waktuMulai: '15:00', waktuSelesai: '17:00', peminjam: 'Azka', keperluan: 'Kuliah', status: 'Disetujui' },
    { id: 303, ruangan: 'Co-Working Space EAST', tanggal: '03 - 10 -2025', waktuMulai: '19:00', waktuSelesai: '21:00', peminjam: 'Ahmad', keperluan: 'UKM', status: 'Menunggu' },
    { id: 304, ruangan: 'Co-Working Space D', tanggal: '04 - 10 -2025', waktuMulai: '13:00', waktuSelesai: '15:00', peminjam: 'Kafa', keperluan: 'Rapat', status: 'Ditolak' },
];

const RiwayatAdmin = () => {
    const [riwayatPeminjaman, setRiwayatPeminjaman] = useState(dummyPeminjaman);
    const [selectedDate, setSelectedDate] = useState(new Date()); // <-- State untuk tanggal

    const PRIMARY_COLOR = '#3D5B81'; 

    const loadPeminjaman = () => {
        const data = JSON.parse(localStorage.getItem('peminjaman') || JSON.stringify(dummyPeminjaman));
        const sortedData = data.sort((a, b) => b.id - a.id);
        setRiwayatPeminjaman(sortedData);
    };

    useEffect(() => {
        loadPeminjaman();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Disetujui':
                return 'bg-green-100 text-green-700';
            case 'Ditolak':
                return 'bg-red-100 text-red-700';
            case 'Menunggu':
            default:
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    const handleAction = (id, newStatus) => {
        const updatedBookings = riwayatPeminjaman.map(b => 
            b.id === id ? { ...b, status: newStatus } : b
        );
        
        setRiwayatPeminjaman(updatedBookings);
        localStorage.setItem('peminjaman', JSON.stringify(updatedBookings));

        alert(`Reservasi ID ${id} diubah menjadi ${newStatus}.`);
    };


    return (
        <div className="w-full space-y-6">
            
            {/* Navigasi Tanggal (Baru) */}
            <DateNavigator selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            {/* Header Area Konten */}
            <div className={`p-6 rounded-xl bg-white border border-blue-200 shadow-md`}>
                <h1 className="text-3xl font-bold text-[#3D5B81]">Riwayat Peminjaman (Admin View)</h1>
                <p className="text-gray-600 mt-1">Tinjau dan kelola status semua pengajuan peminjaman ruangan.</p>
            </div>

            {/* Tabel Riwayat Booking */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                    
                    <thead>
                        <tr className="bg-blue-100 text-blue-700 font-semibold text-sm uppercase">
                            <th className="p-3 text-center border-b">ID</th>
                            <th className="p-3 text-left border-b">Ruangan</th>
                            <th className="p-3 text-left border-b">Tanggal & Waktu</th>
                            <th className="p-3 text-left border-b">Peminjam</th>
                            <th className="p-3 text-left border-b">Keperluan</th>
                            <th className="p-3 text-center border-b">Status</th>
                            <th className="p-3 text-center border-b min-w-[180px]">Aksi</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {riwayatPeminjaman.length > 0 ? (
                            riwayatPeminjaman.map((b) => (
                                <tr key={b.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-center text-sm font-medium text-gray-600">{b.id}</td>
                                    <td className="p-3 text-left text-sm font-medium text-blue-700">{b.ruangan}</td>
                                    <td className="p-3 text-left text-sm">
                                        {b.waktuMulai} - {b.waktuSelesai}
                                    </td>
                                    <td className="p-3 text-left text-sm">{b.peminjam}</td>
                                    <td className="p-3 text-left text-sm">{b.keperluan}</td>
                                    
                                    <td className="p-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(b.status)}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    
                                    <td className="p-3 text-center min-w-[180px]">
                                        {b.status === 'Menunggu' ? (
                                            <div className="flex justify-center space-x-2">
                                                {/* Tombol Setujui */}
                                                <button 
                                                    onClick={() => handleAction(b.id, 'Disetujui')}
                                                    className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-green-700 font-bold shadow-sm"
                                                    title="Setujui Reservasi"
                                                >
                                                    <FaCalendarCheck className="w-3 h-3" /> Setujui
                                                </button>
                                                {/* Tombol Tolak */}
                                                <button 
                                                    onClick={() => handleAction(b.id, 'Ditolak')}
                                                    className="flex items-center gap-1 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-red-700 font-bold shadow-sm"
                                                    title="Tolak Reservasi"
                                                >
                                                    <FaCalendarTimes className="w-3 h-3" /> Tolak
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-x-2">
                                                <button title="Edit Detail" className={`text-gray-600 hover:text-gray-900 transition-colors`}>
                                                    <FaRegEdit className="inline-block w-4 h-4" />
                                                </button>
                                                <button title="Hapus Permanen" className="text-red-400 hover:text-red-600 transition-colors">
                                                    <FaRegTrashAlt className="inline-block w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-500 italic">
                                    Tidak ada data riwayat peminjaman yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RiwayatAdmin;