const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  time: { type: String, required: true }, // e.g., "09:00"
  activity: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  duration: { type: String }, // e.g., "2 hours"
  cost: { type: Number, default: 0 },
  category: { type: String, enum: ['sightseeing', 'food', 'shopping', 'adventure', 'relaxation', 'transport'] },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

const itinerarySchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Changed from ObjectId to String for mock users
  tripId: { type: String, required: true },
  title: { type: String, required: true },
  destinations: [{ type: String }], // Array of destination names
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: {
    total: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    breakdown: {
      flights: { type: Number, default: 0 },
      hotels: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 }
    }
  },
  preferences: {
    pace: { type: String, enum: ['relaxed', 'moderate', 'intense'], default: 'moderate' },
    interests: [{ type: String }],
    dietaryRestrictions: [{ type: String }],
    accessibility: { type: Boolean, default: false }
  },
  itinerary: [itineraryItemSchema],
  flights: [{
    departure: {
      airport: { type: String },
      date: { type: Date },
      time: { type: String }
    },
    arrival: {
      airport: { type: String },
      date: { type: Date },
      time: { type: String }
    },
    airline: { type: String },
    flightNumber: { type: String },
    cost: { type: Number },
    duration: { type: String }
  }],
  hotels: [{
    name: { type: String },
    location: { type: String },
    checkIn: { type: Date },
    checkOut: { type: Date },
    cost: { type: Number },
    rating: { type: Number },
    amenities: [{ type: String }]
  }],
  recommendations: [{
    type: { type: String, enum: ['destination', 'activity', 'restaurant', 'attraction'] },
    title: { type: String },
    description: { type: String },
    reason: { type: String }, // Why recommended based on personality
    cost: { type: Number },
    rating: { type: Number }
  }],
  status: { type: String, enum: ['draft', 'confirmed', 'completed'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
// itinerarySchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

module.exports = mongoose.model('Itinerary', itinerarySchema);