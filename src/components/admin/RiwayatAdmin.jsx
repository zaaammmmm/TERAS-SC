// RiwayatAdmin.jsx
import { useEffect, useState } from 'react';
import { useBookings } from '../../contexts/BookingContext';

const RiwayatAdmin = () => {
    // Ambil bookings (state global) dan isLoaded dari context
    const { bookings: allBookings, isLoaded, error: contextError } = useBookings();
    
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hanya proses jika data dari context sudah dimuat
        if (isLoaded) {
            setLoading(false);
            setError(contextError);
            
            // Filter data dari state global
            const approved = allBookings
                .filter(booking => booking.status === 'Disetujui')
                // Pastikan b.date bisa diinterpretasikan sebagai tanggal
                .sort((a, b) => new Date(b.date) - new Date(a.date)); 
            
            setApprovedBookings(approved);
        } else {
            // Tampilkan loading jika context masih fetch data
            setLoading(true);
        }
    }, [allBookings, isLoaded, contextError]); 

    const getStatusClass = (status) => {
        // ... (kode status class)
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

    if (loading) {
        // ... (kode loading)
        return (
            <div className="w-full space-y-6">
                <div className={`p-6 rounded-xl bg-white border border-blue-200 shadow-md`}>
                    <h1 className="text-3xl font-bold text-[#3D5B81]">Riwayat Peminjaman Disetujui</h1>
                    <div className="text-center py-8">Memuat data riwayat peminjaman...</div>
                </div>
            </div>
        );
    }

    if (error) {
        // ... (kode error)
        return (
            <div className="w-full space-y-6">
                <div className={`p-6 rounded-xl bg-white border border-blue-200 shadow-md`}>
                    <h1 className="text-3xl font-bold text-[#3D5B81]">Riwayat Peminjaman Disetujui</h1>
                    <div className="text-center py-8 text-red-600">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* ... (header) */}
            <div className={`p-6 rounded-xl bg-white border border-blue-200 shadow-md`}>
                <h1 className="text-3xl font-bold text-[#3D5B81]">Riwayat Peminjaman Disetujui</h1>
                <p className="text-gray-600 mt-1">Riwayat peminjaman ruangan yang telah disetujui oleh admin, diurutkan berdasarkan waktu terbaru.</p>
            </div>

            {/* Tabel Riwayat Booking */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                    
                    <thead>
                        <tr className="bg-blue-100 text-blue-700 font-semibold text-sm uppercase">
                            <th className="p-3 text-center">ID</th>
                            <th className="p-3 text-left">Ruangan</th>
                            <th className="p-3 text-left">Tanggal</th>
                            <th className="p-3 text-left">Waktu</th>
                            <th className="p-3 text-left">Peminjam</th>
                            <th className="p-3 text-left">Keperluan</th>
                            <th className="p-3 text-center">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {approvedBookings.length > 0 ? (
                            approvedBookings.map((b) => (
                                <tr key={b._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-center text-sm font-medium text-gray-600">{b._id}</td>
                                    <td className="p-3 text-left text-sm font-medium text-blue-700">{b.room.name}</td>
                                    <td className="p-3 text-left text-sm">{new Date(b.date).toLocaleDateString('id-ID')}</td>
                                    <td className="p-3 text-left text-sm">{b.startTime} - {b.endTime}</td>
                                    <td className="p-3 text-left text-sm">{b.user.name}</td>
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
                                <td colSpan="7" className="p-8 text-center text-gray-500 italic">
                                    Tidak ada data riwayat peminjaman yang disetujui.
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