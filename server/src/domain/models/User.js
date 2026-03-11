const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: '' },
  travelPreferences: {
    adventure: { type: Number, default: 0 },
    relaxation: { type: Number, default: 0 },
    culture: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    budget: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  quizAnswers: {
    spend_time: { type: String, default: '' },
    curiosity: { type: String, default: '' },
    recharge: { type: String, default: '' },
    travel_pref: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

// Remove pre-save middleware and handle hashing in routes
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);