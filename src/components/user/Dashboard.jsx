
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaUserClock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingContext';

const Dashboard = () => {
  const PRIMARY_COLOR = '#3D5B81';
  const MAX_VALUE_CHART = 50;


  const { user } = useAuth();
  const { getUserBookings } = useBookings();
  const [userBookings, setUserBookings] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setIsLoaded(false);
        setError(null);
        const bookings = await getUserBookings();
        setUserBookings(bookings);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        setError('Gagal memuat data dashboard');
      } finally {
        setIsLoaded(true);
      }
    };

    if (user) {
      fetchUserBookings();
    }
  }, [user, getUserBookings]);

  // Calculate user stats
  const stats = {
    total: userBookings.length,
    pending: userBookings.filter(b => b.status === 'Menunggu').length,
    approved: userBookings.filter(b => b.status === 'Disetujui').length,
    rejected: userBookings.filter(b => b.status === 'Ditolak').length,
  };

  // Calculate room usage for user
  const roomStats = {};
  userBookings.forEach(booking => {
    const roomName = booking.room.name;
    roomStats[roomName] = (roomStats[roomName] || 0) + 1;
  });

  const roomStatsArray = Object.entries(roomStats).map(([name, count]) => ({ name, count }));

  // Prepare data for chart
  const usageDataAdmin = [
    { name: 'Co-Working A', value: roomStatsArray.find(r => r.name === 'Co-Working Space A')?.count || 0 },
    { name: 'Co-Working B', value: roomStatsArray.find(r => r.name === 'Co-Working Space B')?.count || 0 },
    { name: 'Co-Working C', value: roomStatsArray.find(r => r.name === 'Co-Working Space C')?.count || 0 },
    { name: 'Co-Working D', value: roomStatsArray.find(r => r.name === 'Co-Working Space D')?.count || 0 },
    { name: 'Co-Working E', value: roomStatsArray.find(r => r.name === 'Co-Working Space E')?.count || 0 },
    { name: 'Co-Working F', value: roomStatsArray.find(r => r.name === 'Co-Working Space F')?.count || 0 },
    { name: 'Co-Working EAST', value: roomStatsArray.find(r => r.name === 'Co-Working Space EAST')?.count || 0 },
  ];

  return (
    <div className="w-full space-y-6 min-h-full">

      {/* Header / Kartu Selamat Datang */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#3D5B81]">
          Welcome {user?.name || 'Pengguna'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Dashboard peminjaman ruangan Anda di Student Center.
        </p>
      </div>

      {/* IKHISAR PEMINJAMAN RUANGAN (STATS CARD) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {/* Card 1: Total Semua Reservasi (Warna Primer) */}
        <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 border-[#3D5B81] flex items-center justify-between`}>
          <div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Reservasi Anda</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{!isLoaded ? '...' : stats.total}</p>
          </div>
          <FaCalendarAlt className="text-3xl sm:text-4xl text-[#3D5B81] opacity-30" />
        </div>

        {/* Card 2: Menunggu Persetujuan (Warna Kuning) */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Menunggu Persetujuan</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{!isLoaded ? '...' : stats.pending}</p>
          </div>
          <FaUserClock className="text-3xl sm:text-4xl text-yellow-500 opacity-30" />
        </div>

        {/* Card 3: Disetujui (Warna Hijau) */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Reservasi Disetujui</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{!isLoaded ? '...' : stats.approved}</p>
          </div>
          <FaCheckCircle className="text-3xl sm:text-4xl text-green-500 opacity-30" />
        </div>
      </div>

{/* CHART STATISTIK PENGGUNAAN */}
<div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">

  {/* Header */}
  <div className="mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
    <div className="text-lg sm:text-xl font-bold text-[#3D5B81]">
      Statistik Penggunaan Ruangan Bulanan
    </div>
    <div className="flex items-center text-xs sm:text-sm text-gray-700 mt-2">
      <span className="w-2 h-2 bg-[#3D5B81] border border-white rounded-full mr-2"></span>
      Penggunaan di Bulan Terakhir
    </div>
  </div>

  {/* Chart Container */}
  <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
    <div className="min-w-[400px] sm:min-w-full">
      <div className="flex flex-row">

        {/* Label Ruangan (Y-axis) */}
        <div className="flex flex-col text-right pr-3 flex-shrink-0 space-y-2 sm:space-y-4 w-28 sm:w-32">
          {usageDataAdmin.map((item, index) => (
            <div
              key={index}
              className="h-6 flex items-center justify-end text-[10px] sm:text-sm text-gray-700 font-medium whitespace-nowrap"
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Chart Bar */}
        <div className="flex-grow">
          <div className="relative border-b border-gray-300">
            {/* Bar Data */}
            <div className="relative z-10 space-y-3 sm:space-y-4">
              {usageDataAdmin.map((item, index) => {
                const widthPercent = MAX_VALUE_CHART > 0 ? (item.value / MAX_VALUE_CHART) * 100 : 0;
                return (
                  <div key={index} className="flex items-center">
                    <div className="w-full h-5 sm:h-6 bg-gray-200 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-[#3D5B81] transition-all duration-700"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-semibold text-gray-700 min-w-[35px] sm:min-w-[50px] text-right">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Label X-axis */}
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2 pl-1">

          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default Dashboard;
