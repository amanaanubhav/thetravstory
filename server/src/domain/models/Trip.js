const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['flight', 'stay', 'activity'], required: true },
  time: { type: String, required: true },
  title: { type: String, required: true },
  meta: { type: String, default: '' }
}, { _id: false });

const daySchema = new mongoose.Schema({
  label: { type: String, required: true },
  items: [itineraryItemSchema]
}, { _id: false });

const tripSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  dates: { type: String, required: true },
  summary: { type: String, default: '' },
  locations: [{ type: String }],
  vibeTag: { type: String, default: '' },
  budgetHint: { type: String, default: '' },
  itinerary: [daySchema],
  budget: {
    currency: { type: String, default: 'EUR' },
    roughTotal: { type: Number, default: 0 }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Auto-update timestamp
tripSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
