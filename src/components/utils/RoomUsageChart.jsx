// file: src/components/RoomUsageChart.jsx

import React from 'react';
// import './RoomUsageChart.css'; // HAPUS - Menggunakan kelas Tailwind

const RoomUsageChart = ({ data }) => {
  const maxUsage = data.reduce((max, item) => Math.max(max, item.usage), 0);
  
  return (
    // .usage-chart-card -> bg-white p-8 rounded-xl shadow-lg border
    <div className="bg-white p-8 rounded-xl shadow-lg shadow-black/5 mb-8 border border-gray-200">
      
      {/* .chart-title */}
      <h3 className="text-[#3D5B81] text-2xl font-bold mb-1">
        Statistik Penggunaan Ruangan (Bulan Ini)
      </h3>
      
      {/* .chart-subtitle */}
      <p className="text-gray-600 mb-6 text-base">
        Total reservasi per ruangan untuk periode ini.
      </p>

      {/* .chart-bars-container -> flex-col gap-4 */}
      <div className="flex flex-col gap-4">
        {data
          .sort((a, b) => b.usage - a.usage) 
          .map((item) => (
            // .chart-bar-item -> flex-col
            <div key={item.id} className="flex flex-col">
              
              {/* Nama Ruangan */}
              <div className="text-sm mb-1">
                <span className="font-semibold text-gray-800">{item.name}</span>
              </div>
              
              {/* .bar-representation -> flex items-center gap-2 */}
              <div className="flex items-center gap-2">
                
                {/* .bar-wrapper -> flex-grow bg-blue-100 h-5 rounded-sm overflow-hidden */}
                <div className="flex-grow bg-blue-100 h-5 rounded-sm overflow-hidden">
                  <div 
                    // .bar-fill -> h-full bg-[#3D5B81] transition-width
                    className="h-full bg-[#3D5B81] rounded-sm transition-all duration-700 ease-out" 
                    style={{ width: `${(item.usage / maxUsage) * 100}%` }}
                  ></div>
                </div>
                
                {/* .usage-count-value */}
                <span className="font-bold text-[#3D5B81] min-w-[30px] text-right text-sm">
                  {item.usage}
                </span> 
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoomUsageChart;