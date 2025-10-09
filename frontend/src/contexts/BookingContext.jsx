// BookingContext.jsx

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
// Import fungsi API yang diperbarui
import {
    createBooking as apiCreateBooking,
    getAllBookings as apiGetAllBookings, // GET /bookings/global (Auth-Only)
    getBookingStats as apiGetBookingStats, // GET /bookings (Admin-Only)
    getGlobalBookings as apiGetGlobalBookings,
    getUserBookings as apiGetUserBookings, // GET /mybookings
    updateBookingStatus as apiUpdateBookingStatus,
} from '../api/bookings';

const BookingContext = createContext();

export const useBookings = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBookings must be used within a BookingProvider');
    }
    return context;
};

export const BookingProvider = ({ children }) => {
    const { user, token } = useAuth();
    
    const [bookings, setBookings] = useState([]); 
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const loadAllBookings = useCallback(async () => {
        try {
            if (!user || !token) {
                setBookings([]);
                return;
            }

            let fetchedBookings;

            if (user.role === 'admin') {
                // Admin: Menggunakan endpoint penuh (untuk CRUD dan dashboard)
                fetchedBookings = await apiGetAllBookings(token);
            } else {
                // User Biasa: Menggunakan endpoint global yang baru
                fetchedBookings = await apiGetGlobalBookings(token);
            }

            setBookings(fetchedBookings);
        } catch (err) {
            console.error('Error getting all bookings:', err);
            setError(err.message);
        }
    }, [user, token]);

    // Muat semua booking saat user login atau rolnya berubah
    useEffect(() => {
        setIsLoaded(false);
        setError(null);

        if (user && token) {
            loadAllBookings();
        }

        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, [user, token, loadAllBookings]);


    // Dipakai oleh FormPeminjaman.jsx
    const addBooking = async (bookingData) => {
        try {
            const newBooking = await apiCreateBooking(bookingData, token);
            loadAllBookings();
            return newBooking;
        } catch (err) {
            console.error('Error adding booking:', err);
            throw err;
        }
    };
    
    // Dipakai oleh RiwayatPeminjaman.jsx dan Dashboard.jsx (TETAP ADA)
    const getUserBookings = async () => {
        try {
            const userBookings = await apiGetUserBookings(token);
            return userBookings;
        } catch (err) {
            console.error('Error getting user bookings:', err);
            throw err;
        }
    };

    // Dipakai oleh Admin
    const updateBookingStatus = async (id, status) => {
        try {
            const updatedBooking = await apiUpdateBookingStatus(id, status, token);
            loadAllBookings();
            return updatedBooking;
        } catch (err) {
            console.error('Error updating booking status:', err);
            throw err;
        }
    };

    // Dipakai oleh Admin (untuk mendapatkan statistik)
    const getBookingStats = async () => {
        try {
            const stats = await apiGetBookingStats(token);
            return stats;
        } catch (err) {
            console.error('Error getting booking stats:', err);
            throw err;
        }
    };


    const value = {
        bookings,
        isLoaded,
        error,
        addBooking,
        getUserBookings,
        getBookingStats, 
        updateBookingStatus, 
        loadAllBookings, 
        // Ekspos fungsi API Admin agar DetailRooms dapat melakukan fetch lokal yang diperlukan
        getAllBookings: apiGetAllBookings 
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};