// src/services/authService.js
/**
 * Auth Service - Handles authentication API calls
 * Communicates with Express backend auth routes
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Registration result with user and token
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Login result with user and token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout result
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('authToken');

    if (token) {
      // Call logout endpoint (optional, mainly for server-side cleanup)
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    // Clear local storage
    localStorage.removeItem('authToken');

    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear local storage even if API call fails
    localStorage.removeItem('authToken');
    throw error;
  }
};

/**
 * Update user preferences and quiz answers
 * @param {Object} preferences - User preferences data
 * @param {Object} preferences.travelPreferences - Travel preferences with scores
 * @param {Object} preferences.quizAnswers - Raw quiz answers
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserPreferences = async (preferences) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/preferences`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Update preferences error:", error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Whether user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Get stored auth token
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  isAuthenticated,
  getAuthToken,
};