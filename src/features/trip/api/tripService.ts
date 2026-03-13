// src/services/tripService.js
/**
 * Trip Service - Handles all trip management
 * CRUD operations for trips
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Create a new trip
 * @param {Object} tripData - Trip data
 * @returns {Promise<Object>} Created trip
 */
export const createTrip = async (tripData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

/**
 * Get all trips for user
 * @returns {Promise<Array>} List of trips
 */
export const getAllTrips = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting trips:", error);
    throw error;
  }
};

/**
 * Get single trip by ID
 * @param {string} tripId - Trip ID
 * @returns {Promise<Object>} Trip data
 */
export const getTripById = async (tripId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting trip:", error);
    throw error;
  }
};

/**
 * Update trip
 * @param {string} tripId - Trip ID
 * @param {Object} tripData - Updated trip data
 * @returns {Promise<Object>} Updated trip
 */
export const updateTrip = async (tripId, tripData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

/**
 * Delete trip
 * @param {string} tripId - Trip ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTrip = async (tripId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};

/**
 * Add activity to trip
 * @param {string} tripId - Trip ID
 * @param {number} dayIndex - Day index
 * @param {Object} activity - Activity data
 * @returns {Promise<Object>} Updated trip
 */
export const addActivityToTrip = async (tripId, dayIndex, activity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day_index: dayIndex,
        activity,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding activity:", error);
    throw error;
  }
};

/**
 * Remove activity from trip
 * @param {string} tripId - Trip ID
 * @param {number} dayIndex - Day index
 * @param {string} activityId - Activity ID
 * @returns {Promise<Object>} Updated trip
 */
export const removeActivityFromTrip = async (tripId, dayIndex, activityId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/trips/${tripId}/activities/${activityId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day_index: dayIndex,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing activity:", error);
    throw error;
  }
};

export default {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addActivityToTrip,
  removeActivityFromTrip,
};
