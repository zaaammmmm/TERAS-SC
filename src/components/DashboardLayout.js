// src/components/DashboardLayout.js

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './DashboardLayout.css'; 

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            {/* Header harus selalu ada di atas */}
            <Header isLandingPage={false} /> 
            
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