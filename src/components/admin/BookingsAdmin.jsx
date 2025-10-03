// BookingsAdmin.jsx
import { useEffect, useState } from 'react';
import { useBookings } from '../../contexts/BookingContext'; // PENTING

const BookingsAdmin = () => {
  // Ambil bookings (state global), updateBookingStatus, dan isLoaded dari context
  const { bookings: globalBookings, updateBookingStatus, isLoaded, error: contextError } = useBookings(); 
  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

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
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-[#3D5B81] mb-6">Kelola Peminjaman</h1>

        {sortedBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada peminjaman yang tercatat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {/* ... (headers) */}
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{booking.user.name} ({booking.user.email})</td>
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
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => updateStatus(booking._id, 'Ditolak')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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