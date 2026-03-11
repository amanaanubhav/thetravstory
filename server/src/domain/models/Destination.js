const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String },
  description: { type: String },
  category: { type: String, enum: ['beach', 'mountain', 'city', 'cultural', 'adventure', 'relaxation'] },
  bestTimeToVisit: { type: String },
  averageCost: {
    low: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    high: { type: Number, default: 0 }
  },
  activities: [{ type: String }],
  imageUrl: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', destinationSchema);