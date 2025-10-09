import { useEffect, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useBookings } from '../../contexts/BookingContext';

const RiwayatPeminjaman = () => {
  const { user } = useAuth();
  const { getUserBookings } = useBookings();
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
        case 'room': aValue = a.room.name.toLowerCase(); bValue = b.room.name.toLowerCase(); break;
        case 'date': aValue = new Date(a.date); bValue = new Date(b.date); break;
        case 'time': aValue = a.startTime; bValue = b.startTime; break;
        case 'participants': aValue = parseInt(a.participants) || 0; bValue = parseInt(b.participants) || 0; break;
        case 'purpose': aValue = a.purpose.toLowerCase(); bValue = b.purpose.toLowerCase(); break;
        case 'status': aValue = a.status; bValue = b.status; break;
        default: return 0;
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }));
  }, [sortColumn, sortDirection]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg w-full">
        <h2 className="text-3xl font-bold text-[#3D5B81] mb-6">Riwayat Peminjaman</h2>
        <div className="text-center py-8">Memuat riwayat peminjaman...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg w-full">
        <h2 className="text-3xl font-bold text-[#3D5B81] mb-6">Riwayat Peminjaman</h2>
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 h-full">

      {/* Header */}
      <div className="p-4 sm:p-6 rounded-xl bg-white border border-blue-200 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3D5B81]">Riwayat Peminjaman</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Riwayat peminjaman terlampir berdasarkan data terbaru
        </p>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-[650px] sm:min-w-full border-collapse text-gray-700 text-xs sm:text-sm">
          <thead>
            <tr className="bg-blue-100 text-blue-700 font-semibold text-[11px] sm:text-sm uppercase">
              {[
                { key: 'room', label: 'Ruangan' },
                { key: 'date', label: 'Tanggal' },
                { key: 'time', label: 'Waktu' },
                { key: 'participants', label: 'Jumlah' },
                { key: 'purpose', label: 'Tujuan Kegiatan' },
                { key: 'status', label: 'Status' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="p-2 sm:p-3 text-left border-b-2 border-gray-200 cursor-pointer hover:bg-blue-200 transition-colors whitespace-nowrap"
                >
                  {label}
                  {sortColumn === key ? (
                    sortDirection === 'asc' ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    )
                  ) : (
                    <FaSort className="inline ml-1 opacity-50" />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {riwayatPeminjaman.map((p) => (
              <tr
                key={p._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-2 sm:p-3 text-[#3D5B81] font-medium">{p.room.name}</td>
                <td className="p-2 sm:p-3">{new Date(p.date).toLocaleDateString('id-ID')}</td>
                <td className="p-2 sm:p-3 whitespace-nowrap">{`${p.startTime} - ${p.endTime}`}</td>
                <td className="p-2 sm:p-3 text-center">{p.participants}</td>
                <td className="p-2 sm:p-3 truncate max-w-[150px]" title={p.purpose}>{p.purpose}</td>
                <td className="p-2 sm:p-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusClass(p.status)}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Scroll hint */}
        <div className="text-center text-gray-400 text-xs mt-3 sm:hidden animate-pulse">
          Geser ke samping untuk melihat lebih banyak →
        </div>
      </div>

      {/* Empty State */}
      {riwayatPeminjaman.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Belum ada riwayat peminjaman yang tercatat.
        </div>
      )}
    </div>
  );
};

export default RiwayatPeminjaman;
