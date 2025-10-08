// RiwayatAdmin.jsx
import { useEffect, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useBookings } from '../../contexts/BookingContext';

const RiwayatAdmin = () => {
    // Ambil bookings (state global) dan isLoaded dari context
    const { bookings: allBookings, isLoaded, error: contextError } = useBookings();
    
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortColumn, setSortColumn] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    useEffect(() => {
        // Hanya proses jika data dari context sudah dimuat
        if (isLoaded) {
            setLoading(false);
            setError(contextError);

            // Filter data dari state global
            const approved = allBookings.filter(booking => booking.status === 'Disetujui');
            setApprovedBookings(approved);
        } else {
            // Tampilkan loading jika context masih fetch data
            setLoading(true);
        }
    }, [allBookings, isLoaded, contextError]);

    useEffect(() => {
        setApprovedBookings(prev => [...prev].sort((a, b) => {
            let aValue, bValue;
            switch (sortColumn) {
                case 'id':
                    aValue = a._id.toLowerCase();
                    bValue = b._id.toLowerCase();
                    break;
                case 'room':
                    aValue = a.room.name.toLowerCase();
                    bValue = b.room.name.toLowerCase();
                    break;
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'time':
                    aValue = a.startTime;
                    bValue = b.startTime;
                    break;
                case 'user':
                    aValue = a.user.name.toLowerCase();
                    bValue = b.user.name.toLowerCase();
                    break;
                case 'purpose':
                    aValue = a.purpose.toLowerCase();
                    bValue = b.purpose.toLowerCase();
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    return 0;
            }
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        }));
    }, [sortColumn, sortDirection]);

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
                            <th className="p-3 text-center cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('id')}>
                                ID
                                {sortColumn === 'id' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                            </th>
                            <th className="p-3 text-left cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('room')}>
                                Ruangan
                                {sortColumn === 'room' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                            </th>
                            <th className="p-3 text-left cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('date')}>
                                Tanggal
                                {sortColumn === 'date' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                            </th>
                            <th className="p-3 text-left cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('time')}>
                                Waktu
                                {sortColumn === 'time' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                            </th>
                            <th className="p-3 text-left cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('user')}>
                                Peminjam
                                {sortColumn === 'user' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                            </th>
                            <th className="p-3 text-left cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('purpose')}>
                                Keperluan
                                {sortColumn === 'purpose' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                            </th>
                            <th className="p-3 text-center cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('status')}>
                                Status
                                {sortColumn === 'status' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                            </th>
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