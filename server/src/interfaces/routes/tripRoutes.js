const express = require('express');
const Trip = require('../../domain/models/Trip');
const router = express.Router();

let tripIdCounter = 1;

/**
 * POST /api/trips
 * Create a new trip
 */
router.post('/', async (req, res) => {
  try {
    const tripData = req.body;

    if (!tripData.title || !tripData.locations) {
      return res.status(400).json({
        success: false,
        error: 'Title and locations are required'
      });
    }

    const tripId = `trip_${tripIdCounter++}`;
    const newTrip = new Trip({
      id: tripId,
      ...tripData,
      created_at: new Date(),
      updated_at: new Date()
    });

    await newTrip.save();

    res.status(201).json({
      success: true,
      trip: newTrip
    });
  } catch (error) {
    console.error('Create Trip Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create trip',
      details: error.message
    });
  }
});

/**
 * GET /api/trips
 * Get all trips
 */
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json({
      success: true,
      trips: trips
    });
  } catch (error) {
    console.error('Get Trips Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get trips',
      details: error.message
    });
  }
});

/**
 * GET /api/trips/:id
 * Get single trip by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ id: req.params.id });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    res.json({
      success: true,
      trip: trip
    });
  } catch (error) {
    console.error('Get Trip Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get trip',
      details: error.message
    });
  }
});

/**
 * PUT /api/trips/:id
 * Update trip
 */
router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updated_at: new Date() },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    res.json({
      success: true,
      trip: trip
    });
  } catch (error) {
    console.error('Update Trip Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update trip',
      details: error.message
    });
  }
});

/**
 * DELETE /api/trips/:id
 * Delete trip
 */
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ id: req.params.id });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    res.json({
      success: true,
      message: 'Trip deleted successfully',
      trip: trip
    });
  } catch (error) {
    console.error('Delete Trip Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete trip',
      details: error.message
    });
  }
});

/**
 * POST /api/trips/:id/activities
 * Add activity to trip
 */
router.post('/:id/activities', async (req, res) => {
  try {
    const { day_index, activity } = req.body;
    const trip = await Trip.findOne({ id: req.params.id });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    if (day_index === undefined || !activity) {
      return res.status(400).json({
        success: false,
        error: 'day_index and activity are required'
      });
    }

    if (!trip.itinerary[day_index]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid day index'
      });
    }

    const newActivity = {
      ...activity
    };

    trip.itinerary[day_index].items.push(newActivity);
    trip.updated_at = new Date();

    await trip.save();

    res.json({
      success: true,
      trip: trip
    });
  } catch (error) {
    console.error('Add Activity Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add activity',
      details: error.message
    });
  }
});

/**
 * DELETE /api/trips/:id/activities/:activityId
 * Remove activity from trip
 */
router.delete('/:id/activities/:activityId', async (req, res) => {
  try {
    const { day_index } = req.body;
    const trip = await Trip.findOne({ id: req.params.id });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    if (day_index === undefined) {
      return res.status(400).json({
        success: false,
        error: 'day_index is required'
      });
    }

    if (!trip.itinerary[day_index]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid day index'
      });
    }

    const activityIndex = trip.itinerary[day_index].items.findIndex(
      a => a.id === req.params.activityId
    );

    if (activityIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }

    trip.itinerary[day_index].items.splice(activityIndex, 1);
    trip.updated_at = new Date();

    await trip.save();

    res.json({
      success: true,
      trip: trip
    });
  } catch (error) {
    console.error('Remove Activity Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to remove activity',
      details: error.message
    });
  }
});

module.exports = router;
