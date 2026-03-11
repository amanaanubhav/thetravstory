// src/services/mlService.js
/**
 * ML Service - Handles all ML API calls
 * Communicates with Express backend which proxies to Python ML API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Analyze personality quiz answers
 * @param {Object} answers - Quiz answers object
 * @returns {Promise<Object>} Personality analysis result
 */
export const analyzePersonality = async (answers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ml/personality-analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing personality:", error);
    throw error;
  }
};

/**
 * Get trip recommendations based on personality and trip details
 * @param {Object} tripDetails - Trip details including personality answers
 * @returns {Promise<Object>} Trip recommendation result
 */
export const getTripRecommendation = async (tripDetails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ml/trip-recommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripDetails),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting trip recommendation:", error);
    throw error;
  }
};

/**
 * Check ML API health
 * @returns {Promise<Object>} Health status
 */
export const checkMLHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ml/health`, {
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
    console.error("Error checking ML health:", error);
    throw error;
  }
};

export default {
  analyzePersonality,
  getTripRecommendation,
  checkMLHealth,
};
