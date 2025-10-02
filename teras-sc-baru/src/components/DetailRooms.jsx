// file: src/components/DetailRooms.jsx (KODE UTUH & TOMBOL DIPERBAGUS)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegEdit, FaRegTrashAlt, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';

// Data Dummy Peminjaman
const dummyPeminjaman = [
    { id: 101, ruangan: 'Co-Working Space A', tanggal: '01 - 10 -2025', waktu: '09.00 - 11.00', peminjam: 'Budi', keperluan: 'Belajar Kelompok', status: 'Menunggu' },
    { id: 102, ruangan: 'Co-Working Space A', tanggal: '02 - 10 -2025', waktu: '11.00 - 13.00', peminjam: 'Dedi', keperluan: 'UKM', status: 'Disetujui' },
    { id: 103, ruangan: 'Co-Working Space A', tanggal: '03 - 10 -2025', waktu: '13.00 - 15.00', peminjam: 'Ahmad', keperluan: 'Kuliah', status: 'Ditolak' },
];

const DetailRooms = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState(dummyPeminjaman);
    const [roomName, setRoomName] = useState(`Ruangan Co-Working ID ${id}`);

    const PRIMARY_COLOR = '#3D5B81';

    useEffect(() => {
        const roomMapping = { '1': 'Co-Working Space A', '2': 'Co-Working Space B', '3': 'Co-Working Space C', '7': 'Co-Working Space EAST' };
        setRoomName(roomMapping[id] || `Ruangan #${id}`);
    }, [id]);

    const handleAction = (bookingId, newStatus) => {
        const updatedBookings = bookings.map(b => 
            b.id === bookingId ? { ...b, status: newStatus } : b
        );
        setBookings(updatedBookings);
        alert(`Reservasi ID ${bookingId} telah diubah menjadi ${newStatus}.`);
    };
    
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
    
    return (
        <div className="w-full">
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
                <div className="flex items-center mb-4">
                    <button 
                        onClick={() => navigate('/admin/rooms')} 
                        className={`text-gray-600 hover:text-[${PRIMARY_COLOR}] transition-colors text-xl mr-4`}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Peminjaman Ruangan
                    </h1>
                </div>

                <div className="p-4 rounded-lg bg-blue-100 border border-blue-200 shadow-md">
                    <h2 className="text-2xl font-bold text-blue-700 mb-2">
                        Riwayat Booking {roomName}
                    </h2>
                    <p className="text-sm text-gray-700">Tinjau semua pengajuan peminjaman untuk ruangan ini.</p>
                </div>
            </div>

            {/* Tabel Riwayat Booking */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                    
                    <thead>
                        <tr className="bg-blue-100 text-blue-700 font-semibold text-sm uppercase">
                            <th className="p-3 text-center border-b">ID</th>
                            <th className="p-3 text-left border-b">Ruangan</th>
                            <th className="p-3 text-left border-b">Tanggal</th>
                            <th className="p-3 text-left border-b">Waktu</th>
                            <th className="p-3 text-left border-b">Peminjam</th>
                            <th className="p-3 text-center border-b">Status</th>
                            <th className="p-3 text-center border-b min-w-[180px]">Aksi</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-3 text-center text-sm font-medium text-gray-600">{b.id}</td>
                                <td className="p-3 text-left text-sm font-medium text-blue-700">{b.ruangan}</td>
                                <td className="p-3 text-left text-sm">{b.tanggal}</td>
                                <td className="p-3 text-left text-sm">{b.waktu}</td>
                                <td className="p-3 text-left text-sm font-medium">{b.peminjam}</td>
                                
                                <td className="p-3 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(b.status)}`}>
                                        {b.status}
                                    </span>
                                </td>
                                
                                <td className="p-3 text-center min-w-[180px]">
                                    {b.status === 'Menunggu' ? (
                                        <div className="flex justify-center space-x-2">
                                            {/* TOMBOL SETUJUI (Lebih Menonjol) */}
                                            <button 
                                                onClick={() => handleAction(b.id, 'Disetujui')}
                                                className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-green-700 font-bold shadow-sm"
                                                title="Setujui Reservasi"
                                            >
                                                <FaCalendarCheck className="w-3 h-3" /> Setujui
                                            </button>
                                            {/* TOMBOL TOLAK (Lebih Menonjol) */}
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailRooms;