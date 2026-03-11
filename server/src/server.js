const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./infrastructure/database/connection');
const authRoutes = require('./interfaces/routes/authRoutes');
const tripRoutes = require('./interfaces/routes/tripRoutes');
const mlRoutes = require('./interfaces/routes/mlRoutes.js');
const itineraryRoutes = require('./interfaces/routes/itineraryRoutes');
const testRoutes = require('./interfaces/routes/testRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Trip Routes (MongoDB)
app.use('/api/trips', tripRoutes);

// Itinerary Routes (Dynamic Planner)
console.log('Loading itinerary routes...');
app.use('/api/itineraries', itineraryRoutes);
console.log('Itinerary routes loaded');

// Test Routes
app.use('/api/test', testRoutes);

// ML Routes (proxy to ML server)
app.use('/api/ml', mlRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Express Backend running on http://localhost:${PORT}`);
  console.log(` ML Server configured at: ${ML_API_URL}`);
});

module.exports = app;