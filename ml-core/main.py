from src.models.ml_model import ml_models
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import httpx
import json
import sys
from pathlib import Path

# Add app directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))


app = FastAPI(title="Travel ML API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models


class UserPreferences(BaseModel):
    adventure: float = 0
    relaxation: float = 0
    culture: float = 0
    food: float = 0
    budget: str = "medium"


class TripRequest(BaseModel):
    user_id: str
    preferences: UserPreferences
    days: int = 7
    location: Optional[str] = None


class ChatMessage(BaseModel):
    message: str
    trip_context: Optional[Dict] = None


class PersonalityQuizRequest(BaseModel):
    """Personality quiz answers from frontend"""
    spend_time: str  # 'city_culture', 'scenic_relax', 'adventure'
    curiosity: str  # 'landmarks', 'hidden_gems', 'mix'
    recharge: str  # 'lake_scenic', 'hike_adventure', 'cafe_social'
    travel_pref: str  # 'solo', 'group_new', 'friends_family'


class TripDetailsRequest(BaseModel):
    """Trip details for recommendation"""
    personality_answers: PersonalityQuizRequest
    gender: str = "prefer_not_to_say"
    trip_budget: float = 1000
    duration: int = 7
    number_of_people: int = 2
    weather: str = "any"


# Dependency to verify JWT from Express API (optional - can be disabled for testing)


async def verify_token(authorization: Optional[str] = Header(None)):
    """Verify JWT token from Express API"""
    if not authorization:
        # For development, allow requests without token
        return {"user_id": "test_user"}

    try:
        # In production, verify with your Express API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://localhost:5000/api/auth/me",
                headers={"Authorization": authorization},
                timeout=5.0
            )
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        print(f"Token verification error: {e}")

    # For development, allow requests
    return {"user_id": "test_user"}

# Routes


