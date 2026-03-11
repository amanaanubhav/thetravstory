# ml_model.py
import pickle
import numpy as np
from typing import Dict, List, Any, Optional
import logging
import warnings

warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TravelMLModels:
    def __init__(self, models_dir: str = "."):
        self.models_dir = models_dir
        self.feature_names = {}
        self.encoders = {}
        self.models = {}
        self.setup_features_and_encoders()

    def setup_features_and_encoders(self):
        """Load feature names and setup encoding logic"""
        try:
            # Load personality feature names
            with open(f"{self.models_dir}/personality_model.pkl", "rb") as f:
                personality_features = pickle.load(f)
            self.feature_names["personality"] = personality_features
            logger.info(
                f"✅ Loaded {len(personality_features)} personality features")

            # Parse question structure from feature names
            self.question_mapping = self._parse_questions_from_features(
                personality_features)

        except Exception as e:
            logger.error(f"❌ Error loading feature names: {e}")
            self._create_default_features()

    def _parse_questions_from_features(self, features: List[str]) -> Dict[str, List[str]]:
        """Parse feature names to understand question structure"""
        questions = {}

        for feature in features:
            # Format: "ohe__Question Text_Answer Text"
            if feature.startswith("ohe__"):
                # Remove "ohe__" prefix
                clean = feature[5:]

                # Find last underscore separating question from answer
                last_underscore = clean.rfind("_")
                if last_underscore != -1:
                    question = clean[:last_underscore]
                    answer = clean[last_underscore + 1:]

                    if question not in questions:
                        questions[question] = []
                    questions[question].append(answer)

        logger.info(f"📋 Found {len(questions)} questions:")
        for q, answers in questions.items():
            logger.info(f"  • {q[:50]}... → {len(answers)} options")

        return questions

    def encode_personality_answers(self, answers: Dict[str, str]) -> np.ndarray:
        """
        Encode quiz answers to one-hot vector based on your feature names

        Args:
            answers: Dict with question_text: answer_text
            Example: {
                "When you travel, how do you prefer to spend your time?": 
                    "Exploring cities and local culture",
                "Which best describes your travel curiosity?": 
                    "I like exploring hidden, offbeat locations",
                ...
            }

        Returns:
            numpy array of shape (1, 24) - one-hot encoded
        """
        # Initialize all zeros
        encoded = np.zeros((1, 24))

        try:
            # For each question-answer pair
            for question_text, answer_text in answers.items():
                # Find the feature index
                feature_name = f"ohe__{question_text}_{answer_text}"

                if feature_name in self.feature_names["personality"]:
                    idx = self.feature_names["personality"].index(feature_name)
                    encoded[0, idx] = 1
                else:
                    logger.warning(f"Feature not found: {feature_name}")

            logger.info(
                f"✅ Encoded answers: {np.sum(encoded)} features active")
            return encoded

        except Exception as e:
            logger.error(f"Encoding error: {e}")
            # Return random encoding for testing
            return np.random.randint(0, 2, (1, 24)).astype(float)

    def predict_personality_scores(self, answers: Dict[str, str]) -> Dict[str, float]:
        """
        Predict personality scores (ADVENTURE, SPIRITUAL, BONDING, RELAXATION)

        Since you don't have the trained model yet, using rule-based logic
        """
        # Map answers to scores based on your questions
        adventure_keywords = [
            "thrilling adventures", "adventure like a hike", "Fun and thrill",
            "Mountains or nature escapes", "spontaneous"
        ]

        spiritual_keywords = [
            "Exploring cities and local culture", "famous landmarks",
            "Exploration and learning", "plan everything in advance"
        ]

        bonding_keywords = [
            "with close friends or family", "With a big group or new people",
            "cozy café or social place", "Night, lively and vibrant"
        ]

        relaxation_keywords = [
            "Relaxing with calm scenic experiences", "Sitting quietly by a lake",
            "Relaxation and peace", "Beaches and tropical spots", "flexibility"
        ]

        # Initialize scores
        scores = {
            "adventure": 0.0,
            "spiritual": 0.0,
            "bonding": 0.0,
            "relaxation": 0.0
        }

        # Calculate scores based on answers
        for answer in answers.values():
            answer_lower = answer.lower()

            # Check for keywords
            for keyword in adventure_keywords:
                if keyword.lower() in answer_lower:
                    scores["adventure"] += 0.25

            for keyword in spiritual_keywords:
                if keyword.lower() in answer_lower:
                    scores["spiritual"] += 0.25

            for keyword in bonding_keywords:
                if keyword.lower() in answer_lower:
                    scores["bonding"] += 0.25

            for keyword in relaxation_keywords:
                if keyword.lower() in answer_lower:
                    scores["relaxation"] += 0.25

        # Normalize to 0-1 range
        for key in scores:
            scores[key] = min(1.0, scores[key])

        logger.info(f"🎯 Personality scores: {scores}")
        return scores

    def predict_categories(self, answers: Dict[str, str]) -> Dict[str, bool]:
        """
        Predict which of the 8 categories match

        categories = [
            'scenic_escape', 'religious', 'events', 'thrill',
            'cafes', 'modern', 'relaxation', 'seasonal_quiet'
        ]
        """
        personality_scores = self.predict_personality_scores(answers)

        # Rule-based category prediction
        categories = {
            "scenic_escape": personality_scores["relaxation"] > 0.5,
            "religious": personality_scores["spiritual"] > 0.6,
            "events": personality_scores["bonding"] > 0.5 and personality_scores["spiritual"] > 0.4,
            "thrill": personality_scores["adventure"] > 0.7,
            "cafes": personality_scores["bonding"] > 0.4,
            "modern": personality_scores["spiritual"] > 0.5 and personality_scores["adventure"] > 0.3,
            "relaxation": personality_scores["relaxation"] > 0.6,
            "seasonal_quiet": personality_scores["relaxation"] > 0.7 and personality_scores["adventure"] < 0.3
        }

        logger.info(
            f"🏷️  Predicted categories: {[k for k, v in categories.items() if v]}")
        return categories

    def predict_trip_recommendation(self,
                                    personality_answers: Dict[str, str],
                                    trip_details: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate complete trip recommendation
        """
        try:
            # Get personality analysis
            personality_scores = self.predict_personality_scores(
                personality_answers)
            categories = self.predict_categories(personality_answers)

            # Determine trip type based on dominant score
            dominant_score = max(personality_scores,
                                 key=personality_scores.get)

            trip_types = {
                "adventure": "Adventure Expedition",
                "spiritual": "Cultural Heritage Tour",
                "bonding": "Social Group Getaway",
                "relaxation": "Relaxation Retreat"
            }

            trip_type = trip_types.get(dominant_score, "Mixed Experience")

            # Recommend destination based on categories
            destination = self._recommend_destination(categories, trip_details)

            # Generate activities
            activities = self._generate_activities(
                categories, personality_scores)

            # Budget calculation
            budget = trip_details.get("trip_budget", 1000)
            duration = trip_details.get("duration", 7)
            budget_breakdown = self._calculate_budget(
                budget, duration, categories)

            return {
                "success": True,
                "trip_type": trip_type,
                "destination": destination,
                "activities": activities,
                "categories": {k: v for k, v in categories.items() if v},
                "personality_scores": personality_scores,
                "budget_breakdown": budget_breakdown,
                "duration_suggestion": duration,
                "group_recommendation": self._suggest_group_size(personality_answers, trip_details)
            }

        except Exception as e:
            logger.error(f"Trip recommendation error: {e}")
            return {
                "success": False,
                "error": str(e),
                "trip_type": "Customized Experience",
                "destination": "Multiple options available"
            }

    # Helper methods
    def _recommend_destination(self, categories: Dict[str, bool], trip_details: Dict) -> str:
        """Recommend destination based on active categories"""
        active_categories = [cat for cat,
                             is_active in categories.items() if is_active]

        destination_map = {
            "scenic_escape": ["Swiss Alps", "Norwegian Fjords"],
            "religious": ["Varanasi, India", "Jerusalem"],
            "events": ["Rio de Janeiro", "Munich"],
            "thrill": ["Queenstown, NZ", "Interlaken, Switzerland"],
            "cafes": ["Vienna, Austria", "Paris, France"],
            "modern": ["Tokyo, Japan", "Seoul, South Korea"],
            "relaxation": ["Bali, Indonesia", "Maldives"],
            "seasonal_quiet": ["Kyoto, Japan", "Swedish Lapland"]
        }

        # Check budget
        budget = trip_details.get("trip_budget", 1000)
        if budget < 800:
            return "Bali, Indonesia" if "relaxation" in active_categories else "Thailand"

        # Return first matching destination
        for category in active_categories:
            if category in destination_map:
                return destination_map[category][0]

        return "Bali, Indonesia"  # Default

    def _generate_activities(self, categories: Dict[str, bool], scores: Dict[str, float]) -> List[str]:
        """Generate activity suggestions"""
        activities = []

        activity_map = {
            "scenic_escape": ["Nature photography", "Scenic hikes"],
            "religious": ["Temple visits", "Historical tours"],
            "events": ["Local festival", "Cultural shows"],
            "thrill": ["Adventure sports", "Mountain climbing"],
            "cafes": ["Cafe hopping", "Local food tour"],
            "modern": ["Tech museum", "Modern art gallery"],
            "relaxation": ["Spa treatment", "Beach relaxation"],
            "seasonal_quiet": ["Forest walk", "Stargazing"]
        }

        for category, is_active in categories.items():
            if is_active and category in activity_map:
                activities.extend(activity_map[category])

        # Add based on personality scores
        if scores["adventure"] > 0.7:
            activities.append("Try a new adventure sport")
        if scores["bonding"] > 0.6:
            activities.append("Group activity workshop")

        return list(set(activities))[:6]  # Return max 6 unique activities

    def _calculate_budget(self, total: float, days: int, categories: Dict[str, bool]) -> Dict[str, float]:
        """Calculate budget breakdown"""
        base_allocation = {
            "accommodation": 0.35,
            "food": 0.25,
            "activities": 0.20,
            "transport": 0.15,
            "miscellaneous": 0.05
        }

        # Adjust based on categories
        if categories.get("thrill"):
            base_allocation["activities"] += 0.10
            base_allocation["accommodation"] -= 0.10

        if categories.get("relaxation"):
            base_allocation["accommodation"] += 0.10
            base_allocation["activities"] -= 0.10

        # Calculate amounts
        breakdown = {}
        for category, percentage in base_allocation.items():
            breakdown[category] = round(total * percentage, 2)

        return breakdown

    def _suggest_group_size(self, answers: Dict[str, str], trip_details: Dict) -> str:
        """Suggest group size based on preferences"""
        # Check for solo/group preferences in answers
        answer_texts = " ".join(answers.values()).lower()

        if "solo" in answer_texts or "own pace" in answer_texts:
            return "Solo travel recommended"
        elif "big group" in answer_texts or "new people" in answer_texts:
            return "Group of 6-8 people"
        elif "friends" in answer_texts or "family" in answer_texts:
            current = trip_details.get("number_of_people", 2)
            return f"Perfect for your group of {current}"

        return "2-4 people ideal"

    def _create_default_features(self):
        """Create default feature structure if loading fails"""
        self.feature_names["personality"] = [
            "ohe__Q1_Option1", "ohe__Q1_Option2", "ohe__Q1_Option3",
            "ohe__Q2_Option1", "ohe__Q2_Option2", "ohe__Q2_Option3",
            "ohe__Q3_Option1", "ohe__Q3_Option2", "ohe__Q3_Option3",
            "ohe__Q4_Option1", "ohe__Q4_Option2", "ohe__Q4_Option3",
            "ohe__Q5_Option1", "ohe__Q5_Option2", "ohe__Q5_Option3",
            "ohe__Q6_Option1", "ohe__Q6_Option2", "ohe__Q6_Option3",
            "ohe__Q7_Option1", "ohe__Q7_Option2", "ohe__Q7_Option3",
            "ohe__Q8_Option1", "ohe__Q8_Option2", "ohe__Q8_Option3"
        ]

        self.question_mapping = {
            "Q1": ["Option1", "Option2", "Option3"],
            "Q2": ["Option1", "Option2", "Option3"],
            "Q3": ["Option1", "Option2", "Option3"],
            "Q4": ["Option1", "Option2", "Option3"],
            "Q5": ["Option1", "Option2", "Option3"],
            "Q6": ["Option1", "Option2", "Option3"],
            "Q7": ["Option1", "Option2", "Option3"],
            "Q8": ["Option1", "Option2", "Option3"]
        }

        logger.warning("⚠️ Using default feature structure")


# Create singleton
ml_models = TravelMLModels()
