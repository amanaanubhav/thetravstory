/**
 * Chat Service - Handles all chat API calls
 * Communicates with Express backend proxy (/api/ml/*)
 *
 * IMPORTANT (Vite):
 * - Do NOT use `process.env` in browser code.
 * - Use `import.meta.env` and prefix variables with `VITE_`.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/**
 * Helper function to standardize fetch error handling
 */
async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");
    const message =
      (body && (body.error || body.message)) ||
      (typeof body === "string" && body) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return isJson ? res.json() : res.text();
}

/**
 * Send chat message and get AI response
 * @param {string} message - User message
 * @param {Object} tripContext - Current trip context
 * @returns {Promise<Object>} AI response with suggestions
 */
export const sendChatMessage = async (message, tripContext = null) => {
  try {
    const data = await fetchJson(`${API_BASE_URL}/api/ml/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        trip_context: tripContext,
      }),
    });
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

/**
 * Generate trip from chat message
 * @param {string} message - User message describing trip
 * @param {Object} personalityData - User personality data from quiz
 * @returns {Promise<Object>} Generated trip
 */
export const generateTripFromChat = async (message, personalityData = null) => {
  try {
    const data = await fetchJson(`${API_BASE_URL}/api/ml/generate-trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        personality_data: personalityData,
      }),
    });
    return data;
  } catch (error) {
    console.error("Error generating trip:", error);
    throw error;
  }
};

/**
 * Get travel suggestions based on user input
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} Travel suggestions
 */
export const getTravelSuggestions = async (preferences) => {
  try {
    const data = await fetchJson(`${API_BASE_URL}/api/ml/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    });
    return data;
  } catch (error) {
    console.error("Error getting suggestions:", error);
    throw error;
  }
};

export default {
  sendChatMessage,
  generateTripFromChat,
  getTravelSuggestions,
};