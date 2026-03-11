const express = require('express');
const axios = require('axios');
const Itinerary = require('../../domain/models/Itinerary');
const Destination = require('../../domain/models/Destination');
const { authenticateToken } = require('../../infrastructure/middleware/auth');

console.log('Initializing itinerary routes...');
const router = express.Router();
const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

/**
 * GET /api/itineraries/test
 * Simple test route
 */
router.get('/test', (req, res) => {
  console.log('Test route called');
  res.json({ message: 'Itinerary routes are working!' });
});

/**
 * POST /api/itineraries/generate
 * Generate a personalized itinerary based on user preferences and ML recommendations
 */
router.post('/generate', async (req, res) => {
  console.log('Itinerary generate route called');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  try {
    const {
      destinations,
      startDate,
      endDate,
      budget,
      preferences = {}
    } = req.body;

    // Mock user for testing
    const user = {
      _id: 'test_user_id',
      quizAnswers: {
        spend_time: 'adventure',
        curiosity: 'hidden_gems',
        recharge: 'hike_adventure',
        travel_pref: 'group_new'
      }
    };
    const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Get ML recommendations based on user personality
    let mlRecommendations = [];
    console.log('About to call ML service');
    try {
      // Temporarily comment out ML call for testing
      // const mlResponse = await axios.post(`${ML_API_URL}/api/trip-recommendation`, {
      //   personality_answers: user.quizAnswers,
      //   gender: user.gender || 'prefer_not_to_say',
      //   trip_budget: budget,
      //   duration: durationDays,
      //   number_of_people: 2, // Default, could be enhanced
      //   weather: 'sunny' // Default, could be enhanced
      // }, { timeout: 5000 }); // Reduced timeout

      // mlRecommendations = mlResponse.data.recommendations || [];
      console.log('ML service call commented out for testing');
      mlRecommendations = []; // Empty for now
    } catch (mlError) {
      console.warn('ML service unavailable, using fallback recommendations:', mlError.message);
      // Continue without ML recommendations
    }

    console.log('About to generate itinerary structure');

    // Generate itinerary structure
    console.log('About to call generateItineraryStructure');
    const itinerary = generateItineraryStructure(
      destinations,
      start,
      durationDays,
      budget,
      preferences,
      mlRecommendations
    );
    console.log('Generated itinerary with', itinerary.length, 'activities');

    // Create itinerary document
    const newItinerary = new Itinerary({
      userId: user._id,
      tripId,
      title: `Trip to ${destinations.join(', ')}`,
      destinations,
      startDate: start,
      endDate: end,
      budget: {
        total: budget,
        breakdown: calculateBudgetBreakdown(budget, durationDays)
      },
      preferences,
      itinerary,
      recommendations: mlRecommendations
    });

    await newItinerary.save();

    res.status(201).json({
      success: true,
      itinerary: newItinerary,
      message: 'Itinerary generated successfully'
    });

  } catch (error) {
    console.error('Generate Itinerary Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary',
      details: error.message
    });
  }
});

/**
 * GET /api/itineraries
 * Get all itineraries for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const user = { _id: 'test_user_id' }; // Mock user for testing
    const itineraries = await Itinerary.find({ userId: user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      itineraries
    });
  } catch (error) {
    console.error('Get Itineraries Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch itineraries',
      details: error.message
    });
  }
});

/**
 * GET /api/itineraries/:id
 * Get a specific itinerary by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const user = { _id: 'test_user_id' }; // Mock user for testing
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: user._id
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }

    res.json({
      success: true,
      itinerary
    });
  } catch (error) {
    console.error('Get Itinerary Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch itinerary',
      details: error.message
    });
  }
});

/**
 * PUT /api/itineraries/:id
 * Update an existing itinerary
 */
router.put('/:id', async (req, res) => {
  try {
    const user = { _id: 'test_user_id' }; // Mock user for testing
    const updates = req.body;

    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, userId: user._id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }

    res.json({
      success: true,
      itinerary,
      message: 'Itinerary updated successfully'
    });
  } catch (error) {
    console.error('Update Itinerary Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update itinerary',
      details: error.message
    });
  }
});

/**
 * DELETE /api/itineraries/:id
 * Delete an itinerary
 */
router.delete('/:id', async (req, res) => {
  try {
    const user = { _id: 'test_user_id' }; // Mock user for testing
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: user._id
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        error: 'Itinerary not found'
      });
    }

    res.json({
      success: true,
      message: 'Itinerary deleted successfully'
    });
  } catch (error) {
    console.error('Delete Itinerary Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete itinerary',
      details: error.message
    });
  }
});

