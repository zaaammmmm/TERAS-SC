// file: src/components/AdminRouteGuard.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRouteGuard = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const userRole = sessionStorage.getItem('userRole');

    if (!isAuthenticated) {
        alert('Anda harus login untuk mengakses halaman ini.');
        return <Navigate to="/login" replace />;
    }

    if (userRole !== 'admin') {
        alert('Akses ditolak. Hanya Administrator yang dapat mengakses halaman ini.');
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRouteGuard;