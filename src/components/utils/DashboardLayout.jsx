// file: src/components/DashboardLayout.jsx

import { Navigate } from 'react-router-dom';
import HeaderAdmin from './HeaderAdmin';
import HeaderMain from './HeaderMain';
import Sidebar from './Sidebar'; // Sidebar User
import SidebarAdmin from './SidebarAdmin'; // Sidebar Admin

const DashboardLayout = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    const userRole = user ? user.role : null;

    // Jika belum login, redirect ke halaman login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Tentukan Sidebar yang Aktif berdasarkan role
    const ActiveSidebar = userRole === 'admin' ? SidebarAdmin : Sidebar;
    const ActiveHeader = userRole === 'admin' ? HeaderAdmin : HeaderMain;

    return (
        <div className="flex flex-col min-h-screen bg-indigo-50">

            <ActiveHeader />

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