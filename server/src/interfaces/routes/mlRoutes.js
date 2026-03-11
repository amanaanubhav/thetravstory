const express = require('express');
const axios = require('axios');

const router = express.Router();
const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

/**
 * GET /api/ml/health
 * Health check for ML API
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, { timeout: 5000 });
    res.json(response.data);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'ML API is not responding',
      details: error.message
    });
  }
});

/**
 * POST /api/ml/personality-analysis
 * Forward personality quiz answers to ML API
 */
router.post('/personality-analysis', async (req, res) => {
  try {
    const { spend_time, curiosity, recharge, travel_pref } = req.body;

    // Validate required fields
    if (!spend_time || !curiosity || !recharge || !travel_pref) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: spend_time, curiosity, recharge, travel_pref'
      });
    }

    // Call ML API
    const response = await axios.post(
      `${ML_API_URL}/api/personality-analysis`,
      {
        spend_time,
        curiosity,
        recharge,
        travel_pref
      },
      {
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('ML API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze personality',
      details: error.message
    });
  }
});

/**
 * POST /api/ml/trip-recommendation
 * Get trip recommendations based on personality and trip details
 */
router.post('/trip-recommendation', async (req, res) => {
  try {
    const {
      personality_answers,
      gender,
      trip_budget,
      duration,
      number_of_people,
      weather
    } = req.body;

    // Validate required fields
    if (!personality_answers) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: personality_answers'
      });
    }

    // Call ML API
    const response = await axios.post(
      `${ML_API_URL}/api/trip-recommendation`,
      {
        personality_answers,
        gender: gender || 'prefer_not_to_say',
        trip_budget: trip_budget || 1000,
        duration: duration || 7,
        number_of_people: number_of_people || 2,
        weather: weather || 'any'
      },
      {
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('ML API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get trip recommendation',
      details: error.message
    });
  }
});

/**
 * POST /api/ml/chat
 * Handle chat messages - forward to ML API or provide fallback response
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, trip_context } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    // Try to call ML API chat endpoint
    try {
      const response = await axios.post(
        `${ML_API_URL}/api/chat`,
        {
          message,
          trip_context: trip_context || null
        },
        {
          headers: {
            'Authorization': req.headers.authorization || '',
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      res.json(response.data);
    } catch (mlError) {
      // Fallback response if ML API doesn't have chat endpoint
      console.warn('ML API chat endpoint not available, using fallback:', mlError.message);
      
      res.json({
        success: true,
        response: `I received your message: "${message}". Please complete the personality quiz first to get personalized travel recommendations!`,
        source: 'fallback'
      });
    }
  } catch (error) {
    console.error('Chat Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      details: error.message
    });
  }
});

/**
 * GET /api/ml/health
 * Check ML API health
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${ML_API_URL}/health`, {
      timeout: 5000
    });
    res.json(response.data);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'ML API is not responding',
      details: error.message
    });
  }
});

module.exports = router;




