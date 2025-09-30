import './Dashboard.css';
import RoomUsageChart from './RoomUsageChart';

// Sumber tunggal (Source of Truth) untuk data ruangan (A sampai F dan EAST)
const ruanganData = [
  // Tambahkan field 'usage' untuk statistik chart
  { id: 1, name: 'Co-Working Space A', usage: 15, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 2, name: 'Co-Working Space B', usage: 22, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 3, name: 'Co-Working Space C', usage: 10, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 4, name: 'Co-Working Space D', usage: 5, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 5, name: 'Co-Working Space E', usage: 30, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] },
  { id: 6, name: 'Co-Working Space F', usage: 25, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] }, 
  { id: 7, name: 'Co-Working Space EAST', usage: 40, location: 'Gedung SC Lantai 3', times: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'] }, // Ini akan menjadi bar terpanjang
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
                
        {/* ================================================= */}
        {/* PENEMPATAN CHART DASHBOARD BARU DI ATAS LIST      */}
        {/* ================================================= */}
        <RoomUsageChart data={ruanganData} /> 
    </div>
  );
};

export default Dashboard;