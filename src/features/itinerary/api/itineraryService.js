// src/services/itineraryService.js
/**
 * Itinerary Service - Handles dynamic itinerary generation and management
 * Communicates with Express backend for itinerary operations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/**
 * Generate a personalized itinerary
 * @param {Object} itineraryData - Itinerary generation parameters
 * @returns {Promise<Object>} Generated itinerary
 */
export const generateItinerary = async (itineraryData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/itineraries/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(itineraryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

/**
 * Get all itineraries for the current user
 * @returns {Promise<Array>} List of user itineraries
 */
export const getUserItineraries = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/itineraries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.itineraries || [];
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    throw error;
  }
};

/**
 * Get a specific itinerary by ID
 * @param {string} itineraryId - Itinerary ID
 * @returns {Promise<Object>} Itinerary details
 */
export const getItineraryById = async (itineraryId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.itinerary;
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    throw error;
  }
};

/**
 * Update an existing itinerary
 * @param {string} itineraryId - Itinerary ID
 * @param {Object} updates - Updated itinerary data
 * @returns {Promise<Object>} Updated itinerary
 */
export const updateItinerary = async (itineraryId, updates) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.itinerary;
  } catch (error) {
    console.error("Error updating itinerary:", error);
    throw error;
  }
};

/**
 * Delete an itinerary
 * @param {string} itineraryId - Itinerary ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteItinerary = async (itineraryId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/itineraries/${itineraryId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    throw error;
  }
};

/**
 * Get destination recommendations based on user preferences
 * @param {Object} preferences - User preferences and trip details
 * @returns {Promise<Array>} Destination recommendations
 */
export const getDestinationRecommendations = async (preferences) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/api/ml/destination-recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw error;
  }
};