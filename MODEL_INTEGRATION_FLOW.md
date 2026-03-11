# ML Model Integration - Visual Flow

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER OPENS QUIZ PAGE                             │
│                    http://localhost:5173/quiz                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND: Quiz.jsx Component                          │
│                                                                           │
│  Question 1: "How do you like to spend your time?"                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ City culture & landmarks                                      │   │
│  │ ○ Scenic views & relaxation                                    │   │
│  │ ● Adventure & thrill                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Question 2: "What sparks your curiosity?"                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ Famous landmarks                                              │   │
│  │ ● Hidden gems & local spots                                    │   │
│  │ ○ Mix of both                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Question 3: "How do you recharge?"                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ By a lake or scenic spot                                      │   │
│  │ ● Hiking or adventure                                          │   │
│  │ ○ Cafes & social spaces                                        │   │
│  └─────────────────────────────────────────────────────���───────────┘   │
│                                                                           │
│  Question 4: "How do you prefer to travel?"                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ Solo                                                           │   │
│  │ ● Group of new friends                                         │   │
│  │ ○ Friends or family                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  [Back] [Get My Vibe]                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                        USER CLICKS "Get My Vibe"
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND: Collect Answers                             │
│                                                                           │
│  answers = {                                                             │
│    "spend_time": "adventure",                                           │
│    "curiosity": "hidden_gems",                                          │
│    "recharge": "hike_adventure",                                        │
│    "travel_pref": "group_new"                                           │
│  }                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              FRONTEND: Send to Express Backend                           │
│                                                                           │
│  fetch("http://localhost:5000/api/ml/personality-analysis", {          │
│    method: "POST",                                                       │
│    headers: { "Content-Type": "application/json" },                     │
│    body: JSON.stringify(answers)                                        │
│  })                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    HTTP POST Request (Port 5000)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│            EXPRESS BACKEND: mlRoutes.js                                  │
│                                                                           │
│  router.post('/personality-analysis', async (req, res) => {            │
│    // 1. Validate input                                                 │
│    // 2. Call ML API                                                    │
│    // 3. Return response                                                │
│  })                                                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    HTTP POST Request (Port 8000)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              ML API: main.py (FastAPI)                                   │
│                                                                           │
│  @app.post("/api/personality-analysis")                                 │
│  async def analyze_personality(quiz: PersonalityQuizRequest):          │
│    # 1. Receive quiz answers                                            │
│    # 2. Call ml_models.predict_personality_scores()                    │
│    # 3. Call ml_models.predict_categories()                            │
│    # 4. Return scores and categories                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│         ML MODELS: ml_model.py (TravelMLModels Class)                   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 1: Load Models                                             │   │
│  │ ├─ Load travel_ann_full.h5 (Neural Network)                    │   │
│  │ ├─ Load personality_encoder.h5 (Personality Model)             │   │
│  │ ├─ Load personality_encoder.pkl (Encoder)                      │   │
│  │ ├─ Load trip_encoder.pkl (Encoder)                             │   │
│  │ └─ Load categories.pkl (Encoder)                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 2: Encode Quiz Answers                                     │   │
│  │                                                                  │   │
│  │ Input:                                                           │   │
│  │ {                                                                │   │
│  │   "spend_time": "adventure",                                    │   │
│  │   "curiosity": "hidden_gems",                                   │   │
│  │   "recharge": "hike_adventure",                                 │   │
│  │   "travel_pref": "group_new"                                    │   │
│  │ }                                                                │   │
│  │                                                                  │   │
│  │ Encoding:                                                        │   │
│  │ adventure → [0, 0, 1]                                           │   │
│  │ hidden_gems → [0, 1, 0]                                         │   │
│  │ hike_adventure → [0, 1, 0]                                      │   │
│  │ group_new → [0, 1, 0]                                           │   │
│  │                                                                  │   │
│  │ Output: [0,0,1, 0,1,0, 0,1,0, 0,1,0] (12 features)            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 3: Run Through Personality Model                           │   │
│  │                                                                  │   │
│  │ Input: [0,0,1, 0,1,0, 0,1,0, 0,1,0]                            │   │
│  │ Model: personality_encoder.h5 (Neural Network)                  │   │
│  │ Output: [0.85, 0.45, 0.75, 0.30]                               │   │
│  │         (adventure, spiritual, bonding, relaxation)             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 4: Run Through Categories Model                            │   │
│  │                                                                  │   │
│  │ Input: [0,0,1, 0,1,0, 0,1,0, 0,1,0]                            │   │
│  │ Model: categories.pkl (Classifier)                              │   │
│  │ Output: [0, 0, 0, 1, 0, 0, 0, 0]                               │   │
│  │         (thrill category matched)                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Step 5: Format Response                                         │   │
│  │                                                                  │   │
│  │ {                                                                │   │
│  │   "success": true,                                              │   │
│  │   "personality_scores": {                                       │   │
│  │     "adventure_score": 0.85,                                    │   │
│  │     "spiritual_score": 0.45,                                    │   │
│  │     "bonding_score": 0.75,                                      │   │
│  │     "relaxation_score": 0.30                                    │   │
│  │   },                                                             │   │
│  │   "categories": {                                               │   │
│  │     "scenic_escape": false,                                     │   │
│  │     "religious": false,                                         │   │
│  │     "events": false,                                            │   │
│  │     "thrill": true,                                             │   │
│  │     "cafes": false,                                             │   │
│  │     "modern": false,                                            │   │
│  │     "relaxation": false,                                        │   │
│  │     "seasonal_quiet": false                                     │   │
│  │   }                                                              │   │
│  │ }                                                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    HTTP Response (JSON)
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│            EXPRESS BACKEND: Return to Frontend                           │
│                                                                           │
│  res.json(response)  // Proxies ML API response                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    HTTP Response (Port 5000)
                                    ↓
