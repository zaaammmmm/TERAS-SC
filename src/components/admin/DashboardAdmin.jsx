// file: src/components/DashboardAdmin.jsx

import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaUserClock } from 'react-icons/fa';
import { useBookings } from '../../contexts/BookingContext';

const DashboardAdmin = () => {
    const PRIMARY_COLOR = '#3D5B81';
    const MAX_VALUE_CHART = 1000;
    const Y_LABELS = ['0', '200', '400', '600', '800', '1000'];

    const { getBookingStats } = useBookings();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, roomStats: [] });
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoaded(false);
                setError(null);
                const bookingStats = await getBookingStats();
                setStats(bookingStats);
            } catch (error) {
                console.error('Error fetching booking stats:', error);
                setError('Gagal memuat statistik');
            } finally {
                setIsLoaded(true);
            }
        };

        fetchStats();
    }, [getBookingStats]);

    // Prepare data for chart
    const usageDataAdmin = [
        { name: 'Co-Working A', value: stats.roomStats.find(r => r.name === 'Co-Working Space A')?.count || 0, max: MAX_VALUE_CHART },
        { name: 'Co-Working B', value: stats.roomStats.find(r => r.name === 'Co-Working Space B')?.count || 0, max: MAX_VALUE_CHART },
        { name: 'Co-Working C', value: stats.roomStats.find(r => r.name === 'Co-Working Space C')?.count || 0, max: MAX_VALUE_CHART },
        { name: 'Co-Working D', value: stats.roomStats.find(r => r.name === 'Co-Working Space D')?.count || 0, max: MAX_VALUE_CHART },
        { name: 'Co-Working E', value: stats.roomStats.find(r => r.name === 'Co-Working Space E')?.count || 0, max: MAX_VALUE_CHART },
        { name: 'Co-Working F', value: stats.roomStats.find(r => r.name === 'Co-Working Space F')?.count || 0, max: MAX_VALUE_CHART },
        { name: 'Co-Working EAST', value: stats.roomStats.find(r => r.name === 'Co-Working Space EAST')?.count || 0, max: MAX_VALUE_CHART },
    ];
    
    return (
        <div className="w-full space-y-6">
            
            {/* Header / Kartu Selamat Datang */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h1 className="text-4xl font-bold text-[#3D5B81]">
                    Dashboard Administrator
                </h1>
                <p className="text-gray-500 mt-1">
                    Dashboard peminjaman ruangan Student Center.
                </p>
            </div>

            {/* IKHISAR PEMINJAMAN RUANGAN (STATS CARD) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Card 1: Total Semua Reservasi (Warna Primer) */}
                <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#3D5B81] flex items-center justify-between`}>
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Semua Reservasi</h3>
                        <p className="text-3xl font-bold text-gray-800">{!isLoaded ? '...' : stats.total}</p>
                    </div>
                    <FaCalendarAlt className="text-4xl text-[#3D5B81] opacity-30" />
                </div>

                {/* Card 2: Menunggu Persetujuan (Warna Kuning) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Reservasi Perlu Dicek</h3>
                        <p className="text-3xl font-bold text-gray-800">{!isLoaded ? '...' : stats.pending}</p>
                    </div>
                    <FaUserClock className="text-4xl text-yellow-500 opacity-30" />
                </div>

                {/* Card 3: Ruangan Paling Ramai (Warna Hijau) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Ruangan Paling Ramai</h3>
                        <p className="text-xl font-bold text-gray-800">
                            {!isLoaded ? '...' : (stats.roomStats.length > 0 ? stats.roomStats.reduce((prev, current) => (prev.count > current.count) ? prev : current).name : 'N/A')}
                        </p>
                    </div>
                    <FaChartBar className="text-4xl text-green-500 opacity-30" />
                </div>
            </div>


            {/* CHART STATISTIK PENGGUNAAN */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                
                <div className="mb-6 border-b pb-4">
                    <div className="text-xl font-bold text-[#3D5B81]">Statistik Penggunaan Ruangan Bulanan</div>
                    <div className="flex items-center text-sm text-gray-700 mt-2">
                        <span className={`w-2 h-2 bg-[#3D5B81] border border-white rounded-full mr-2`}></span>
                        Penggunaan di Bulan Oktober
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="flex min-w-[600px]">
                        <div className="flex flex-col text-right pt-0 pr-3 flex-shrink-0 space-y-4 w-40">
                            {usageDataAdmin.map((item, index) => (
                                <div key={index} className="h-6 flex items-center justify-end text-sm text-gray-700 font-medium">
                                    {item.name}
                                </div>
                            ))}
                        </div>

                        <div className="flex-grow">
                            <div className="relative border-b border-gray-300">
                                <div className="absolute inset-0 flex justify-between">
                                    {Y_LABELS.slice(1).map((_, index) => (
                                        <div
                                            key={index}
                                            className="h-full border-r border-gray-200 last:border-r-0"
                                            style={{ width: `${100 / (Y_LABELS.length - 1)}%` }}
                                        />
                                    ))}
                                </div>

                                <div className="relative z-10 space-y-4">
                                    {usageDataAdmin.map((item, index) => {
                                        const widthPercent = (item.value / MAX_VALUE_CHART) * 100;
                                        return (
                                            <div key={index} className="h-6 flex items-center">
                                                <div className="w-full h-6 bg-gray-200 rounded-sm overflow-hidden">
                                                    <div
                                                        // Bar Fill menggunakan warna Primary
                                                        className={`h-full bg-[#3D5B81] transition-all duration-700`}
                                                        style={{ width: `${widthPercent}%` }}
                                                    ></div>
                                                </div>
                                                <span className="ml-3 text-base font-semibold text-gray-700 min-w-[50px] text-right">
                                                    {item.value}
                                                </span>
                                            </div>
                                        );
                                    })}
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
