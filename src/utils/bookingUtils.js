// Utility functions for managing bookings via API
import { useEffect, useState } from 'react';
import {
  createBooking as apiCreateBooking,
  getAllBookings as apiGetAllBookings,
  getBookingStats as apiGetBookingStats,
  getUserBookings as apiGetUserBookings,
  updateBookingStatus as apiUpdateBookingStatus,
} from '../api/bookings';

// Custom hook for managing bookings state
export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Load bookings on mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoaded(false);
      setError(null);
      // This will be called by individual components based on user role
      // For now, set empty array
      setBookings([]);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError(error.message);
    } finally {
      setIsLoaded(true);
    }
  };

  // Add booking via API
  const addBooking = async (bookingData) => {
    try {
      const newBooking = await apiCreateBooking(bookingData);
      // Optionally refresh bookings list
      return newBooking;
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  };

  // Update booking status via API
  const updateBookingStatus = async (id, status) => {
    try {
      await apiUpdateBookingStatus(id, status);
      // Refresh bookings if needed
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  };

  // Get user bookings via API
  const getUserBookings = async () => {
    try {
      const userBookings = await apiGetUserBookings();
      return userBookings;
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  };

  // Get all bookings via API (admin)
  const getAllBookings = async () => {
    try {
      const allBookings = await apiGetAllBookings();
      setBookings(allBookings);
      return allBookings;
    } catch (error) {
      console.error('Error getting all bookings:', error);
      throw error;
    }
  };

  // Get booking stats via API (admin)
  const getBookingStats = async () => {
    try {
      const stats = await apiGetBookingStats();
      return stats;
    } catch (error) {
      console.error('Error getting booking stats:', error);
      throw error;
    }
  };

  return {
    bookings,
    isLoaded,
    error,
    addBooking,
    updateBookingStatus,
    getUserBookings,
    getAllBookings,
    getBookingStats,
    loadBookings,
  };
};
