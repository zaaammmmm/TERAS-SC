// DetailRoomUser.jsx

import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookings } from '../../contexts/BookingContext';

const DetailRoomUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // bookings kini dijamin terisi untuk user biasa (dari /global) atau admin
    const { bookings: allBookings, isLoaded } = useBookings(); 

    const { room, selectedDate } = location.state || {};
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const PRIMARY_COLOR = '#3D5B81';
    
    // Fungsi konversi objek Date dari navigasi menjadi string YYYY-MM-DD
    const getFormattedDateString = useCallback((dateObj) => {
        if (!dateObj) return '';
        const d = new Date(dateObj);
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        return [year, month, day].join('-');
    }, []);

    // Helper untuk format tampilan tanggal dari string YYYY-MM-DD (data DB)
    const getDisplayDate = useCallback((dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    }, []);

    const formattedDateForComparison = getFormattedDateString(selectedDate);
    // Gunakan formattedDateForComparison untuk tampilan agar konsisten
    const displayDate = getDisplayDate(formattedDateForComparison); 


    useEffect(() => {
        setLoading(true);
        // Tunggu context selesai memuat data
        if (room && isLoaded) { 
            const filtered = allBookings.filter(
                (booking) =>
                    // Filter Logika: Ruangan dan Tanggal harus cocok. Tidak ada filter status.
                    booking.room?.name === room.name &&
                    booking.date.split('T')[0] === formattedDateForComparison
            );
            
            filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
            
            setFilteredBookings(filtered);
            setLoading(false);
        } else if (!isLoaded) {
            setLoading(true);
        }
    }, [allBookings, room, isLoaded, formattedDateForComparison]);

    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Disetujui': return 'bg-green-100 text-green-700';
            case 'Ditolak': return 'bg-red-100 text-red-700'; 
            case 'Menunggu': default: return 'bg-yellow-100 text-yellow-700';
        }
    };
    
    if (!room || !selectedDate) {
        return (
            <div className="w-full">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <p>Data tidak ditemukan. Kembali ke <a href="/ruangan" className="text-blue-500">Daftar Ruangan</a>.</p>
                </div>
            </div>
        );
    }
    
    if (loading) {
        return (
            <div className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200">Memuat data peminjaman...</div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
                <div className="flex items-center mb-4">
                    <button onClick={() => navigate('/ruangan')} className={`text-gray-600 hover:text-[${PRIMARY_COLOR}] transition-colors text-xl mr-4`}>
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Detail Ruangan {room.name}
                    </h1>
                </div>

                <div className="p-4 rounded-lg bg-blue-100 border border-blue-200 shadow-md">
                    <h2 className="text-2xl font-bold text-blue-700 mb-2">
                        Jadwal Peminjaman untuk {displayDate}
                    </h2>
                    <p className="text-sm text-gray-700">Melihat semua peminjaman (Menunggu, Disetujui, Ditolak) untuk ruangan ini.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-blue-700 font-semibold text-sm uppercase">
                            <th className="p-3 text-left border-b">Ruangan</th>
                            <th className="p-3 text-left border-b">Tanggal</th>
                            <th className="p-3 text-left border-b">Waktu</th>
                            <th className="p-3 text-left border-b">Peminjam</th>
                            <th className="p-3 text-left border-b">Keperluan</th>
                            <th className="p-3 text-center border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((b) => (
                                <tr key={b._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-left text-sm font-medium">{b.room?.name}</td>
                                    <td className="p-3 text-left text-sm">{getDisplayDate(b.date)}</td> 
                                    <td className="p-3 text-left text-sm">{b.startTime} - {b.endTime}</td>
                                    <td className="p-3 text-left text-sm font-medium">{b.user?.name}</td>
                                    <td className="p-3 text-left text-sm">{b.purpose}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(b.status)}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-3 text-center text-gray-500">Tidak ada peminjaman tercatat untuk tanggal ini.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailRoomUser;