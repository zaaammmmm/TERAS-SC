import './Dashboard.css';
import Header from './Header';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header isLandingPage={false} />

      <div className="dashboard-content">
        <h1>Dashboard Penggunaan Ruangan</h1>
        </div>
    </div>
  );
};

export default Dashboard;