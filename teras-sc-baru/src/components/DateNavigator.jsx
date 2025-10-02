// file: src/components/DateNavigator.jsx

import React from 'react';
import { FaCalendarAlt, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

// Format tanggal menjadi "dd/mm/yyyy"
const formatDate = (date) => {
    // Menggunakan local date string untuk menghindari masalah zona waktu saat format
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
};

// Format hari menjadi "Kamis"
const formatDay = (date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
};

const DateNavigator = ({ selectedDate, setSelectedDate }) => {
    const PRIMARY_COLOR = '#3D5B81';

    const handleDateChange = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    return (
        // Mengganti justify-between dengan w-full dan p-0, lalu padding di dalam.
        <div className="w-full"> 
            
            {/* Membungkus Judul dan Kontrol dalam satu div untuk layout yang terpisah */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border border-gray-200">
            
                {/* Judul Kontrol Tanggal (Kiri) */}
                <h1 className="text-2xl font-bold text-[#3D5B81] max-w-sm max-md:text-xl">
                    Data Penggunaan Ruangan
                </h1>

                {/* Kontrol Navigasi Tanggal (Kanan - yang Anda ingin sentralkan) */}
                <div className="flex items-center space-x-3">
                    
                    {/* Tombol Kiri (Kembali) */}
                    <button 
                        onClick={() => handleDateChange(-1)}
                        className={`p-3 rounded-xl bg-[#3D5B81] text-white transition-colors hover:bg-[#2e4764] shadow-md`}
                    >
                        <FaAngleLeft className="w-5 h-5" />
                    </button>
                    
                    {/* Nama Hari */}
                    <div className="text-xl font-semibold text-gray-800 w-24 text-center">
                        {formatDay(selectedDate)}
                    </div>

                    {/* Input Tanggal */}
                    <div 
                        className={`flex items-center border border-gray-300 rounded-lg p-3 text-lg font-medium text-gray-700 bg-white shadow-inner`}
                        style={{ minWidth: '150px' }}
                    >
                        <span className="mr-2">{formatDate(selectedDate)}</span>
                        <FaCalendarAlt className="text-gray-500 w-5 h-5" />
                    </div>
                    
                    {/* Tombol Kanan (Maju) */}
                    <button 
                        onClick={() => handleDateChange(1)}
                        className={`p-3 rounded-xl bg-[#3D5B81] text-white transition-colors hover:bg-[#2e4764] shadow-md`}
                    >
                        <FaAngleRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateNavigator;