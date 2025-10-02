// file: src/components/DashboardAdmin.jsx

import React from 'react';
import { FaChartBar, FaCalendarAlt, FaUserClock, FaCalendarCheck, FaRegCalendarMinus } from 'react-icons/fa';

// Data Dummy untuk Chart Administrasi 
const usageDataAdmin = [
    { name: 'Co-Working A', value: 996, max: 1000 },
    { name: 'Co-Working B', value: 496, max: 1000 },
    { name: 'Co-Working C', value: 154, max: 1000 },
    { name: 'Co-Working D', value: 787, max: 1000 },
    { name: 'Co-Working E', value: 915, max: 1000 },
    { name: 'Co-Working F', value: 143, max: 1000 },
    { name: 'Co-Working G', value: 834, max: 1000 },
    { name: 'Co-Working H', value: 402, max: 1000 },
];

const DashboardAdmin = () => {
    const PRIMARY_COLOR = '#3D5B81';
    const MAX_VALUE_CHART = 1000;
    const Y_LABELS = ['0', '200', '400', '600', '800', '1000']; 
    
    return (
        <div className="w-full space-y-6">
            
            {/* Header / Kartu Selamat Datang */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h1 className="text-4xl font-bold text-[#3D5B81]">
                    DASHBOARD ADMINISTRATOR
                </h1>
                <p className="text-gray-500 mt-1">
                    Ikhtisar peminjaman ruangan Student Center.
                </p>
            </div>

            {/* IKHISAR PEMINJAMAN RUANGAN (STATS CARD) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Card 1: Total Semua Reservasi (Warna Primer) */}
                <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#3D5B81] flex items-center justify-between`}>
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Semua Reservasi</h3>
                        <p className="text-3xl font-bold text-gray-800">187</p>
                    </div>
                    <FaCalendarAlt className="text-4xl text-[#3D5B81] opacity-30" />
                </div>
                
                {/* Card 2: Menunggu Persetujuan (Warna Kuning) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Reservasi Perlu Dicek</h3>
                        <p className="text-3xl font-bold text-gray-800">15</p>
                    </div>
                    <FaUserClock className="text-4xl text-yellow-500 opacity-30" />
                </div>

                {/* Card 3: Ruangan Paling Ramai (Warna Hijau) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Ruangan Paling Ramai</h3>
                        <p className="text-xl font-bold text-gray-800">Co-Working E</p>
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
                        Penggunaan di Bulan September
                    </div>
                </div>

                <div className="flex">
                    <div className="flex flex-col text-right justify-between pt-1 pr-3 flex-shrink-0">
                        {usageDataAdmin.map((item, index) => (
                            <div key={index} className="h-10 flex items-center justify-end text-xs text-gray-700 font-medium">
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

                            <div className="relative z-10 space-y-1">
                                {usageDataAdmin.map((item, index) => {
                                    const widthPercent = (item.value / MAX_VALUE_CHART) * 100;
                                    return (
                                        <div key={index} className="h-10 flex items-center">
                                            <div className="w-full h-4 bg-gray-200 rounded-sm overflow-hidden">
                                                <div 
                                                    // Bar Fill menggunakan warna Primary
                                                    className={`h-full bg-[#3D5B81] transition-all duration-700`} 
                                                    style={{ width: `${widthPercent}%` }}
                                                ></div>
                                            </div>
                                            <span className="ml-3 text-xs font-semibold text-gray-700 min-w-[40px] text-right">
                                                {item.value}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                        
                        <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium pl-14 pr-1">
                            {Y_LABELS.map((label, index) => (
                                <div key={index} className="text-center w-4">
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;
