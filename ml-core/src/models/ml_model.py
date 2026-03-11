import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any
from pathlib import Path
import logging
import tensorflow as tf
from tensorflow import keras

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TravelMLModels:
    def __init__(self, models_dir: str = "app/models"):
        self.models_dir = Path(models_dir)
        self.models = {}
        self.encoders = {}
        self.load_all_models()
        self.setup_encoding_maps()
    
    def setup_encoding_maps(self):
        """Setup encoding maps for categorical features"""
        # Personality question encoding
        self.personality_encoding = {
            'city_culture': [1, 0, 0],
            'scenic_relax': [0, 1, 0],
            'adventure': [0, 0, 1],
            'landmarks': [1, 0, 0],
            'hidden_gems': [0, 1, 0],
            'mix': [0, 0, 1],
            'lake_scenic': [1, 0, 0],
            'hike_adventure': [0, 1, 0],
            'cafe_social': [0, 0, 1],
            'solo': [1, 0, 0],
            'group_new': [0, 1, 0],
            'friends_family': [0, 0, 1]
        }
        
        # Gender encoding
        self.gender_encoding = {
            'male': 0,
            'female': 1,
            'other': 2,
            'prefer_not_to_say': 3
        }
        
        # Weather encoding
        self.weather_encoding = {
            'sunny': 0,
            'rainy': 1,
            'snowy': 2,
            'mixed': 3,
            'any': 4
        }
        
        # Category names
        self.category_names = [
            'scenic_escape', 'religious', 'events', 'thrill',
            'cafes', 'modern', 'relaxation', 'seasonal_quiet'
        ]
    
    def load_all_models(self):
        """Load all three ML models"""
        try:
            # Load personality model
            personality_path = self.models_dir / "personality_model.pkl"
            if personality_path.exists():
                self.models["personality"] = joblib.load(personality_path)
                logger.info("✅ Personality model loaded")
            
            # Load categories model
            categories_path = self.models_dir / "categories.pkl"
            if categories_path.exists():
                self.models["categories"] = joblib.load(categories_path)
                logger.info("✅ Categories model loaded")
            
            # Load trip model
            trip_path = self.models_dir / "trip.pkl"
            if trip_path.exists():
                self.models["trip"] = joblib.load(trip_path)
                logger.info("✅ Trip model loaded")
            
        except Exception as e:
            logger.error(f"❌ Error loading models: {e}")
            self._create_dummy_models()
    
    def _create_dummy_models(self):
        """Create dummy models if loading fails (for testing)"""
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        
        # Dummy personality model (12 features → 4 scores)
        self.models["personality"] = RandomForestClassifier(n_estimators=50, random_state=42)
        X_dummy = np.random.rand(100, 12)
        y_dummy = np.random.rand(100, 4)  # 4 scores
        self.models["personality"].fit(X_dummy, y_dummy)
        
        # Dummy categories model (12 features → 8 binary categories)
        self.models["categories"] = RandomForestClassifier(n_estimators=50, random_state=42)
        y_cat_dummy = np.random.randint(0, 2, (100, 8))
        self.models["categories"].fit(X_dummy, y_cat_dummy)
        
        # Dummy trip model (9 features → trip recommendation)
        self.models["trip"] = RandomForestClassifier(n_estimators=50, random_state=42)
        X_trip_dummy = np.random.rand(100, 9)
        y_trip_dummy = np.random.randint(0, 5, 100)  # 5 trip types
        self.models["trip"].fit(X_trip_dummy, y_trip_dummy)
        
        logger.warning("⚠️ Using dummy models - replace with your actual trained models")
    
    def encode_personality_answers(self, answers: Dict[str, str]) -> np.ndarray:
        """
        Encode personality quiz answers to feature vector
        
        Args:
            answers: Dict with keys:
                'spend_time': 'city_culture'|'scenic_relax'|'adventure'
                'curiosity': 'landmarks'|'hidden_gems'|'mix'
                'recharge': 'lake_scenic'|'hike_adventure'|'cafe_social'
                'travel_pref': 'solo'|'group_new'|'friends_family'
        
        Returns:
            numpy array of shape (12,) - one-hot encoded features
        """
        try:
            # Validate inputs
            valid_spend = ['city_culture', 'scenic_relax', 'adventure']
            valid_curiosity = ['landmarks', 'hidden_gems', 'mix']
            valid_recharge = ['lake_scenic', 'hike_adventure', 'cafe_social']
            valid_pref = ['solo', 'group_new', 'friends_family']
            
            spend = answers.get('spend_time', 'city_culture')
            curiosity = answers.get('curiosity', 'mix')
            recharge = answers.get('recharge', 'lake_scenic')
            pref = answers.get('travel_pref', 'solo')
            
            # Encode each answer
            spend_encoded = self.personality_encoding[spend]
            curiosity_encoded = self.personality_encoding[curiosity]
            recharge_encoded = self.personality_encoding[recharge]
            pref_encoded = self.personality_encoding[pref]
            
            # Combine all features
            features = np.concatenate([
                spend_encoded,
                curiosity_encoded,
                recharge_encoded,
                pref_encoded
            ])
            
            return features.reshape(1, -1)
            
        except KeyError as e:
            logger.error(f"Invalid answer key: {e}")
            # Return default encoding
            return np.array([[1,0,0, 0,1,0, 1,0,0, 1,0,0]])
    
    def predict_personality_scores(self, answers: Dict[str, str]) -> Dict[str, float]:
        """
        Predict personality scores from quiz answers
        
        Returns:
            Dict with 4 scores (0-1):
            - adventure_score
            - spiritual_score (from city_culture/religious interest)
            - bonding_score (from social preferences)
            - relaxation_score
        """
        try:
            # Encode answers
            features = self.encode_personality_answers(answers)
            
            # Predict using personality model
            if "personality" in self.models:
                scores = self.models["personality"].predict(features)[0]
            else:
                # Fallback logic based on answers
                spend = answers.get('spend_time', 'city_culture')
                curiosity = answers.get('curiosity', 'mix')
                recharge = answers.get('recharge', 'lake_scenic')
                pref = answers.get('travel_pref', 'solo')
                
                # Calculate scores heuristically
                adventure = 1.0 if spend == 'adventure' or recharge == 'hike_adventure' else 0.3
                spiritual = 1.0 if spend == 'city_culture' and curiosity == 'landmarks' else 0.4
                bonding = 1.0 if pref in ['group_new', 'friends_family'] else 0.2
                relaxation = 1.0 if spend == 'scenic_relax' or recharge == 'lake_scenic' else 0.3
                
                scores = [adventure, spiritual, bonding, relaxation]
            
            return {
                "adventure_score": float(scores[0]),
                "spiritual_score": float(scores[1]),
                "bonding_score": float(scores[2]),
                "relaxation_score": float(scores[3])
            }
            
        except Exception as e:
            logger.error(f"Personality prediction error: {e}")
            return {
                "adventure_score": 0.5,
                "spiritual_score": 0.5,
                "bonding_score": 0.5,
                "relaxation_score": 0.5
            }
    
    def predict_categories(self, answers: Dict[str, str]) -> Dict[str, bool]:
        """
        Predict which categories match the user
        
        Returns:
            Dict with 8 binary categories
        """
        try:
            # Encode answers
            features = self.encode_personality_answers(answers)
            
            # Predict categories
            if "categories" in self.models:
                predictions = self.models["categories"].predict(features)[0]
            else:
                # Fallback based on answers
                predictions = [0, 0, 0, 0, 0, 0, 0, 0]
                
                spend = answers.get('spend_time')
                recharge = answers.get('recharge')
                
                if spend == 'scenic_relax' or recharge == 'lake_scenic':
                    predictions[0] = 1  # scenic_escape
                    predictions[6] = 1  # relaxation
                    predictions[7] = 1  # seasonal_quiet
                
                if spend == 'city_culture':
                    predictions[1] = 1  # religious (cultural/religious sites)
                    predictions[2] = 1  # events
                
                if spend == 'adventure' or recharge == 'hike_adventure':
                    predictions[3] = 1  # thrill
                
                if recharge == 'cafe_social':
                    predictions[4] = 1  # cafes
                    predictions[5] = 1  # modern
            
            # Convert to dict with category names
            categories = {}
            for i, cat_name in enumerate(self.category_names):
                categories[cat_name] = bool(predictions[i])
            
            return categories
            
        except Exception as e:
            logger.error(f"Categories prediction error: {e}")
            return {cat: False for cat in self.category_names}
    
    def predict_trip_recommendation(self, 
                                   personality_answers: Dict[str, str],
                                   trip_details: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict trip recommendations based on personality + trip details
        
        Args:
            personality_answers: Personality quiz answers
            trip_details: Dict with:
                - gender: str
                - trip_budget: float
                - duration: int
                - number_of_people: int
                - weather: str
                # adventure/spiritual/bonding/relaxation will be from personality
        
        Returns:
            Trip recommendation with destination, type, and activities
        """
        try:
            # Step 1: Get personality scores
            personality_scores = self.predict_personality_scores(personality_answers)
            
            # Step 2: Encode trip details
            gender_encoded = self.gender_encoding.get(
                trip_details.get('gender', 'prefer_not_to_say'), 
                3
            )
            
            weather_encoded = self.weather_encoding.get(
                trip_details.get('weather', 'any'),
                4
            )
            
            # Step 3: Prepare feature vector for trip model
            trip_features = np.array([[
                float(gender_encoded),
                float(trip_details.get('trip_budget', 1000)),
                float(trip_details.get('duration', 7)),
                float(trip_details.get('number_of_people', 2)),
                float(weather_encoded),
                personality_scores['adventure_score'],
                personality_scores['spiritual_score'],
                personality_scores['bonding_score'],
                personality_scores['relaxation_score']
            ]])
            
            # Step 4: Predict with trip model
            if "trip" in self.models:
                trip_prediction = self.models["trip"].predict(trip_features)[0]
                
                # Assuming trip_prediction is an index (0-4) for trip types
                trip_types = [
                    "Cultural Heritage Tour",
                    "Adventure Expedition", 
                    "Relaxation Retreat",
                    "Social Exploration",
                    "Mixed Experience"
                ]
                trip_type = trip_types[trip_prediction % len(trip_types)]
            else:
                # Fallback logic
                if personality_scores['adventure_score'] > 0.7:
                    trip_type = "Adventure Expedition"
                elif personality_scores['relaxation_score'] > 0.7:
                    trip_type = "Relaxation Retreat"
                elif personality_scores['spiritual_score'] > 0.7:
                    trip_type = "Cultural Heritage Tour"
                else:
                    trip_type = "Mixed Experience"
            
            # Step 5: Get categories for activity suggestions
            categories = self.predict_categories(personality_answers)
            
            # Step 6: Generate destination based on categories
            destination = self._recommend_destination(categories, trip_details)
            
            # Step 7: Generate activities based on categories
            activities = self._generate_activities(categories, personality_scores)
            
            # Step 8: Generate budget breakdown
            budget_breakdown = self._calculate_budget_breakdown(
                trip_details.get('trip_budget', 1000),
                trip_details.get('duration', 7),
                categories
            )
            
            return {
                "success": True,
                "trip_type": trip_type,
                "destination": destination,
                "activities": activities,
                "categories": categories,
                "personality_scores": personality_scores,
                "budget_breakdown": budget_breakdown,
                "duration_suggestion": trip_details.get('duration', 7),
                "group_suggestion": self._suggest_group_size(personality_answers, trip_details)
            }
            
        except Exception as e:
            logger.error(f"Trip recommendation error: {e}")
            return {
                "success": False,
                "error": str(e),
                "trip_type": "Mixed Experience",
                "destination": "Multiple options available",
                "activities": ["Local exploration", "Cultural activities", "Free time"]
            }
    
    # Helper methods for trip recommendations
    def _recommend_destination(self, categories: Dict[str, bool], trip_details: Dict) -> str:
        """Recommend destination based on categories"""
        budget = trip_details.get('trip_budget', 1000)
        duration = trip_details.get('duration', 7)
        
        destination_map = {
            'scenic_escape': ['Swiss Alps', 'Norwegian Fjords', 'New Zealand'],
            'religious': ['Varanasi, India', 'Jerusalem', 'Mecca'],
            'events': ['Rio Carnival', 'Oktoberfest Munich', 'Holi Festival'],
            'thrill': ['Queenstown, NZ', 'Interlaken, Switzerland', 'Cape Town'],
            'cafes': ['Vienna', 'Paris', 'Melbourne'],
            'modern': ['Tokyo', 'Seoul', 'Singapore'],
            'relaxation': ['Bali', 'Maldives', 'Greek Islands'],
            'seasonal_quiet': ['Kyoto in autumn', 'Swedish Lapland', 'Canadian Rockies']
        }
        
        # Find matching categories
        matched_categories = [cat for cat, is_match in categories.items() if is_match]
        
        if not matched_categories:
            return "Bali, Indonesia"  # Default
        
        # Get destinations for matched categories
        possible_destinations = []
        for cat in matched_categories[:2]:  # Take top 2 categories
            possible_destinations.extend(destination_map.get(cat, []))
        
        # Remove duplicates and select
        possible_destinations = list(set(possible_destinations))
        
        # Budget filter
        if budget < 800:
            affordable_dests = ['Bali', 'Thailand', 'Portugal', 'Vietnam']
            for dest in affordable_dests:
                if dest in possible_destinations:
                    return dest
        
        return possible_destinations[0] if possible_destinations else "Bali, Indonesia"
    
    def _generate_activities(self, categories: Dict[str, bool], personality_scores: Dict) -> List[str]:
        """Generate activity suggestions based on categories"""
        activities = []
        
        activity_map = {
            'scenic_escape': ['Nature photography', 'Scenic hikes', 'Sunset watching'],
            'religious': ['Temple visits', 'Spiritual ceremonies', 'Historical tours'],
            'events': ['Festival participation', 'Local event attendance', 'Cultural shows'],
            'thrill': ['Adventure sports', 'Mountain climbing', 'Water rafting'],
            'cafes': ['Cafe hopping', 'Coffee tasting', 'Local bakery tours'],
            'modern': ['Tech museum visits', 'Modern art galleries', 'Urban exploration'],
            'relaxation': ['Spa treatments', 'Beach relaxation', 'Meditation sessions'],
            'seasonal_quiet': ['Forest walks', 'Bird watching', 'Stargazing']
        }
        
        # Add activities for matched categories
        for category, is_match in categories.items():
            if is_match and category in activity_map:
                activities.extend(activity_map[category][:2])
        
        # Add personality-based activities
        if personality_scores['adventure_score'] > 0.7:
            activities.append('Try a new adventure sport')
        if personality_scores['bonding_score'] > 0.7:
            activities.append('Group activities or workshops')
        if personality_scores['spiritual_score'] > 0.7:
            activities.append('Visit historical monuments')
        
        # Ensure unique activities
        return list(set(activities))[:6]  # Return top 6
    
    def _calculate_budget_breakdown(self, total_budget: float, duration: int, categories: Dict) -> Dict[str, float]:
        """Calculate budget breakdown"""
        daily_budget = total_budget / max(duration, 1)
        
        # Base allocation
        breakdown = {
            "accommodation": 0.35 * total_budget,
            "food": 0.25 * total_budget,
            "activities": 0.20 * total_budget,
            "transport": 0.15 * total_budget,
            "miscellaneous": 0.05 * total_budget
        }
        
        # Adjust based on categories
        if categories.get('thrill'):
            breakdown['activities'] += 0.1 * total_budget
            breakdown['accommodation'] -= 0.1 * total_budget
        
        if categories.get('relaxation'):
            breakdown['accommodation'] += 0.1 * total_budget
            breakdown['activities'] -= 0.1 * total_budget
        
        # Round to 2 decimal places
        for key in breakdown:
            breakdown[key] = round(breakdown[key], 2)
        
        return breakdown
    
    def _suggest_group_size(self, personality_answers: Dict, trip_details: Dict) -> str:
        """Suggest ideal group size based on personality"""
        pref = personality_answers.get('travel_pref', 'solo')
        
        if pref == 'solo':
            return "Solo travel recommended"
        elif pref == 'group_new':
            return "Group of 4-8 people (mix of new friends)"
        elif pref == 'friends_family':
            current_group = trip_details.get('number_of_people', 2)
            if current_group <= 2:
                return "Perfect for couples or close friends"
            else:
                return f"Great for your group of {current_group}"
        
        return "2-4 people ideal"

# Create singleton instance
ml_models = TravelMLModels()