@app.get("/")
async def root():
    return {
        "service": "Travel ML API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": [
            "/api/personality-analysis",
            "/api/trip-recommendation",
            "/api/chat",
            "/health"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ML API",
        "models_loaded": len(ml_models.models) > 0
    }


@app.post("/api/personality-analysis")
async def analyze_personality(quiz: PersonalityQuizRequest, user=Depends(verify_token)):
    """
    Analyze personality quiz answers and return personality scores

    Input:
    {
        "spend_time": "adventure",
        "curiosity": "hidden_gems",
        "recharge": "hike_adventure",
        "travel_pref": "group_new"
    }

    Output:
    {
        "adventure_score": 0.85,
        "spiritual_score": 0.45,
        "bonding_score": 0.75,
        "relaxation_score": 0.30,
        "categories": {...}
    }
    """
    try:
        answers = {
            "spend_time": quiz.spend_time,
            "curiosity": quiz.curiosity,
            "recharge": quiz.recharge,
            "travel_pref": quiz.travel_pref
        }

        # Get personality scores
        personality_scores = ml_models.predict_personality_scores(answers)

        # Get categories
        categories = ml_models.predict_categories(answers)

        return {
            "success": True,
            "user_id": user.get("user_id", "test_user"),
            "personality_scores": personality_scores,
            "categories": categories,
            "model_version": "v1.0"
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "personality_scores": {
                "adventure_score": 0.5,
                "spiritual_score": 0.5,
                "bonding_score": 0.5,
                "relaxation_score": 0.5
            }
        }


@app.post("/api/trip-recommendation")
async def get_trip_recommendation(request: TripDetailsRequest, user=Depends(verify_token)):
    """
    Get AI-powered trip recommendations based on personality and trip details

    Input:
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

    Output:
    {
        "success": true,
        "trip_type": "Adventure Expedition",
        "destination": "Queenstown, NZ",
        "activities": [...],
        "budget_breakdown": {...},
        "personality_scores": {...}
    }
    """
    try:
        answers = {
            "spend_time": request.personality_answers.spend_time,
            "curiosity": request.personality_answers.curiosity,
            "recharge": request.personality_answers.recharge,
            "travel_pref": request.personality_answers.travel_pref
        }

        trip_details = {
            "gender": request.gender,
            "trip_budget": request.trip_budget,
            "duration": request.duration,
            "number_of_people": request.number_of_people,
            "weather": request.weather
        }

        # Get recommendation
        recommendation = ml_models.predict_trip_recommendation(
            answers, trip_details)

        return {
            "success": True,
            "user_id": user.get("user_id", "test_user"),
            **recommendation,
            "model_version": "v1.0"
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "trip_type": "Mixed Experience",
            "destination": "Multiple options available",
            "activities": ["Local exploration", "Cultural activities", "Free time"]
        }


@app.post("/api/chat")
async def chat_with_ai(chat: ChatMessage, user=Depends(verify_token)):
    """AI chat for travel planning"""
    try:
        message = chat.message.lower()

        # Extract intent from message
        if any(word in message for word in ['beach', 'relax', 'chill', 'ocean', 'sea']):
            trip_type = "Relaxation Retreat"
            destinations = ["Bali", "Maldives", "Greek Islands", "Cancun"]
            activities = ["Beach relaxation", "Spa treatments",
                          "Sunset watching", "Snorkeling"]
        elif any(word in message for word in ['adventure', 'hike', 'climb', 'trek', 'extreme']):
            trip_type = "Adventure Expedition"
            destinations = ["Queenstown", "Interlaken", "Patagonia", "Nepal"]
            activities = ["Mountain climbing", "Hiking",
                          "Paragliding", "Rock climbing"]
        elif any(word in message for word in ['culture', 'history', 'museum', 'temple', 'art']):
            trip_type = "Cultural Heritage Tour"
            destinations = ["Paris", "Rome", "Kyoto", "Cairo"]
            activities = ["Museum visits", "Historical tours",
                          "Temple visits", "Art galleries"]
        elif any(word in message for word in ['food', 'eat', 'cuisine', 'restaurant', 'cook']):
            trip_type = "Culinary Journey"
            destinations = ["Bangkok", "Tokyo", "Barcelona", "Istanbul"]
            activities = ["Cooking classes", "Food tours",
                          "Market visits", "Restaurant hopping"]
        else:
            trip_type = "Mixed Experience"
            destinations = ["Bali", "Paris", "Tokyo", "New York"]
            activities = ["Local exploration",
                          "Cultural activities", "Adventure sports", "Dining"]

        # Generate suggestions
        suggestions = [
            {
                "title": f"{trip_type} - {destinations[0]}",
                "description": f"A perfect {trip_type.lower()} to {destinations[0]}",
                "locations": [destinations[0]],
                "duration": 7,
                "budget": 2000,
                "activities": activities[:3]
            },
            {
                "title": f"{trip_type} - {destinations[1]}",
                "description": f"Experience {trip_type.lower()} in {destinations[1]}",
                "locations": [destinations[1]],
                "duration": 5,
                "budget": 1500,
                "activities": activities[1:4]
            }
        ]

        return {
            "success": True,
            "response": f"Great! Based on your interest in {message}, I recommend a {trip_type}. Here are some suggestions:",
            "suggestions": suggestions,
            "trip_type": trip_type
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "response": "Sorry, I couldn't process your request. Please try again."
        }


@app.post("/api/generate-trip")
async def generate_trip(request: TripDetailsRequest, user=Depends(verify_token)):
    """Generate trip from chat message"""
    try:
        # Get personality scores
        personality_scores = ml_models.predict_personality_scores(
            request.personality_answers.dict() if hasattr(request.personality_answers,
                                                          'dict') else request.personality_answers
        )

        # Get categories
        categories = ml_models.predict_categories(
            request.personality_answers.dict() if hasattr(request.personality_answers,
                                                          'dict') else request.personality_answers
        )

        # Generate destination
        destination = ml_models._recommend_destination(categories, {
            'trip_budget': request.trip_budget,
            'duration': request.duration
        })

        # Generate activities
        activities = ml_models._generate_activities(
            categories, personality_scores)

        # Generate budget breakdown
        budget_breakdown = ml_models._calculate_budget_breakdown(
            request.trip_budget,
            request.duration,
            categories
        )

        # Generate itinerary
        itinerary = []
        for day in range(request.duration):
            day_activities = []
            for i, activity in enumerate(activities):
                if i % request.duration == day:
                    day_activities.append({
                        "id": f"activity_{day}_{i}",
                        "type": "activity",
                        "time": f"{9 + (i % 8)}:00 AM",
                        "title": activity,
                        "meta": f"Day {day + 1} activity"
                    })

            itinerary.append({
                "day": day + 1,
                "label": f"Day {day + 1}",
                "date": f"2024-01-{15 + day}",
                "items": day_activities if day_activities else [{
                    "id": f"activity_{day}_0",
                    "type": "activity",
                    "time": "10:00 AM",
                    "title": "Explore local area",
                    "meta": "Free time"
                }]
            })

        trip = {
            "id": f"trip_{int(time.time())}",
            "title": f"{destination} Adventure",
            "description": f"A {request.duration}-day trip to {destination}",
            "locations": [destination],
            "dates": {
                "start": "2024-01-15",
                "end": f"2024-01-{15 + request.duration}"
            },
            "duration": request.duration,
            "budget": {
                "total": request.trip_budget,
                "currency": "USD",
                "breakdown": budget_breakdown
            },
            "itinerary": itinerary,
            "personality_match": personality_scores,
            "categories": categories
        }

        return {
            "success": True,
            "trip": trip
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "trip": None
        }


@app.post("/api/suggestions")
async def get_suggestions(preferences: Dict, user=Depends(verify_token)):
    """Get travel suggestions based on preferences"""
    try:
        # Extract preferences
        adventure = preferences.get('adventure', 0.5)
        budget = preferences.get('budget', 2000)
        duration = preferences.get('duration', 7)

        # Generate suggestions based on preferences
        suggestions = []

        if adventure > 0.7:
            suggestions.append({
                "title": "Adventure Expedition",
                "description": "High-adrenaline activities and outdoor adventures",
                "destinations": ["Queenstown", "Interlaken", "Patagonia"],
                "budget": budget,
                "duration": duration
            })

        if adventure < 0.3:
            suggestions.append({
                "title": "Relaxation Retreat",
                "description": "Peaceful and rejuvenating experiences",
                "destinations": ["Bali", "Maldives", "Greek Islands"],
                "budget": budget,
                "duration": duration
            })

        suggestions.append({
            "title": "Cultural Journey",
            "description": "Explore history, art, and local culture",
            "destinations": ["Paris", "Rome", "Kyoto"],
            "budget": budget,
            "duration": duration
        })

        return {
            "success": True,
            "suggestions": suggestions
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "suggestions": []
        }

if __name__ == "__main__":
    import uvicorn
    import time
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
