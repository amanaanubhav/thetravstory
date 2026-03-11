const jwt = require('jsonwebtoken');
const User = require('../../domain/models/User');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

/**
 * Middleware to validate itinerary generation request
 */
const validateItineraryRequest = (req, res, next) => {
  const { destinations, startDate, endDate, budget, preferences } = req.body;

  if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one destination is required'
    });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      error: 'Start date and end date are required'
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    return res.status(400).json({
      success: false,
      error: 'End date must be after start date'
    });
  }

  if (!budget || typeof budget !== 'number' || budget <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid budget amount is required'
    });
  }

  // Validate preferences if provided
  if (preferences) {
    const validPaces = ['relaxed', 'moderate', 'intense'];
    if (preferences.pace && !validPaces.includes(preferences.pace)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pace preference'
      });
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  validateItineraryRequest
};