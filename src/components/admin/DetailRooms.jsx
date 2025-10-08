// DetailRooms.jsx (Admin)
import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft, FaCalendarCheck, FaCalendarTimes, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookings } from '../../contexts/BookingContext';

const DetailRooms = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { room, selectedDate } = location.state || {};

    // Ambil fungsi API, BUKAN state global bookings.
    const { getAllBookings: fetchAllBookingsAPI, updateBookingStatus } = useBookings(); 
    
    const [roomBookings, setRoomBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const PRIMARY_COLOR = '#3D5B81';

    const getFormattedDateString = useCallback((dateObj) => {
        if (!dateObj) return '';
        const d = new Date(dateObj);
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        return [year, month, day].join('-');
    }, []);

    const getDisplayDate = useCallback((dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    }, []);

    const formattedDateForComparison = getFormattedDateString(selectedDate);
    const displayDate = getDisplayDate(formattedDateForComparison);

    
    const fetchAndFilterBookings = useCallback(async () => {
        if (!room || !selectedDate) return;
        
        try {
            setLoading(true);
            setError(null);
            
            // Panggil API global secara langsung (Admin endpoint)
            const allBookings = await fetchAllBookingsAPI(); 
            
            const filtered = allBookings
                .filter(
                    (booking) =>
                        booking.room?.name === room.name &&
                        booking.date.split('T')[0] === formattedDateForComparison
                )
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
            
            setRoomBookings(filtered);
        } catch (err) {
            console.error('Error fetching global bookings (Admin):', err);
            // Tampilkan error otorisasi dari server
            setError('Gagal memuat data peminjaman. Pastikan Anda terotentikasi sebagai Admin.');
        } finally {
            setLoading(false);
        }
    }, [room, selectedDate, formattedDateForComparison, fetchAllBookingsAPI]);

    useEffect(() => {
        fetchAndFilterBookings();
    }, [fetchAndFilterBookings]);


    const handleAction = async (bookingId, newStatus) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
            alert(`Reservasi ID ${bookingId} telah diubah menjadi ${newStatus}.`);
            
            // Refresh data setelah aksi
            fetchAndFilterBookings(); 
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Gagal memperbarui status. Silakan coba lagi.');
        }
    };

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
                    <p>
                        Data tidak ditemukan. Kembali ke{' '}
                        <button
                            onClick={() => navigate('/admin/rooms')}
                            className="text-blue-500 hover:underline"
                        >
                            Daftar Ruangan
                        </button>
                        .
                    </p>
                </div>
            </div>
        );
    }
    
    if (loading) {
         return (
            <div className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200">Memuat data peminjaman...</div>
        );
    }
    
    if (error) {
         return (
            <div className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-red-600 font-medium">{error}</div>
        );
    }


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
                        Riwayat Booking {room.name}
                    </h2>
                    <p className="text-sm text-gray-700">Tinjau semua pengajuan peminjaman untuk ruangan ini pada tanggal {displayDate}.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-blue-700 font-semibold text-sm uppercase">
                            <th className="p-3 text-center border-b">ID</th>
                            <th className="p-3 text-left border-b">Waktu</th>
                            <th className="p-3 text-left border-b">Peminjam</th>
                            <th className="p-3 text-left border-b">Email</th>
                            <th className="p-3 text-left border-b">Keperluan</th>
                            <th className="p-3 text-center border-b">Status</th>
                            <th className="p-3 text-center border-b min-w-[180px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomBookings.length > 0 ? (
                            roomBookings.map((b) => (
                                <tr
                                    key={b._id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-3 text-center text-sm font-medium text-gray-600">
                                        {b._id.slice(-5)}
                                    </td>
                                    <td className="p-3 text-left text-sm">
                                        {b.startTime} - {b.endTime}
                                    </td>
                                    <td className="p-3 text-left text-sm font-medium">
                                        {b.user.name}
                                    </td>
                                    <td className="p-3 text-left text-sm">
                                        {b.user.email}
                                    </td>
                                    <td className="p-3 text-left text-sm">
                                        {b.purpose}
                                    </td>
                                    <td className="p-3 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                b.status
                                            )}`}
                                        >
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center min-w-[180px]">
                                        {b.status === 'Menunggu' ? (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleAction(b._id, 'Disetujui')}
                                                    className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-green-700 font-bold shadow-sm"
                                                    title="Setujui Reservasi"
                                                >
                                                    <FaCalendarCheck className="w-3 h-3" /> Setujui
                                                </button>
                                                <button
                                                    onClick={() => handleAction(b._id, 'Ditolak')}
                                                    className="flex items-center gap-1 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors hover:bg-red-700 font-bold shadow-sm"
                                                    title="Tolak Reservasi"
                                                >
                                                    <FaCalendarTimes className="w-3 h-3" /> Tolak
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-x-2">
                                                <button
                                                    title="Edit Detail"
                                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    <FaRegEdit className="inline-block w-4 h-4" />
                                                </button>
                                                <button
                                                    title="Hapus Permanen"
                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <FaRegTrashAlt className="inline-block w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="p-3 text-center text-gray-500"
                                >
                                    Tidak ada peminjaman untuk ruangan ini pada tanggal{' '}
                                    {displayDate}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailRooms;