// file: src/components/DashboardLayout.jsx

import React from 'react';
import HeaderMain from './HeaderMain'; 
import Sidebar from './Sidebar'; // Sidebar User
import SidebarAdmin from './SidebarAdmin'; // Sidebar Admin
import { Navigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const userRole = sessionStorage.getItem('userRole'); 
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    // Jika belum login, redirect ke halaman login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Tentukan Sidebar yang Aktif berdasarkan role
    const ActiveSidebar = userRole === 'admin' ? SidebarAdmin : Sidebar;

    return (
        <div className="flex flex-col min-h-screen bg-indigo-50">
            
            <HeaderMain />
            
            <div className="flex flex-grow pt-[80px]"> 
                
                {/* KONDISIONAL SIDEBAR */}
                <ActiveSidebar />
                
                <main className="flex-grow p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;