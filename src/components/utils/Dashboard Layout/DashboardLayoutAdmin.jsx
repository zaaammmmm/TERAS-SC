// src/components/DashboardLayout.js

import HeaderMain from '../Header/HeaderMain';
import SidebarAdmin from '../sidebar/SidebarAdmin';
import './DashboardLayout.css';

const DashboardLayoutAdmin = ({ children }) => {
    return (
        <div className="dashboard-layout">
            {/* Header harus selalu ada di atas */}
            <HeaderMain isLandingPage={false} /> 
            
            <div className="dashboard-main-content">
                <SidebarAdmin />
                <main className="dashboard-content-area">
                    {children} 
                </main>
            </div>
        </div>
    );
};

export default DashboardLayoutAdmin;