/**
 * Helper function to generate itinerary structure
 */
function generateItineraryStructure(destinations, startDate, durationDays, budget, preferences, mlRecommendations) {
  console.log('Inside generateItineraryStructure function');
  const itinerary = [];
  const pace = preferences.pace || 'moderate';

  // Define activity templates based on pace
  const activityTemplates = {
    relaxed: {
      activitiesPerDay: 2,
      includeRest: true,
      focus: ['sightseeing', 'food', 'relaxation']
    },
    moderate: {
      activitiesPerDay: 3,
      includeRest: false,
      focus: ['sightseeing', 'food', 'shopping', 'adventure']
    },
    intense: {
      activitiesPerDay: 4,
      includeRest: false,
      focus: ['sightseeing', 'adventure', 'cultural', 'shopping']
    }
  };

  const template = activityTemplates[pace];

  for (let day = 1; day <= durationDays; day++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + day - 1);

    const dayActivities = generateDayActivities(
      day,
      destinations,
      template,
      mlRecommendations,
      budget / durationDays
    );

    itinerary.push(...dayActivities);
  }

  return itinerary;
}

/**
 * Generate activities for a specific day
 */
function generateDayActivities(day, destinations, template, mlRecommendations, dailyBudget) {
  const activities = [];
  const times = ['09:00', '11:00', '14:00', '16:00', '19:00'];

  // Morning activity
  activities.push({
    day,
    time: times[0],
    activity: 'Breakfast at local cafe',
    location: destinations[0],
    description: 'Start your day with local cuisine',
    duration: '1 hour',
    cost: Math.floor(dailyBudget * 0.1),
    category: 'food'
  });

  // Main activities based on template
  for (let i = 0; i < template.activitiesPerDay; i++) {
    const timeIndex = i + 1;
    if (timeIndex < times.length) {
      const activity = generateActivityForTime(
        day,
        times[timeIndex],
        destinations,
        template.focus,
        mlRecommendations,
        dailyBudget
      );
      activities.push(activity);
    }
  }

  // Evening activity
  activities.push({
    day,
    time: times[times.length - 1],
    activity: 'Dinner and relaxation',
    location: destinations[0],
    description: 'Enjoy local cuisine and unwind',
    duration: '2 hours',
    cost: Math.floor(dailyBudget * 0.2),
    category: 'food'
  });

  return activities;
}

/**
 * Generate a specific activity for a time slot
 */
function generateActivityForTime(day, time, destinations, focusAreas, mlRecommendations, dailyBudget) {
  const categories = focusAreas;
  const category = categories[Math.floor(Math.random() * categories.length)];

  const activityTemplates = {
    sightseeing: [
      'Visit local landmarks',
      'Explore historical sites',
      'Take a city tour',
      'Visit museums and galleries'
    ],
    food: [
      'Try local street food',
      'Visit a traditional restaurant',
      'Cooking class experience',
      'Food market exploration'
    ],
    shopping: [
      'Local market shopping',
      'Souvenir shopping',
      'Boutique exploration',
      'Traditional craft shopping'
    ],
    adventure: [
      'Hiking in nature',
      'Water sports activity',
      'Adventure park visit',
      'Guided outdoor excursion'
    ],
    cultural: [
      'Traditional performance',
      'Cultural workshop',
      'Temple/monument visit',
      'Local festival experience'
    ],
    relaxation: [
      'Spa treatment',
      'Beach relaxation',
      'Garden visit',
      'Meditation session'
    ]
  };

  const templates = activityTemplates[category] || activityTemplates.sightseeing;
  const activity = templates[Math.floor(Math.random() * templates.length)];

  return {
    day,
    time,
    activity,
    location: destinations[Math.floor(Math.random() * destinations.length)],
    description: `Enjoy ${activity.toLowerCase()} in ${destinations[0]}`,
    duration: '2-3 hours',
    cost: Math.floor(dailyBudget * 0.3),
    category
  };
}

/**
 * Calculate budget breakdown
 */
function calculateBudgetBreakdown(totalBudget, durationDays) {
  const dailyBudget = totalBudget / durationDays;

  return {
    flights: Math.floor(totalBudget * 0.4), // 40% for flights
    hotels: Math.floor(dailyBudget * 0.4 * durationDays), // 40% of daily budget for hotels
    activities: Math.floor(dailyBudget * 0.3 * durationDays), // 30% for activities
    food: Math.floor(dailyBudget * 0.2 * durationDays), // 20% for food
    miscellaneous: Math.floor(dailyBudget * 0.1 * durationDays) // 10% miscellaneous
  };
}

module.exports = router;