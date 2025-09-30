// src/components/RoomUsageChart.js (Kode UTUH - Diagram Batang)

import React from 'react';
import './RoomUsageChart.css';

const RoomUsageChart = ({ data }) => {
  // Mencari nilai maksimum penggunaan untuk menentukan skala bar
  const maxUsage = data.reduce((max, item) => Math.max(max, item.usage), 0);

  return (
    <div className="usage-chart-card">
      <h3 className="chart-title">Statistik Penggunaan Ruangan (Bulan Ini)</h3>
      <p className="chart-subtitle">Total reservasi per ruangan untuk periode ini.</p>

      <div className="chart-bars-container">
        {data
          // Sortir data dari yang paling banyak digunakan (visualisasi terbaik)
          .sort((a, b) => b.usage - a.usage) 
          .map((item) => (
            <div key={item.id} className="chart-bar-item">
              
              {/* Nama Ruangan */}
              <div className="bar-labels">
                <span className="room-name">{item.name}</span>
              </div>
              
              {/* Bar (Batang) dan Angka */}
              <div className="bar-representation">
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill" 
                    // Hitung lebar bar berdasarkan persentase maksimum penggunaan
                    style={{ width: `${(item.usage / maxUsage) * 100}%` }}
                  ></div>
                </div>
                {/* Angka Reservasi di sebelah kanan bar */}
                <span className="usage-count-value">{item.usage}</span> 
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoomUsageChart;