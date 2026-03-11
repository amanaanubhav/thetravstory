#!/bin/bash
# TRAVIXO ML Integration Testing Guide
# Run these commands to test the integration

echo "🚀 TRAVIXO ML Integration Testing"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check ML API Health
echo -e "${YELLOW}Test 1: ML API Health Check${NC}"
echo "Command: curl http://localhost:8000/health"
curl -s http://localhost:8000/health | jq . || echo "❌ ML API not responding"
echo ""

# Test 2: Check Express Backend Health
echo -e "${YELLOW}Test 2: Express Backend Health Check${NC}"
echo "Command: curl http://localhost:5000/api/health"
curl -s http://localhost:5000/api/health | jq . || echo "❌ Express Backend not responding"
echo ""

# Test 3: Check ML API through Express
echo -e "${YELLOW}Test 3: ML API Health through Express${NC}"
echo "Command: curl http://localhost:5000/api/ml/health"
curl -s http://localhost:5000/api/ml/health | jq . || echo "❌ ML API proxy not working"
echo ""

# Test 4: Personality Analysis - Adventure Type
echo -e "${YELLOW}Test 4: Personality Analysis - Adventure Type${NC}"
echo "Command: curl -X POST http://localhost:5000/api/ml/personality-analysis"
curl -s -X POST http://localhost:5000/api/ml/personality-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "spend_time": "adventure",
    "curiosity": "hidden_gems",
    "recharge": "hike_adventure",
    "travel_pref": "group_new"
  }' | jq . || echo "❌ Personality analysis failed"
echo ""

# Test 5: Personality Analysis - Relaxation Type
echo -e "${YELLOW}Test 5: Personality Analysis - Relaxation Type${NC}"
curl -s -X POST http://localhost:5000/api/ml/personality-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "spend_time": "scenic_relax",
    "curiosity": "landmarks",
    "recharge": "lake_scenic",
    "travel_pref": "solo"
  }' | jq . || echo "❌ Personality analysis failed"
echo ""

# Test 6: Personality Analysis - Culture Type
echo -e "${YELLOW}Test 6: Personality Analysis - Culture Type${NC}"
curl -s -X POST http://localhost:5000/api/ml/personality-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "spend_time": "city_culture",
    "curiosity": "landmarks",
    "recharge": "cafe_social",
    "travel_pref": "friends_family"
  }' | jq . || echo "❌ Personality analysis failed"
echo ""

# Test 7: Trip Recommendation - Adventure Budget
echo -e "${YELLOW}Test 7: Trip Recommendation - Adventure (Budget: \$2000)${NC}"
echo "Command: curl -X POST http://localhost:5000/api/ml/trip-recommendation"
curl -s -X POST http://localhost:5000/api/ml/trip-recommendation \
  -H "Content-Type: application/json" \
  -d '{
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
  }' | jq . || echo "❌ Trip recommendation failed"
echo ""

# Test 8: Trip Recommendation - Luxury Budget
echo -e "${YELLOW}Test 8: Trip Recommendation - Luxury (Budget: \$5000)${NC}"
curl -s -X POST http://localhost:5000/api/ml/trip-recommendation \
  -H "Content-Type: application/json" \
  -d '{
    "personality_answers": {
      "spend_time": "scenic_relax",
      "curiosity": "landmarks",
      "recharge": "lake_scenic",
      "travel_pref": "friends_family"
    },
    "gender": "female",
    "trip_budget": 5000,
    "duration": 10,
    "number_of_people": 2,
    "weather": "sunny"
  }' | jq . || echo "❌ Trip recommendation failed"
echo ""

# Test 9: Trip Recommendation - Budget Travel
echo -e "${YELLOW}Test 9: Trip Recommendation - Budget Travel (\$800)${NC}"
curl -s -X POST http://localhost:5000/api/ml/trip-recommendation \
  -H "Content-Type: application/json" \
  -d '{
    "personality_answers": {
      "spend_time": "adventure",
      "curiosity": "hidden_gems",
      "recharge": "cafe_social",
      "travel_pref": "solo"
    },
    "gender": "prefer_not_to_say",
    "trip_budget": 800,
    "duration": 5,
    "number_of_people": 1,
    "weather": "any"
  }' | jq . || echo "❌ Trip recommendation failed"
echo ""

# Test 10: Invalid Input Test
echo -e "${YELLOW}Test 10: Invalid Input Test (should fail gracefully)${NC}"
curl -s -X POST http://localhost:5000/api/ml/personality-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "spend_time": "invalid_value",
    "curiosity": "hidden_gems",
    "recharge": "hike_adventure",
    "travel_pref": "group_new"
  }' | jq . || echo "❌ Error handling test failed"
echo ""

echo -e "${GREEN}�� Testing Complete!${NC}"
echo ""
echo "Summary:"
echo "- ML API should be running on http://localhost:8000"
echo "- Express Backend should be running on http://localhost:5000"
echo "- Frontend should be running on http://localhost:5173"
echo ""
echo "If any tests failed, check:"
echo "1. Are all services running?"
echo "2. Are the ports correct?"
echo "3. Check server logs for errors"
echo "4. Verify model files exist in ml-server/app/models/"
