const express = require('express');
const router = express.Router();
const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

/**
 * POST /api/ml/chat
 * Send chat message and get AI response
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, trip_context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Call ML API
    const response = await axios.post(
      `${ML_API_URL}/api/chat`,
      {
        message,
        trip_context
      },
      {
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Chat API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      details: error.message
    });
  }
});

/**
 * POST /api/ml/generate-trip
 * Generate trip from chat message
 */
router.post('/generate-trip', async (req, res) => {
  try {
    const { message, personality_data } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Call ML API
    const response = await axios.post(
      `${ML_API_URL}/api/generate-trip`,
      {
        message,
        personality_data
      },
      {
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Trip Generation Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate trip',
      details: error.message
    });
  }
});

/**
 * POST /api/ml/suggestions
 * Get travel suggestions
 */
router.post('/suggestions', async (req, res) => {
  try {
    const preferences = req.body;

    // Call ML API
    const response = await axios.post(
      `${ML_API_URL}/api/suggestions`,
      preferences,
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
    console.error('Suggestions Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions',
      details: error.message
    });
  }
});

module.exports = router;
