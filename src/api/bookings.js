// src/api/bookings.js
const API_BASE_URL = 'http://localhost:5000'; // Adjust if needed

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get user's bookings (TETAP ADA)
export const getUserBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/mybookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Get all bookings (Authenticated users - for general viewing)
export const getGlobalBookings = async () => { // Perbaikan: Menambah 'export'
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/global`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch global bookings');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching global bookings:', error);
        throw error;
    }
};

// Get all bookings (admin only)
export const getAllBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch all bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

// Get booking stats (admin only)
export const getBookingStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch booking stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw error;
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update booking status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};