┌─────────────────────────────────────────────────────────────���───────────┐
│              FRONTEND: Process Response                                  │
│                                                                           │
│  if (data.success) {                                                     │
│    // 1. Determine personality type                                      │
│    const personalityType = determinePersonalityType(                    │
│      data.personality_scores                                            │
│    );                                                                     │
│    // Result: "The Explorer"                                            │
│                                                                           │
│    // 2. Store in UserContext                                           │
│    setPersonality(personalityType);                                     │
│    updatePreferences({                                                  │
│      vibe: personalityType,                                             │
│      personality_scores: data.personality_scores,                       │
│      categories: data.categories,                                       │
│      quiz_answers: answers                                              │
│    });                                                                    │
│                                                                           │
│    // 3. Navigate to home                                               │
│    navigate("/home");                                                   │
│  }                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND: Display Results                             │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Your Personality: The Explorer                                  │   │
│  │                                                                  │   │
│  │ Adventure Score:    ████████░░ 85%                             │   │
│  │ Spiritual Score:    ████░░░░░░ 45%                             │   │
│  │ Bonding Score:      ███████░░░ 75%                             │   │
│  │ Relaxation Score:   ███░░░░░░░ 30%                             │   │
│  │                                                                  │   │
│  │ Recommended Activities:                                         │   │
│  │ • Adventure sports                                              │   │
│  │ • Mountain climbing                                             │   │
│  │ • Water rafting                                                 │   │
│  │ • Group activities or workshops                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Data stored in UserContext:                                            │
│  {                                                                        │
│    personality: "The Explorer",                                         │
│    personality_scores: {...},                                           │
│    categories: {...},                                                   │
│    quiz_answers: {...}                                                  │
│  }                                                                        │
│                                                                           │
│  Available to all pages:                                                │
│  • Profile page                                                          │
│  • Planner page                                                          │
│  • Recommendation panel                                                  │
│  • Any other component                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Model Files & Their Roles

