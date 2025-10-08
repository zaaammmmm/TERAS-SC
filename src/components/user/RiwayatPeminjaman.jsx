import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useBookings } from '../../contexts/BookingContext';

const RiwayatPeminjaman = () => {
  const { user } = useAuth();
  const { getUserBookings, isLoaded } = useBookings();
  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setRiwayatPeminjaman(bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        setError('Gagal memuat riwayat peminjaman');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user, getUserBookings]);

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
            <th className=" p-3 text-left border-b-2 border-gray-200">Ruangan</th>
            <th className=" p-3 text-left border-b-2 border-gray-200">Tanggal</th>
            <th className=" p-3 text-left border-b-2 border-gray-200">Waktu</th>
            <th className=" p-3 text-left border-b-2 border-gray-200">Peminjam</th>
            <th className=" p-3 text-left border-b-2 border-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {riwayatPeminjaman.map((peminjaman) => (
            <tr key={peminjaman._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-3 text-sm font-medium text-[#3D5B81]">{peminjaman.room.name}</td>
              <td className="p-3 text-sm">{new Date(peminjaman.date).toLocaleDateString('id-ID')}</td>
              <td className="p-3 text-sm">{`${peminjaman.startTime} - ${peminjaman.endTime}`}</td>
              <td className="p-3 text-sm">{peminjaman.user.name}</td>
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