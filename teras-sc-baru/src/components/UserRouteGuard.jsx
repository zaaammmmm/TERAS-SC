// file: src/components/UserRouteGuard.jsx (FILE BARU)

import React from 'react';
import { Navigate } from 'react-router-dom';

const UserRouteGuard = ({ children }) => {
    // Cek Status Login
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        alert('Anda harus login untuk mengakses halaman ini.');
        return <Navigate to="/login" replace />;
    }

    // Jika sudah login (Admin atau User), izinkan akses
    return children;
};

export default UserRouteGuard;