```
ml-server/app/models/
│
├── travel_ann_full.h5
│   ├─ Type: Neural Network (Keras/TensorFlow)
│   ├─ Purpose: Main prediction model
│   ├─ Input: Encoded features (personality + trip details)
│   ├─ Output: Trip type, destination, activities
│   └─ Used in: Trip recommendation endpoint
│
├─�� personality_encoder.h5
│   ├─ Type: Neural Network (Keras/TensorFlow)
│   ├─ Purpose: Encode personality quiz answers
│   ├─ Input: Quiz answers
│   ├─ Output: Personality scores (4 values)
│   └─ Used in: Personality analysis endpoint
│
├── personality_encoder.pkl
│   ├─ Type: Scikit-learn Encoder
│   ├─ Purpose: Encode personality answers
│   ├─ Input: Quiz answers
│   ├─ Output: Feature vector
│   └─ Used in: Feature encoding
│
├── trip_encoder.pkl
│   ├─ Type: Scikit-learn Encoder
│   ├─ Purpose: Encode trip details
│   ├─ Input: Trip details (budget, duration, etc.)
│   ├─ Output: Feature vector
│   └─ Used in: Feature encoding
│
└── categories.pkl
    ├─ Type: Scikit-learn Classifier
    ├─ Purpose: Classify activity categories
    ├─ Input: Encoded features
    ├─ Output: 8 binary category predictions
    └─ Used in: Category prediction
```

---

## Data Flow Through Models

```
Quiz Answers
    ↓
┌─────────────────────────────────────────┐
��� Encoding Layer                          │
│ (personality_encoder.pkl)               │
│                                         │
│ Input: {                                │
│   "spend_time": "adventure",            │
│   "curiosity": "hidden_gems",           │
│   "recharge": "hike_adventure",         │
│   "travel_pref": "group_new"            │
│ }                                       │
│                                         │
│ Output: [0,0,1, 0,1,0, 0,1,0, 0,1,0]  │
│         (12 features)                   │
└─────────────────────────────────────────┘
    ↓
    ├─────────────────────────────────────────┐
    │ Personality Model                       │
    │ (personality_encoder.h5)                │
    │                                         │
    │ Input: [0,0,1, 0,1,0, 0,1,0, 0,1,0]   │
    │ Output: [0.85, 0.45, 0.75, 0.30]      │
    │         (4 personality scores)         │
    └─────────────────────────────────────────┘
    │
    └─────────────────────────────────────────┐
        │ Categories Model                    │
        │ (categories.pkl)                    │
        │                                     │
        │ Input: [0,0,1, 0,1,0, 0,1,0, 0,1,0]│
        │ Output: [0,0,0,1,0,0,0,0]          │
        │         (8 category predictions)    │
        └─────────────────────────────────────┘
    │
    ↓
Frontend receives:
{
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
  }
}
```

---

## Component Communication

```
┌─────────────────────��────────────────────────────────────────────┐
│                         Frontend (React)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Quiz.jsx                                                    │ │
│  │ - Collects quiz answers                                    │ │
│  │ - Calls mlService.analyzePersonality()                     │ │
│  │ - Stores results in UserContext                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ mlService.js                                                │ │
│  │ - fetch() to Express backend                               │ │
│  │ - Returns JSON response                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌─────────────────────��───────────────────────────────────────┐ │
│  │ UserContext.jsx                                             │ │
│  │ - Stores personality data                                  │ │
│  │ - Available to all components                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ RecommendationPanel.jsx                                     │ │
│  │ - Displays personality scores                              │ │
│  │ - Shows recommendations                                    │ │
│  │ - Reads from UserContext                                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
                    HTTP Requests
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                  Express Backend (Node.js)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────��───────────┐ │
│  │ mlRoutes.js                                                 │ │
│  │ - Receives POST requests                                   │ │
│  │ - Validates input                                          │ │
│  │ - Proxies to ML API                                        │ │
│  │ - Returns response to frontend                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
                    HTTP Requests
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                   ML API (Python/FastAPI)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ main.py                                                     │ │
│  │ - Receives POST requests                                   │ │
│  │ - Calls ml_models functions                                │ │
│  │ - Returns JSON response                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ml_model.py (TravelMLModels)                                │ │
│  │ - Loads .h5 and .pkl models                                │ │
│  │ - Encodes input features                                   │ │
│  │ - Runs predictions                                         │ │
│  │ - Returns scores and categories                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Model Files                                                 │ │
│  │ - travel_ann_full.h5                                        │ │
│  │ - personality_encoder.h5                                    │ │
│  │ - personality_encoder.pkl                                   │ │
│  │ - trip_encoder.pkl                                          │ │
│  │ - categories.pkl                                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

**Status:** ✅ Models Fully Integrated & Functional
