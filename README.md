# TRAVIXO - Comprehensive Technical Workflow Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Development Workflow](#development-workflow)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [ML Model Architecture](#ml-model-architecture)
9. [Component Architecture](#component-architecture)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Guide](#deployment-guide)
12. [Troubleshooting](#troubleshooting)
13. [Contributing Guidelines](#contributing-guidelines)
14. [Missing Features & Roadmap](#missing-features--roadmap)

---

## 🎯 Project Overview

**Travixo** is a comprehensive AI-powered travel planning platform that combines machine learning recommendations with dynamic itinerary generation. The platform features personality-based trip suggestions, real-time API integrations for flights/hotels, and a modern React-based user interface.

### Key Features

- **Personality-based Travel Recommendations** using ML models
- **Dynamic Itinerary Generation** with ML-powered activity suggestions
- **Real-time API Integration** for flights, hotels, and destinations
- **Persistent Authentication** with JWT tokens
- **Responsive UI** with modern design patterns
- **Trip Planning & Management** with drag-and-drop functionality

---

## 🏗️ Architecture & Tech Stack

### Frontend (React + Vite)

```
React 18.3.1 + Vite 6.0.0
├── UI Framework: Tailwind CSS 4.0.0
├── State Management: React Context API
├── Routing: React Router DOM 6.30.1
├── Animations: Framer Motion 11.18.2
├── Icons: Lucide React 0.474.0
├── Maps: React Leaflet 4.2.1
└── Drag & Drop: @hello-pangea/dnd 18.0.1
```

### Backend (Node.js + Express)

```
Express 5.2.1 + Node.js
├── Database: MongoDB 7.1.0 with Mongoose 9.1.5
├── Authentication: JWT 9.0.3 + bcryptjs 3.0.3
├── CORS: cors 2.8.6
├── File Upload: multer 2.0.2
├── HTTP Client: axios 1.6.2
└── Environment: dotenv 17.2.3
```

### ML Service (Python + FastAPI)

```
FastAPI 0.104.1 + Python 3.8+
├── ML Framework: TensorFlow 2.15.0+
├── Data Processing: pandas 2.1.4+, numpy 1.26.0+
├── ML Libraries: scikit-learn 1.3.2+, joblib 1.3.2+
├── API Framework: FastAPI with uvicorn
├── Authentication: python-jose 3.3.0
├── Database: pymongo 4.6.1
└── HTTP Client: httpx 0.25.1
```

### Infrastructure

```
Development:
├── Frontend Dev Server: Vite (Port 5173/5174)
├── Backend API: Express (Port 3000)
├── ML API: FastAPI (Port 8000)
└── Database: MongoDB (Port 27017)

Production:
├── Containerization: Docker
├── Reverse Proxy: Nginx
├── Database: MongoDB Atlas
└── File Storage: AWS S3 / Cloudinary
```

---

## 📁 Project Structure

```
travixo/
├── 📁 .vscode/                    # VS Code workspace settings
├── 📁 node_modules/              # Frontend dependencies
├── 📁 server/                    # Backend Express server
│   ├── 📁 node_modules/          # Backend dependencies
│   ├── 📁 src/
│   │   ├── 📁 config/           # Database configuration
│   │   │   └── database.js      # MongoDB connection setup
│   │   ├── 📁 controllers/      # Route controllers
│   │   ├── 📁 middleware/       # Express middleware
│   │   ├── 📁 models/          # Mongoose schemas
│   │   │   ├── Itinerary.js    # Itinerary schema
│   │   │   └── User.js         # User schema
│   │   ├── 📁 routes/          # API route definitions
│   │   │   ├── authRoutes.js   # Authentication routes
│   │   │   ├── itineraryRoutes.js # Itinerary generation
│   │   │   ├── mlRoutes.js     # ML service proxy
│   │   │   ├── tripRoutes.js   # Trip management
│   │   │   └── testRoutes.js   # Testing endpoints
│   │   └── server.js           # Express app entry point
│   ├── .env                    # Environment variables
│   ├── .env.example           # Environment template
│   └── package.json           # Backend dependencies
├── 📁 ml-server/               # Python ML service
│   ├── 📁 app/
│   │   ├── 📁 models/         # ML model files
│   │   │   ├── personality_encoder.h5
│   │   │   └── travel_ann_full.h5
│   │   ├── ml_model.py        # ML model classes
│   │   └── __init__.py
│   ├── 📁 data/              # Training data
│   │   ├── categories.csv
│   │   ├── perso.csv
│   │   └── trip.csv
│   ├── main.py               # FastAPI app entry point
│   ├── model.py              # Model training scripts
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # ML service environment
├── 📁 src/                   # React frontend
│   ├── 📁 components/        # Reusable UI components
│   │   ├── 📁 common/        # Shared components
│   │   │   ├── BottomNav.jsx # Navigation bar
│   │   │   ├── Button.jsx    # Custom button component
│   │   │   ├── Card.jsx      # Card wrapper component
│   │   │   └── Modal.jsx     # Modal dialog component
│   │   ├── 📁 marquee/       # Animation components
│   │   │   └── VerticalMarqueeColumn.jsx
│   │   ├── HeroSwipeImage.jsx # Hero image carousel
│   │   ├── ItineraryForm.jsx # Main itinerary creation form
│   │   ├── RecommendationPanel.jsx
│   │   ├── slider.jsx        # Image slider component
│   │   ├── TransitionOverlay.jsx
│   │   └── WhatYouCanDoCarousel.jsx
│   ├── 📁 context/           # React Context providers
│   │   ├── TripContext.jsx   # Trip state management
│   │   └── UserContext.jsx   # User authentication state
│   ├── 📁 data/             # Mock data and constants
│   │   ├── mockFeed.js      # Sample feed data
│   │   ├── mockTrips.js     # Sample trip data
│   │   └── mockUser.js      # Sample user data
│   ├── 📁 hooks/            # Custom React hooks
│   │   ├── useChatAI.js     # Chat AI integration hook
│   │   ├── useMlPredictions.js # ML prediction hook
│   │   └── [additional hooks]
│   ├── 📁 layouts/          # Page layout components
│   │   └── MainLayout.jsx   # Main app layout with nav
│   ├── 📁 pages/            # Page components
│   │   ├── Auth.jsx         # Login/Register page
│   │   ├── Chat.jsx         # AI chat interface
│   │   ├── Explore.jsx      # Destination exploration
│   │   ├── Home.jsx         # Dashboard/home page
│   │   ├── Landing.jsx      # Landing page
│   │   ├── Planner.jsx      # Trip planner interface
│   │   ├── Profile.jsx      # User profile page
│   │   └── Quiz.jsx         # Personality quiz
│   ├── 📁 services/         # API service functions
│   │   ├── authService.js   # Authentication API calls
│   │   ├── chatService.js   # Chat API integration
│   │   ├── itineraryService.js # Itinerary API calls
│   │   ├── mlService.js     # ML service integration
│   │   └── tripService.js   # Trip management API
│   ├── App.jsx              # Main React app component
│   ├── index.css            # Global styles
│   ├── main.jsx            # React app entry point
│   └── .env.local           # Frontend environment variables
├── 📁 public/               # Static assets
├── 📄 index.html            # HTML template
├── 📄 package.json          # Frontend dependencies
├── 📄 tailwind.config.cjs   # Tailwind CSS configuration
├── 📄 vite.config.js        # Vite build configuration
├── 📄 README.md             # Project documentation
└── 📄 [config files]        # Various config files
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ with pip
- **MongoDB** (local or MongoDB Atlas)
- **Git** for version control

### 1. Clone Repository

```bash
git clone <repository-url>
cd travixo
```

### 2. Environment Setup

#### Backend Environment (.env)

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/travixo
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ML_API_URL=http://localhost:8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
ML_API_TIMEOUT=10000
```

#### ML Service Environment

```bash
cd ../ml-server
# Create .env file if needed
```

#### Frontend Environment

```bash
cd ../src
# Create .env.local if needed
echo "VITE_API_URL=http://localhost:3000" > .env.local
```

### 3. Install Dependencies

#### Frontend Dependencies

```bash
npm install
```

#### Backend Dependencies

```bash
cd server
npm install
```

#### ML Service Dependencies

```bash
cd ../ml-server
pip install -r requirements.txt
```

### 4. Database Setup

```bash
# Start MongoDB locally or use MongoDB Atlas
mongosh
# Create database: use travixo
```

### 5. Start Development Servers

#### Terminal 1: ML Service

```bash
cd ml-server
python main.py
# Runs on http://localhost:8000
```

#### Terminal 2: Backend API

```bash
cd server
npm start
# Runs on http://localhost:3000
```

#### Terminal 3: Frontend

```bash
npm run dev
# Runs on http://localhost:5173
```

### 6. Verify Installation

- Frontend: http://localhost:5173
- Backend Health: http://localhost:3000/health
- ML Service: http://localhost:8000/docs (FastAPI docs)

---

## 🔄 Development Workflow

### 1. Branching Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### 2. Code Quality

```bash
# Frontend linting (if configured)
npm run lint

# Backend testing (when implemented)
cd server && npm test

# ML testing
cd ml-server && python -m pytest
```

### 3. Component Development

```jsx
// Example: Creating a new component
// src/components/common/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-${color}-200 border-t-${color}-600 ${sizeClasses[size]}`}
    ></div>
  );
};

export default LoadingSpinner;
```

### 4. API Development

```javascript
// Example: Adding new API endpoint
// server/src/routes/exampleRoutes.js
const express = require("express");
const router = express.Router();

// GET /api/example
router.get("/", async (req, res) => {
  try {
    // Business logic here
    res.json({ message: "Example endpoint" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 5. Database Schema Updates

```javascript
// Example: Adding new model
// server/src/models/Example.js
const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Example", exampleSchema);
```

---

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "personalityTag": null
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login

Authenticate user login.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "personalityTag": "The Explorer"
  },
  "token": "jwt_token_here"
}
```

#### GET /api/auth/me

Get current authenticated user info.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

### Itinerary Endpoints

#### POST /api/itineraries/generate

Generate personalized itinerary using ML recommendations.

**Request Body:**

```json
{
  "destinations": ["Paris", "Rome"],
  "startDate": "2024-12-01",
  "endDate": "2024-12-07",
  "budget": 2000,
  "preferences": {
    "pace": "moderate",
    "groupSize": 2,
    "personality": "The Explorer"
  }
}
```

**Response:**

```json
{
  "success": true,
  "itinerary": {
    "userId": "user_id",
    "tripId": "trip_123",
    "title": "Trip to Paris, Rome",
    "itinerary": [
      {
        "day": 1,
        "time": "09:00",
        "activity": "Visit Eiffel Tower",
        "location": "Paris",
        "description": "Iconic landmark visit",
        "category": "sightseeing"
      }
    ]
  }
}
```

### ML Service Endpoints

#### POST /api/trip-recommendation

Get ML-powered trip recommendations.

**Request Body:**

```json
{
  "destinations": ["Paris"],
  "duration": 7,
  "preferences": {
    "adventure": 8,
    "relaxation": 3,
    "culture": 7,
    "food": 6,
    "budget": "medium"
  }
}
```

#### POST /api/personality-quiz

Process personality quiz responses.

**Request Body:**

```json
{
  "answers": {
    "q1": "city_culture",
    "q2": "scenic_relax",
    "q3": "adventure"
  },
  "user_info": {
    "age": 25,
    "gender": "male"
  }
}
```

---

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  avatar: String,
  travelPreferences: {
    adventure: Number (0-10),
    relaxation: Number (0-10),
    culture: Number (0-10),
    food: Number (0-10),
    budget: String (enum: 'low', 'medium', 'high')
  },
  personalityTag: String (enum: 'The Explorer', 'The Relaxer', 'The Foodie', 'The Culture Vulture'),
  createdAt: Date
}
```

### Itinerary Collection

```javascript
{
  _id: ObjectId,
  userId: String (required),
  tripId: String (required),
  title: String (required),
  destinations: [String],
  startDate: Date (required),
  endDate: Date (required),
  budget: {
    total: Number (required),
    currency: String (default: 'USD'),
    breakdown: {
      flights: Number,
      hotels: Number,
      activities: Number,
      food: Number,
      miscellaneous: Number
    }
  },
  preferences: {
    pace: String (enum: 'relaxed', 'moderate', 'intense'),
    interests: [String],
    dietaryRestrictions: [String],
    accessibility: Boolean
  },
  itinerary: [{
    day: Number (required),
    time: String (required),
    activity: String (required),
    location: String,
    description: String,
    duration: String,
    cost: Number,
    category: String (enum: 'sightseeing', 'food', 'shopping', 'adventure', 'relaxation', 'transport'),
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  flights: [{
    departure: {
      airport: String,
      date: Date,
      time: String
    },
    arrival: {
      airport: String,
      date: Date,
      time: String
    },
    airline: String,
    flightNumber: String,
    price: Number,
    class: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🤖 ML Model Architecture

### Model Components

#### 1. Personality Encoder (personality_encoder.h5)

- **Type:** Neural Network Autoencoder
- **Input:** Personality quiz responses (12 questions)
- **Output:** 32-dimensional personality embedding
- **Purpose:** Convert user preferences into vector representation

#### 2. Travel ANN Model (travel_ann_full.h5)

- **Type:** Artificial Neural Network
- **Input:** User preferences + destination features
- **Output:** Activity recommendations and ratings
- **Architecture:** Multi-layer perceptron with dropout

### Data Processing Pipeline

#### Input Encoding

```python
# Personality question encoding
personality_encoding = {
    'city_culture': [1, 0, 0],
    'scenic_relax': [0, 1, 0],
    'adventure': [0, 0, 1],
    # ... more mappings
}

# Feature normalization
def normalize_features(features):
    return (features - mean) / std
```

#### Model Training

```python
# Training configuration
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Training with early stopping
history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    callbacks=[early_stopping]
)
```

### Prediction Pipeline

#### 1. User Input Processing

```python
def process_user_input(quiz_answers, user_info):
    # Encode personality answers
    encoded_answers = encode_personality_answers(quiz_answers)

    # Create feature vector
    features = create_feature_vector(encoded_answers, user_info)

    return features
```

#### 2. Recommendation Generation

```python
def generate_recommendations(user_features, destination):
    # Get ML predictions
    predictions = travel_model.predict(user_features)

    # Filter by destination
    relevant_activities = filter_by_destination(predictions, destination)

    # Rank and return top recommendations
    return rank_activities(relevant_activities)
```

---

## 🧩 Component Architecture

### Context Providers

#### UserContext (`src/context/UserContext.jsx`)

```jsx
// State management for user authentication and profile
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication methods
  const login = async (credentials) => {
    /* ... */
  };
  const logout = () => {
    /* ... */
  };
  const register = async (userData) => {
    /* ... */
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
        register,
        setPersonality,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
```

#### TripContext (`src/context/TripContext.jsx`)

```jsx
// State management for trip data and itinerary
const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(mockTrips);
  const [activeTripId, setActiveTripId] = useState(null);

  // Trip management methods
  const createTrip = (tripData) => {
    /* ... */
  };
  const updateTrip = (tripId, updates) => {
    /* ... */
  };
  const deleteTrip = (tripId) => {
    /* ... */
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTripId,
        activeTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        setActiveTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
```

### Service Layer

#### API Service Pattern

```javascript
// src/services/itineraryService.js
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const generateItinerary = async (itineraryData) => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/itineraries/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itineraryData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
```

### Component Patterns

#### Higher-Order Components (HOCs)

```jsx
// Route protection HOC
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useUser();

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};
```

#### Custom Hooks

```jsx
// src/hooks/useTripData.js
import { useState, useEffect } from "react";
import { getUserTrips } from "../services/tripService";

export const useTripData = (userId) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripData = await getUserTrips(userId);
        setTrips(tripData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTrips();
    }
  }, [userId]);

  return { trips, loading, error };
};
```

---

## 🧪 Testing Strategy

### Frontend Testing

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# Run tests
npm run test

# Component testing example
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Backend Testing

```bash
# Install testing dependencies
cd server
npm install --save-dev jest supertest

# Run tests
npm test

# API testing example
const request = require('supertest');
const app = require('./server');

describe('Auth Routes', () => {
  test('POST /api/auth/register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

### ML Testing

```python
# ml-server/test_ml.py
import pytest
from app.ml_model import TravelMLModels

def test_personality_encoding():
    ml_models = TravelMLModels()

    # Test personality encoding
    encoded = ml_models.encode_personality_answers({
        'q1': 'city_culture',
        'q2': 'scenic_relax'
    })

    assert len(encoded) == 32  # Embedding dimension
    assert all(isinstance(x, float) for x in encoded)

def test_trip_recommendation():
    ml_models = TravelMLModels()

    recommendations = ml_models.generate_recommendations(
        user_features={'adventure': 8, 'culture': 6},
        destination='Paris'
    )

    assert isinstance(recommendations, list)
    assert len(recommendations) > 0
```

---

## 🚢 Deployment Guide

### Development Deployment

```bash
# Build frontend
npm run build

# Start production servers
# Backend: npm start (production)
# ML: python main.py
# Frontend: serve dist/ folder with nginx
```

### Docker Deployment

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```dockerfile
# Dockerfile for ML service
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Environment Setup

```bash
# Environment variables for production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/travixo
JWT_SECRET=your_production_jwt_secret
ML_API_URL=https://ml-api.travixo.com
CORS_ORIGIN=https://travixo.com
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend
        run: |
          cd server
          npm ci
          npm run build
          # Deploy to server
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues

```bash
# Check MongoDB status
brew services list | grep mongodb

# Reset MongoDB
brew services restart mongodb

# Check connection string
mongosh "mongodb://localhost:27017/travixo"
```

#### 2. Port Conflicts

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different ports in .env
PORT=3001
```

#### 3. ML Model Loading Issues

```python
# Check model files exist
ls ml-server/app/models/

# Reinstall dependencies
cd ml-server
pip install -r requirements.txt --force-reinstall

# Check TensorFlow installation
python -c "import tensorflow as tf; print(tf.__version__)"
```

#### 4. CORS Issues

```javascript
// Update CORS configuration in server.js
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
```

#### 5. Authentication Issues

```javascript
// Check token storage
console.log(localStorage.getItem("authToken"));

// Verify token expiration
// Tokens expire after 24 hours by default
```

### Debug Commands

```bash
# Check all running processes
ps aux | grep -E "(node|python|vite)"

# Check network connections
netstat -tulpn | grep -E "(3000|8000|5173)"

# View application logs
tail -f server/logs/app.log
tail -f ml-server/logs/ml.log
```

---

## 🤝 Contributing Guidelines

### Code Standards

```javascript
// Use ESLint and Prettier
// Follow React best practices
// Use TypeScript for new components (future migration)

// Naming conventions
const userName = "John"; // camelCase for variables
const UserProfile = () => {}; // PascalCase for components
const getUserData = () => {}; // camelCase for functions
```

### Commit Message Format

```
type(scope): description

Types:
- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting
- refactor: code restructuring
- test: testing
- chore: maintenance

Examples:
feat(auth): add JWT token refresh
fix(itinerary): resolve ML recommendation bug
docs(api): update endpoint documentation
```

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Create PR with detailed description
5. Code review and approval
6. Merge to `main`

### Code Review Checklist

- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Environment variables documented
- [ ] Security considerations addressed

---

## 🚧 Missing Features & Roadmap

### High Priority (Next Sprint)

#### 1. **Real API Integrations** 🔴

```javascript
// Missing: Flight search integration
// TODO: Integrate with Amadeus, Skyscanner, or similar APIs
const searchFlights = async (origin, destination, dates) => {
  // Implementation needed
};

// Missing: Hotel booking integration
// TODO: Integrate with Booking.com, Expedia APIs
const searchHotels = async (location, checkIn, checkOut) => {
  // Implementation needed
};
```

#### 2. **Enhanced Error Handling** 🔴

```javascript
// Missing: Global error boundary
// TODO: Implement React Error Boundary
class ErrorBoundary extends React.Component {
  // Implementation needed
}

// Missing: API error handling middleware
// TODO: Add comprehensive error handling in Express
const errorHandler = (err, req, res, next) => {
  // Implementation needed
};
```

#### 3. **Data Validation** 🔴

```javascript
// Missing: Input validation schemas
// TODO: Add Joi or Yup validation
const itinerarySchema = Joi.object({
  destinations: Joi.array().min(1).required(),
  startDate: Joi.date().required(),
  budget: Joi.number().min(0).required(),
});
```

### Medium Priority (Next Month)

#### 4. **User Profile Management** 🟡

- [ ] Profile picture upload
- [ ] Password change functionality
- [ ] Account deletion
- [ ] Privacy settings

#### 5. **Trip Sharing & Collaboration** 🟡

- [ ] Share trip with other users
- [ ] Collaborative trip planning
- [ ] Trip comments and feedback
- [ ] Public trip templates

#### 6. **Offline Functionality** 🟡

- [ ] Service worker for PWA
- [ ] Offline trip data storage
- [ ] Sync when back online

### Low Priority (Future Releases)

#### 7. **Advanced ML Features** 🟢

- [ ] Dynamic pricing predictions
- [ ] Weather-based recommendations
- [ ] Seasonal trend analysis
- [ ] Personalized marketing

#### 8. **Mobile App** 🟢

- [ ] React Native mobile app
- [ ] Push notifications
- [ ] GPS-based recommendations

#### 9. **Multi-language Support** 🟢

- [ ] i18n implementation
- [ ] RTL language support
- [ ] Cultural customization

### Technical Debt

#### 10. **Code Quality Improvements** 🔴

```javascript
// TODO: Add TypeScript migration plan
// TODO: Implement comprehensive testing suite
// TODO: Add CI/CD pipeline
// TODO: Database indexing and optimization
// TODO: API rate limiting and caching
```

#### 11. **Performance Optimizations** 🟡

```javascript
// TODO: Implement code splitting
// TODO: Add image optimization
// TODO: Database query optimization
// TODO: CDN integration for assets
```

#### 12. **Security Enhancements** 🔴

```javascript
// TODO: Implement HTTPS everywhere
// TODO: Add input sanitization
// TODO: Rate limiting on APIs
// TODO: Security headers (Helmet.js)
// TODO: Data encryption at rest
```

### Implementation Priority Matrix

| Feature                  | Impact | Effort | Priority        |
| ------------------------ | ------ | ------ | --------------- |
| Real API Integrations    | High   | High   | 🔴 Critical     |
| Error Handling           | High   | Medium | 🔴 Critical     |
| Data Validation          | High   | Low    | 🔴 Critical     |
| Security Enhancements    | High   | Medium | 🔴 Critical     |
| User Profile Management  | Medium | Medium | 🟡 Important    |
| Trip Sharing             | Medium | High   | 🟡 Important    |
| Testing Suite            | High   | High   | 🟡 Important    |
| Performance Optimization | Medium | Medium | 🟢 Nice-to-have |

---

## 📞 Support & Contact

### Development Team

- **Frontend Lead:** [Name] - React/Vite specialist
- **Backend Lead:** [Name] - Node.js/Express expert
- **ML Engineer:** [Name] - Python/TensorFlow specialist
- **DevOps:** [Name] - Deployment/Infrastructure

### Communication Channels

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Documentation:** This README and inline code docs

### Getting Help

1. Check this documentation first
2. Search existing GitHub issues
3. Create new issue with detailed information
4. Include error logs, environment details, and reproduction steps

---

_This documentation is continuously updated. Last updated: March 10, 2026_</content>
<parameter name="filePath">c:\Users\KIIT0001\Desktop\Travixo\README.md
