# TRAVIXO ML Integration - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TRAVIXO SYSTEM                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (React)                                │
│                      Port: 5173                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │   Quiz.jsx       │  │ Planner.jsx      │  │ Profile.jsx      │      │
│  │                  │  │                  │  │                  │      │
│  │ - 4 Questions    │  │ - Trip Details   │  │ - User Info      │      │
│  │ - ML Integration │  │ - Recommendations│  │ - Personality    │      │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘      │
│           │                     │                     │                 │
│           └─────────────────────┼───────────��─────────┘                 │
│                                 │                                       │
│                    ┌────────────▼────────────┐                          │
│                    │   mlService.js          │                          │
│                    │                         │                          │
│                    │ - analyzePersonality()  │                          │
│                    │ - getTripRecommendation│                          │
│                    │ - checkMLHealth()       │                          │
│                    └────────────┬────────────┘                          │
│                                 │                                       │
│                    ┌────────────▼────────────┐                          │
│                    │ useMlPredictions Hook   │                          │
│                    │                         │                          │
│                    │ - loading state         │                          │
│                    │ - error handling        │                          │
│                    │ - data caching          │                          │
│                    └────────────┬────────────┘                          │
│                                 │                                       │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
                    HTTP POST/GET │
                                  │
┌─────────────────────────────────▼───────────────────────────────────────┐
│                  BACKEND LAYER (Express)                                 │
│                      Port: 5000                                          │
├───────────────��─────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │              server.js (Main Express App)                    │       │
│  │                                                              │       │
│  │  - CORS Configuration                                       │       │
│  │  - Route Registration                                       │       │
│  │  - Error Handling                                           │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  ┌───────────────��──────────────────────────────────────────────┐       │
│  │              mlRoutes.js (ML Proxy Routes)                   │       │
│  │                                                              │       │
│  │  POST /api/ml/personality-analysis                          │       │
│  │    ├─ Validate input                                        │       │
│  │    ├─ Call ML API                                           │       │
│  │    └─ Return response                                       │       │
│  │                                                              │       │
│  │  POST /api/ml/trip-recommendation                           │       │
│  │    ├─ Validate input                                        │       │
│  │    ├─ Call ML API                                           │       │
│  │    └─ Return response                                       │       │
│  │                                                              │       │
│  │  GET /api/ml/health                                         │       │
│  │    └─ Check ML API status                                   │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                    HTTP POST/GET │
                                  │
┌─────────────────────────────────▼───────────────────────────────────────┐
│                   ML API LAYER (FastAPI)                                 │
│                      Port: 8000                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────��─────────────────────┐       │
│  │              main.py (FastAPI Server)                        │       │
│  │                                                              │       │
│  │  POST /api/personality-analysis                             │       │
│  │    ├─ Receive quiz answers                                  │       │
│  │    ├─ Call ml_models.predict_personality_scores()           │       │
│  │    ├─ Call ml_models.predict_categories()                   │       │
│  │    └─ Return scores + categories                            │       │
│  │                                                              │       │
│  │  POST /api/trip-recommendation                              │       │
│  │    ├─ Receive personality + trip details                    │       │
│  │    ├─ Call ml_models.predict_trip_recommendation()          │       │
│  │    └─ Return destination + activities + budget              │       │
│  │                                                              │       │
│  │  GET /health                                                │       │
│  │    └─ Return health status                                  │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │              ml-model.py (Model Manager)                     │       │
│  │                                                              │       │
│  │  TravelMLModels Class:                                      │       │
│  │    ├─ load_all_models()                                     │       │
│  │    ├─ encode_personality_answers()                          │       │
│  │    ├─ predict_personality_scores()                          │       │
│  │    ├─ predict_categories()                                  │       │
│  │    ├─ predict_trip_recommendation()                         │       │
│  │    ├─ _recommend_destination()                              │       │
│  │    ├─ _generate_activities()                                │       │
│  │    ├─ _calculate_budget_breakdown()                         │       │
│  │    └─ _suggest_group_size()                                 │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                           │
└────────────────────────���────────────────────────────────────────────────┘
                                  │
                                  │
┌─────────────────────────────────▼───────────────────────────────────────┐
│                    ML MODELS LAYER                                       │
│                  ml-server/app/models/                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │ travel_ann_full.h5   │  │ personality_encoder  │                    │
│  │                      │  │ .h5                  │                    │
│  │ Neural Network Model │  │ Personality Model    │                    │
│  │ - Input: Features    │  │ - Input: Answers     │                    │
│  │ - Output: Prediction │  │ - Output: Encoding   │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │ personality_encoder  │  │ trip_encoder.pkl     │  │ categories   │  │
│  │ .pkl                 │  │                      │  │ .pkl         │  │
│  │ Personality Encoder  │  │ Trip Encoder         │  │ Categories   │  │
│  │ - Encodes answers    │  │ - Encodes trip data  │  │ - Encodes    │  │
│  │ - Returns features   │  │ - Returns features   │  │   categories │  ��
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Personality Analysis Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PERSONALITY ANALYSIS FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

