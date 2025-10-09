// DetailRoomUser.jsx
import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookings } from '../../contexts/BookingContext';

const DetailRoomUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings: allBookings, isLoaded } = useBookings();

  const { room, selectedDate } = location.state || {};
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const PRIMARY_COLOR = '#3D5B81';

  const getFormattedDateString = useCallback((dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
  }, []);

  const getDisplayDate = useCallback((dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, []);

  const formattedDateForComparison = getFormattedDateString(selectedDate);
  const displayDate = getDisplayDate(formattedDateForComparison);

  useEffect(() => {
    setLoading(true);
    if (room && isLoaded) {
      const filtered = allBookings.filter(
        (booking) =>
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
      case 'Disetujui':
        return 'bg-green-100 text-green-700';
      case 'Ditolak':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (!room || !selectedDate) {
    return (
      <div className="w-full">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <p>
            Data tidak ditemukan. Kembali ke{' '}
            <a href="/ruangan" className="text-blue-500 underline">
              Daftar Ruangan
            </a>.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
        Memuat data peminjaman...
      </div>
    );
  }

  return (
    <div className="w-full min-h-full">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/ruangan')}
            className="text-gray-600 hover:text-[#3D5B81] transition-colors text-lg sm:text-xl mr-3"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
            Detail Ruangan {room.name}
          </h1>
        </div>

        <div className="p-3 sm:p-4 rounded-lg bg-blue-100 border border-blue-200 shadow-md">
          <h2 className="text-base sm:text-xl font-bold text-blue-700 mb-1">
            Jadwal Peminjaman untuk {displayDate}
          </h2>
          <p className="text-xs sm:text-sm text-gray-700">
            Menampilkan semua peminjaman (Menunggu, Disetujui, Ditolak).
          </p>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-white p-3 sm:p-6 rounded-xl border border-gray-200 shadow-lg w-full overflow-x-auto">
        {/* Desktop view (table) */}
        <table className="hidden sm:table min-w-full border-collapse">
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
                <tr
                  key={b._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-sm font-medium">{b.room?.name}</td>
                  <td className="p-3 text-sm">{getDisplayDate(b.date)}</td>
                  <td className="p-3 text-sm">{b.startTime} - {b.endTime}</td>
                  <td className="p-3 text-sm font-medium">{b.user?.name}</td>
                  <td className="p-3 text-sm">{b.purpose}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(b.status)}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  Tidak ada peminjaman tercatat untuk tanggal ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile view (card) */}
        <div className="sm:hidden space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => (
              <div
                key={b._id}
                className="p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-[#3D5B81]">
                    {b.room?.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusClass(b.status)}`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  <strong>Tanggal:</strong> {getDisplayDate(b.date)}
                </p>
                <p className="text-xs text-gray-700">
                  <strong>Waktu:</strong> {b.startTime} - {b.endTime}
                </p>
                <p className="text-xs text-gray-700">
                  <strong>Peminjam:</strong> {b.user?.name}
                </p>
                <p className="text-xs text-gray-700">
                  <strong>Keperluan:</strong> {b.purpose}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500">
              Tidak ada peminjaman tercatat untuk tanggal ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailRoomUser;
