import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useBookings } from '../../contexts/BookingContext';

const RiwayatPeminjaman = () => {
  const { user } = useAuth();
  const { getUserBookings, isLoaded } = useBookings();
  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    // .riwayat-peminjaman -> p-6 bg-white rounded-xl shadow-lg
    <div className="p-6 bg-white rounded-xl shadow-lg shadow-black/5 w-full overflow-x-auto">
      <h2 className="text-3xl font-bold text-[#3D5B81] mb-6">Riwayat Peminjaman</h2>

      {/* Tabel dengan kelas Tailwind untuk responsifitas */}
      <table className="min-w-full border-collapse mt-4 bg-white text-gray-700">
        <thead>
          <tr>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Tanggal Pengajuan</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Ruangan</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Tanggal</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Waktu</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Keperluan</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Peserta</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Peminjam</th>
            <th className="bg-gray-100 p-3 text-left font-semibold border-b-2 border-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {riwayatPeminjaman.map((peminjaman) => (
            <tr key={peminjaman._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
              <td className="p-3 text-sm">{new Date(peminjaman.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</td>
              <td className="p-3 text-sm font-medium text-[#3D5B81]">{peminjaman.room.name}</td>
              <td className="p-3 text-sm">{new Date(peminjaman.date).toLocaleDateString('id-ID')}</td>
              <td className="p-3 text-sm">{`${peminjaman.startTime} - ${peminjaman.endTime}`}</td>
              <td className="p-3 text-sm">{peminjaman.purpose}</td>
              <td className="p-3 text-sm">{peminjaman.participants}</td>
              <td className="p-3 text-sm">{peminjaman.user.name}</td>

              <td className="p-3">
                <span className={`status-badge status-${peminjaman.status.toLowerCase()}`}>
                  {peminjaman.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Placeholder jika tabel kosong */}
      {riwayatPeminjaman.length === 0 && (
          <div className="p-10 mt-5 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-600 font-medium">
              Belum ada riwayat peminjaman yang tercatat.
          </div>
      )}
    </div>
  );
};

export default RiwayatPeminjaman;