User fills Quiz
    │
    ├─ Question 1: "How do you like to spend your time?"
    │  └��� Options: city_culture, scenic_relax, adventure
    │
    ├─ Question 2: "What sparks your curiosity?"
    │  └─ Options: landmarks, hidden_gems, mix
    │
    ├─ Question 3: "How do you recharge?"
    │  └─ Options: lake_scenic, hike_adventure, cafe_social
    │
    └─ Question 4: "How do you prefer to travel?"
       └─ Options: solo, group_new, friends_family

                    ▼

Frontend (Quiz.jsx)
    │
    ├─ Collects all answers
    ├─ Validates input
    └─ Sends POST to /api/ml/personality-analysis

                    ▼

Express Backend (mlRoutes.js)
    │
    ├─ Receives request
    ├─ Validates input
    ├─ Calls ML API
    └─ Returns response

                    ▼

ML API (main.py)
    │
    ├─ Receives quiz answers
    ├─ Calls ml_models.predict_personality_scores()
    │  │
    │  ├─ Encodes answers using encoders
    │  ├─ Runs through personality model
    │  └─ Returns 4 scores (0-1):
    │     ├─ adventure_score
    │     ├─ spiritual_score
    │     ├─ bonding_score
    │     └─ relaxation_score
    │
    ├─ Calls ml_models.predict_categories()
    │  │
    │  ├─ Encodes answers
    │  ├─ Runs through category model
    │  └─ Returns 8 binary categories:
    │     ├─ scenic_escape
    │     ├─ religious
    │     ├─ events
    │     ├─ thrill
    │     ├─ cafes
    │     ├─ modern
    │     ├─ relaxation
    │     └─ seasonal_quiet
    │
    └─ Returns JSON response

                    ▼

Express Backend
    │
    └─ Proxies response to frontend

                    ▼

Frontend (Quiz.jsx)
    │
    ├─ Receives personality scores
    ├─ Determines personality type
    ├─ Stores in UserContext
    └─ Redirects to home page

                    ▼

UserContext
    │
    ├─ Stores personality_scores
    ├─ Stores categories
    ├─ Stores quiz_answers
    └─ Available to all components
```

---

### Trip Recommendation Flow

```
┌──────────────────────────────────────────────────────���──────────────────┐
│                    TRIP RECOMMENDATION FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

User requests recommendations
    │
    ├─ Provides trip details:
    │  ├─ Gender
    │  ├─ Budget
    │  ├─ Duration
    │  ├─ Number of people
    │  └─ Weather preference
    │
    └─ Uses stored personality data

                    ▼

Frontend (Planner.jsx or RecommendationPanel.jsx)
    │
    ├─ Collects trip details
    ├─ Retrieves personality data from UserContext
    ├─ Validates input
    └─ Sends POST to /api/ml/trip-recommendation

                    ▼

Express Backend (mlRoutes.js)
    │
    ├─ Receives request
    ├─ Validates input
    ├─ Calls ML API
    └─ Returns response

                    ▼

ML API (main.py)
    │
    ├─ Receives personality + trip details
    ├─ Calls ml_models.predict_trip_recommendation()
    │  │
    │  ├─ Gets personality scores
    │  ├─ Encodes trip details
    │  ├─ Combines features
    │  ├─ Runs through neural network
    │  │  └─ Predicts trip type
    │  │
    │  ├─ Calls _recommend_destination()
    │  │  └─ Returns destination based on categories
    │  │
    │  ├─ Calls _generate_activities()
    │  │  └─ Returns activity suggestions
    │  │
    │  ├─ Calls _calculate_budget_breakdown()
    │  │  └─ Returns budget allocation
    │  │
    │  └─ Returns complete recommendation:
    │     ├─ trip_type
    │     ├─ destination
    │     ├─ activities
    │     ├─ budget_breakdown
    │     ├─ personality_scores
    │     └─ group_suggestion
    │
    └─ Returns JSON response

                    ▼

Express Backend
    │
    └─ Proxies response to frontend

                    ▼

Frontend (RecommendationPanel.jsx)
    │
    ├─ Receives recommendation
    ├─ Displays destination
    ├─ Shows activities
    ├─ Displays budget breakdown
    ├─ Shows personality scores
    └─ Allows user to refresh

                    ▼

User sees recommendations
    │
    ├─ Can view destination
    ├─ Can see suggested activities
    ├─ Can check budget breakdown
    ├─ Can see personality analysis
    └─ Can request new recommendations
