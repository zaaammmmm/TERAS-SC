import { useEffect, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useBookings } from '../../contexts/BookingContext';

const RiwayatPeminjaman = () => {
  const { user } = useAuth();
  const { getUserBookings, isLoaded } = useBookings();
  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([]);
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'Disetujui': return 'bg-green-100 text-green-700';
      case 'Ditolak': return 'bg-red-100 text-red-700';
      case 'Menunggu': default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const bookings = await getUserBookings();
        setRiwayatPeminjaman(bookings);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        setError('Gagal memuat riwayat peminjaman');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user, getUserBookings]);

  useEffect(() => {
    setRiwayatPeminjaman(prev => [...prev].sort((a, b) => {
      let aValue, bValue;
      switch (sortColumn) {
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
        case 'participants':
          aValue = parseInt(a.participants) || 0;
          bValue = parseInt(b.participants) || 0;
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

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg shadow-black/5 w-full">
        <h2 className="text-3xl font-bold text-[#3D5B81] mb-6">Riwayat Peminjaman</h2>
        <div className="text-center py-8">Memuat riwayat peminjaman...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg shadow-black/5 w-full">
        <h2 className="text-3xl font-bold text-[#3D5B81] mb-6">Riwayat Peminjaman</h2>
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    
    <div className="w-full space-y-6">

      {/* ... (header) */}
      <div className={`p-6 rounded-xl bg-white border border-blue-200 shadow-md`}>
            <h1 className="text-3xl font-bold text-[#3D5B81]">Riwayat Peminjaman</h1>
            <p className="text-gray-600 mt-1">Riwayat peminjaman terlampir disini berdasarkan data terbaru </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">

      {/* Tabel dengan kelas Tailwind untuk responsifitas */}
      <table className="min-w-full border-collapse m-0 bg-white text-gray-700">
        <thead>
          <tr className="bg-blue-100 text-blue-700 font-semibold text-sm uppercase">
            <th className=" p-3 text-left border-b-2 border-gray-200 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('room')}>
              Ruangan
              {sortColumn === 'room' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
            </th>
            <th className=" p-3 text-left border-b-2 border-gray-200 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('date')}>
              Tanggal
              {sortColumn === 'date' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
            </th>
            <th className=" p-3 text-left border-b-2 border-gray-200 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('time')}>
              Waktu
              {sortColumn === 'time' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
            </th>
            <th className=" p-3 text-left border-b-2 border-gray-200 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('participants')}>
              Jumlah
              {sortColumn === 'participants' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
            </th>
            <th className=" p-3 text-left border-b-2 border-gray-200 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('purpose')}>
              Tujuan Kegiatan
              {sortColumn === 'purpose' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
            </th>
            <th className=" p-3 text-left border-b-2 border-gray-200 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('status')}>
              Status
              {sortColumn === 'status' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
            </th>
          </tr>
        </thead>
        <tbody>
          {riwayatPeminjaman.map((peminjaman) => (
            <tr key={peminjaman._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-3 text-sm font-medium text-[#3D5B81]">{peminjaman.room.name}</td>
              <td className="p-3 text-sm">{new Date(peminjaman.date).toLocaleDateString('id-ID')}</td>
              <td className="p-3 text-sm">{`${peminjaman.startTime} - ${peminjaman.endTime}`}</td>
              <td className="p-3 text-sm">{peminjaman.participants}</td>
              <td className="p-3 text-sm">{peminjaman.purpose}</td>
              <td className="p-3 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(peminjaman.status)}`}>
                  {peminjaman.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      </div>

      {/* Placeholder jika tabel kosong */}
      {riwayatPeminjaman.length === 0 && (
          <div className="text-center py-8 text-gray-500">
              Belum ada riwayat peminjaman yang tercatat.
          </div>
      )}
    </div>
  );
};

export default RiwayatPeminjaman;