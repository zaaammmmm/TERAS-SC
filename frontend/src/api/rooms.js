const API_BASE_URL = "https://backend-terassc.vercel.app"; // Adjust if needed

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get all rooms
export const getAllRooms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch rooms");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

// Get single room by ID
export const getRoomById = async (roomId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error;
  }
};

// Create a new room (admin only)
export const createRoom = async (roomData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create room");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

// Update a room (admin only)
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update room");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

// Delete a room (admin only)
export const deleteRoom = async (roomId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete room");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};
