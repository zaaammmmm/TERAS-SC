// src/components/DashboardLayout.js

import HeaderMain from '../Header/HeaderMain';
import Sidebar from '../sidebar/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            {/* Header harus selalu ada di atas */}
            <HeaderMain isLandingPage={false} /> 
            
            <div className="dashboard-main-content">
                <Sidebar />
                <main className="dashboard-content-area">
                    {children} 
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;