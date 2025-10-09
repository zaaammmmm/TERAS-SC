import { useEffect, useState } from 'react';
// FIX: Replace 'react-icons/fa' with 'lucide-react'
import { BarChart3, CalendarCheck, Clock } from 'lucide-react';
// Asumsi path ini benar, jika tidak, perlu di sesuaikan
import { useBookings } from '../../contexts/BookingContext';

const DashboardAdmin = () => {
    const PRIMARY_COLOR = '#3D5B81';
    const MAX_VALUE_CHART = 1000;

    const { getBookingStats } = useBookings();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, roomStats: [] });
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoaded(false);
                setError(null);
                // Asumsi getBookingStats di definisikan di context, tapi ini hanya mockup data untuk chart
                const mockStats = {
                    total: 120,
                    pending: 15,
                    approved: 80,
                    rejected: 25,
                    roomStats: [
                        { name: 'Co-Working Space A', count: 500 },
                        { name: 'Co-Working Space B', count: 750 },
                        { name: 'Co-Working Space C', count: 300 },
                        { name: 'Co-Working Space D', count: 650 },
                        { name: 'Co-Working Space E', count: 900 },
                        { name: 'Co-Working Space F', count: 400 },
                        { name: 'Co-Working Space EAST', count: 800 },
                    ]
                };
                
                // Jika getBookingStats tidak tersedia, gunakan mock data
                // NOTE: Mengganti logika jika `getBookingStats` tidak didefinisikan untuk menghindari error runtime
                if (typeof getBookingStats === 'function') {
                    const bookingStats = await getBookingStats();
                    setStats(bookingStats);
                } else {
                    setStats(mockStats);
                }

            } catch (error) {
                console.error('Error fetching booking stats:', error);
                setError('Gagal memuat statistik');
            } finally {
                setIsLoaded(true);
            }
        };

        fetchStats();
    }, [getBookingStats]);

    // Prepare data for chart (Memastikan data roomStats tersedia)
    const roomNames = [
        'Co-Working Space A', 'Co-Working Space B', 'Co-Working Space C', 
        'Co-Working Space D', 'Co-Working Space E', 'Co-Working Space F', 
        'Co-Working Space EAST'
    ];

    const usageDataAdmin = roomNames.map(name => ({
        name: name.replace('Co-Working ', ''), // Nama label di chart lebih pendek
        value: stats.roomStats.find(r => r.name === name)?.count || 0, 
        max: MAX_VALUE_CHART 
    }));
    
    // Mencari ruangan paling ramai
    const busiestRoom = isLoaded && stats.roomStats.length > 0 
        ? stats.roomStats.reduce((prev, current) => (prev.count > current.count) ? prev : current).name 
        : 'N/A';

    return (
        <div className="w-full space-y-6 p-4 sm:p-6 md:p-8 min-h-full">
            
            {/* Header / Kartu Selamat Datang */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3D5B81]">
                    Dashboard Administrator
                </h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Ikhtisar dan statistik peminjaman ruangan Student Center.
                </p>
            </div>

            {/* IKHISAR PEMINJAMAN RUANGAN (STATS CARD) - Layout Responsif Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Card 1: Total Semua Reservasi */}
                <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#3D5B81] flex items-center justify-between`}>
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Semua Reservasi</h3>
                        <p className="text-3xl font-bold text-gray-800">{!isLoaded ? '...' : stats.total}</p>
                    </div>
                    <CalendarCheck className="w-10 h-10 text-[#3D5B81] opacity-30" />
                </div>

                {/* Card 2: Menunggu Persetujuan */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Reservasi Perlu Dicek</h3>
                        <p className="text-3xl font-bold text-gray-800">{!isLoaded ? '...' : stats.pending}</p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-500 opacity-30" />
                </div>

                {/* Card 3: Ruangan Paling Ramai */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1">
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Ruangan Paling Ramai</h3>
                        <p className="text-xl font-bold text-gray-800">
                            {!isLoaded ? '...' : busiestRoom}
                        </p>
                    </div>
                    <BarChart3 className="w-10 h-10 text-green-500 opacity-30" />
                </div>
            </div>


            {/* CHART STATISTIK PENGGUNAAN */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                
                <div className="mb-4 sm:mb-6 border-b pb-4">
                    <div className="text-lg sm:text-xl font-bold text-[#3D5B81]">Statistik Penggunaan Ruangan Bulanan</div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-700 mt-2">
                        <span className={`w-2 h-2 bg-[#3D5B81] border border-white rounded-full mr-2`}></span>
                        Penggunaan di Bulan Terakhir
                    </div>
                </div>

                <div className="w-full overflow-x-auto"> {/* Tambahkan overflow-x-auto untuk responsif chart */}
                    <div className="min-w-[400px]"> {/* Min width untuk menjaga chart tidak terlalu kecil di mobile */}
                        <div className="flex flex-row">
                            {/* Label Y-axis (Nama Ruangan) */}
                            <div className="flex flex-col text-right pt-0 pr-3 flex-shrink-0 space-y-4 w-28 sm:w-32">
                                {usageDataAdmin.map((item, index) => (
                                    <div key={index} className="h-6 flex items-center justify-end text-xs sm:text-sm text-gray-700 font-medium">
                                        {item.name}
                                    </div>
                                ))}
                            </div>

                            {/* Chart Bar */}
                            <div className="flex-grow">
                                <div className="relative border-b border-gray-300">
                                    {/* Garis Grid Vertikal */}
                                    <div className="absolute inset-0 flex justify-between">
 
                                    </div>

                                    {/* Bar Data */}
                                    <div className="relative z-10 space-y-4">
                                        {usageDataAdmin.map((item, index) => {
                                            // Handle case where MAX_VALUE_CHART is 0 or value is negative
                                            const widthPercent = MAX_VALUE_CHART > 0 ? (item.value / MAX_VALUE_CHART) * 100 : 0;
                                            return (
                                                <div key={index} className="h-6 flex items-center">
                                                    <div className="w-full h-6 bg-gray-200 rounded-sm overflow-hidden">
                                                        <div
                                                            className={`h-full bg-[#3D5B81] transition-all duration-700`}
                                                            style={{ width: `${widthPercent}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="ml-3 text-sm sm:text-base font-semibold text-gray-700 min-w-[40px] sm:min-w-[50px] text-right">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Label X-axis (Angka) */}
                                <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1 pl-1">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