```

---

## Request/Response Examples

### Personality Analysis Request

```json
{
  "spend_time": "adventure",
  "curiosity": "hidden_gems",
  "recharge": "hike_adventure",
  "travel_pref": "group_new"
}
```

### Personality Analysis Response

```json
{
  "success": true,
  "user_id": "test_user",
  "personality_scores": {
    "adventure_score": 0.85,
    "spiritual_score": 0.45,
    "bonding_score": 0.75,
    "relaxation_score": 0.30
  },
  "categories": {
    "scenic_escape": false,
    "religious": false,
    "events": false,
    "thrill": true,
    "cafes": false,
    "modern": false,
    "relaxation": false,
    "seasonal_quiet": false
  },
  "model_version": "v1.0"
}
```

### Trip Recommendation Request

```json
{
  "personality_answers": {
    "spend_time": "adventure",
    "curiosity": "hidden_gems",
    "recharge": "hike_adventure",
    "travel_pref": "group_new"
  },
  "gender": "male",
  "trip_budget": 2000,
  "duration": 7,
  "number_of_people": 4,
  "weather": "sunny"
}
```

### Trip Recommendation Response

```json
{
  "success": true,
  "user_id": "test_user",
  "trip_type": "Adventure Expedition",
  "destination": "Queenstown, NZ",
  "activities": [
    "Adventure sports",
    "Mountain climbing",
    "Water rafting",
    "Try a new adventure sport",
    "Group activities or workshops"
  ],
  "categories": {
    "scenic_escape": false,
    "religious": false,
    "events": false,
    "thrill": true,
    "cafes": false,
    "modern": false,
    "relaxation": false,
    "seasonal_quiet": false
  },
  "personality_scores": {
    "adventure_score": 0.85,
    "spiritual_score": 0.45,
    "bonding_score": 0.75,
    "relaxation_score": 0.30
  },
  "budget_breakdown": {
    "accommodation": 700,
    "food": 500,
    "activities": 400,
    "transport": 300,
    "miscellaneous": 100
  },
  "duration_suggestion": 7,
  "group_suggestion": "Group of 4-8 people (mix of new friends)",
  "model_version": "v1.0"
}
```

---

## Component Hierarchy

```
App
├── Quiz
│   ├── Card
│   ├── Button
│   └── useMlPredictions (hook)
│       └── mlService
│
├── Planner
│   ├── Card
│   ├── Button
│   ├── Modal
│   └── RecommendationPanel
│       ├── Card
│       ├── Button
│       └── useMlPredictions (hook)
│           └── mlService
│
├── Profile
│   ├── Card
│   ├── Button
│   └── UserContext (personality data)
│
└── Other Pages
    └── UserContext (personality data)
```

---

## State Management

```
UserContext
├── user
│   ├── id
│   ├── name
│   ├── email
│   └── preferences
│       ├── vibe (personality type)
│       ├── personality_scores
│       │   ├── adventure_score
│       │   ├── spiritual_score
│       │   ├── bonding_score
│       │   └── relaxation_score
│       ├── categories
│       │   ├── scenic_escape
│       │   ├── religious
│       │   ├── events
│       │   ├── thrill
│       │   ├── cafes
│       │   ├── modern
│       │   ├── relaxation
│       │   └── seasonal_quiet
│       └── quiz_answers
│           ├── spend_time
│           ├── curiosity
│           ├── recharge
│           └── travel_pref
│
└── Methods
    ├── setPersonality()
    ├── updatePreferences()
    └── getPreferences()
```

---

## Error Handling Flow

```
Request
    │
    ├─ Frontend validates input
    │  └─ If invalid → Show error to user
    │
    ├─ Express validates input
    │  └─ If invalid → Return 400 error
    │
    ├─ Express calls ML API
    │  ├─ If timeout → Return 503 error
    │  ├─ If connection error → Return 503 error
    │  └─ If ML API error → Return 500 error
    │
    ├─ ML API processes request
    │  ├─ If model not loaded → Return fallback response
    │  ├─ If encoding error → Return error
    │  └─ If prediction error → Return error
    │
    └─ Frontend handles response
       ├─ If success → Display results
       ├─ If error → Show error message
       └─ If timeout → Show retry button
```

---

## Performance Metrics

```
Expected Response Times:
├─ Personality Analysis: < 2 seconds
├─ Trip Recommendation: < 3 seconds
├─ Health Check: < 1 second
└─ Total Round Trip: < 5 seconds

Model Sizes:
├─ travel_ann_full.h5: ~50-100 MB
├─ personality_encoder.h5: ~10-20 MB
├─ personality_encoder.pkl: ~1-5 MB
├─ trip_encoder.pkl: ~1-5 MB
└─ categories.pkl: ~1-5 MB

Memory Usage:
├─ ML API: ~500 MB - 1 GB
├─ Express Backend: ~100-200 MB
└─ Frontend: ~50-100 MB
```

---

## Deployment Architecture

```
Production Environment:

┌─────────────────────────────────────────────────────────────┐
│                    CDN / Load Balancer                       │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌───��──────────┐
│  Frontend    │    │  Frontend    │    │  Frontend    │
│  (React)     │    │  (React)     │    │  (React)     │
│  Instance 1  │    │  Instance 2  │    │  Instance 3  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Express     │    │  Express     │    │  Express     │
│  Backend     │    │  Backend     │    │  Backend     │
│  Instance 1  │    │  Instance 2  │    │  Instance 3  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  ML API      │    │  ML API      │    │  ML API      │
│  Instance 1  │    │  Instance 2  │    │  Instance 3  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼────────────���──────┘
                            │
                    ┌───────▼────────┐
                    │   Database     │
                    │   (MongoDB)    │
                    └────────────────┘
```

---

This visual guide provides a comprehensive overview of the TRAVIXO ML integration system.
