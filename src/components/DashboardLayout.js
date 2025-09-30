// src/components/DashboardLayout.js

import './DashboardLayout.css';
import HeaderMain from './HeaderMain';
import Sidebar from './Sidebar';

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