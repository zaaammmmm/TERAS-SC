// BookingsAdmin.jsx
import { useEffect, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp, FaSync } from 'react-icons/fa';
import { useBookings } from '../../contexts/BookingContext';

const BookingsAdmin = () => {
  // Ambil bookings (state global), updateBookingStatus, dan isLoaded dari context
  const { bookings: globalBookings, updateBookingStatus, isLoaded, error: contextError } = useBookings();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const goToPreviousDay = () => {
    const current = dateFilter ? new Date(dateFilter) : new Date();
    current.setDate(current.getDate() - 1);
    setDateFilter(current.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const current = dateFilter ? new Date(dateFilter) : new Date();
    current.setDate(current.getDate() + 1);
    setDateFilter(current.toISOString().split('T')[0]);
  };

  const refreshFilters = () => {
    setStatusFilter('All');
    setRoomFilter('All');
    setDateFilter('');
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    // Ketika globalBookings (dari Context) berubah, update status loading/error
    if (isLoaded) {
      setLoading(false);
      setError(contextError);
    } else {
      setLoading(true);
      setError(null);
    }
  }, [globalBookings, isLoaded, contextError]); 

  // Urutkan bookings global di sini untuk render
  const sortedBookings = [...globalBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filter bookings berdasarkan status, ruangan, dan tanggal
  let filteredBookings = sortedBookings.filter(booking => {
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    const matchesRoom = roomFilter === 'All' || booking.room.name === roomFilter;
    const matchesDate = dateFilter === '' || new Date(booking.date).toDateString() === new Date(dateFilter).toDateString();
    return matchesStatus && matchesRoom && matchesDate;
  });

  // Sort filtered bookings
  filteredBookings = filteredBookings.sort((a, b) => {
    let aValue, bValue;
    switch (sortColumn) {
      case 'user':
        aValue = a.user.name.toLowerCase();
        bValue = b.user.name.toLowerCase();
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
      case 'purpose':
        aValue = a.purpose.toLowerCase();
        bValue = b.purpose.toLowerCase();
        break;
      case 'participants':
        aValue = parseInt(a.participants) || 0;
        bValue = parseInt(b.participants) || 0;
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
  });


  const updateStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      alert(`Status berhasil diperbarui menjadi ${status}.`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Gagal memperbarui status peminjaman');
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Menunggu': 'bg-yellow-100 text-yellow-800',
      'Disetujui': 'bg-green-100 text-green-800',
      'Ditolak': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-[#3D5B81] mb-6">Kelola Peminjaman</h1>
          <div className="text-center py-8">Memuat data peminjaman...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-[#3D5B81] mb-6">Kelola Peminjaman</h1>
          <div className="text-center py-8 text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">

      {/* ... (header) */}
      <div className={`p-6 rounded-xl bg-white border border-blue-200 shadow-md`}>
            <h1 className="text-3xl font-bold text-[#3D5B81]">Kelola Peminjaman</h1>
            <p className="text-gray-600 mt-1">Kelola Peminjaman data booking user </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-4 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <option value="All">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <option value="All">Semua Ruangan</option>
              <option value="Co-Working Space A">Co-Working Space A</option>
              <option value="Co-Working Space B">Co-Working Space B</option>
              <option value="Co-Working Space C">Co-Working Space C</option>
              <option value="Co-Working Space D">Co-Working Space D</option>
              <option value="Co-Working Space E">Co-Working Space E</option>
              <option value="Co-Working Space F">Co-Working Space F</option>
              <option value="Co-Working Space EAST">Co-Working Space EAST</option>
            </select>
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousDay}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {'<'}
              </button>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
              />
              <button
                onClick={goToNextDay}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {'>'}
              </button>
            </div>
            <button
              onClick={refreshFilters}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
              title="Refresh Filters"
            >
              <FaSync className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {sortedBookings.length === 0 ? 'Belum ada peminjaman yang tercatat.' : 'Tidak ada peminjaman yang sesuai dengan filter.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-700 font-semibold text-sm uppercase">
                  <th className="p-3 text-left cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('user')}>
                    Pengguna
                    {sortColumn === 'user' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
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
                  <th className="p-3 text-left cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('purpose')}>
                    Tujuan
                    {sortColumn === 'purpose' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                  </th>
                  <th className="p-3 text-left cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('participants')}>
                    Peserta
                    {sortColumn === 'participants' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                  </th>
                  <th className="p-3 text-center cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => handleSort('status')}>
                    Status
                    {sortColumn === 'status' ? (sortDirection === 'asc' ? <FaSortUp className="inline ml-1" /> : <FaSortDown className="inline ml-1" />) : <FaSort className="inline ml-1 opacity-50" />}
                  </th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{booking.user.name}</td>
                    <td className="p-3 font-medium text-[#3D5B81]">{booking.room.name}</td>
                    <td className="p-3">{new Date(booking.date).toLocaleDateString('id-ID')}</td>
                    <td className="p-3">{`${booking.startTime} - ${booking.endTime}`}</td>
                    <td className="p-3">{booking.purpose}</td>
                    <td className="p-3">{booking.participants}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {booking.status === 'Menunggu' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(booking._id, 'Disetujui')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 focus:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => updateStatus(booking._id, 'Ditolak')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 focus:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsAdmin;