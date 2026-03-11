@echo off
REM TRAVIXO ML Integration Testing Guide (Windows)
REM Run these commands to test the integration

echo.
echo ========================================
echo TRAVIXO ML Integration Testing
echo ========================================
echo.

REM Test 1: Check ML API Health
echo [Test 1] ML API Health Check
echo Command: curl http://localhost:8000/health
curl -s http://localhost:8000/health
echo.
echo.

REM Test 2: Check Express Backend Health
echo [Test 2] Express Backend Health Check
echo Command: curl http://localhost:5000/api/health
curl -s http://localhost:5000/api/health
echo.
echo.

REM Test 3: Check ML API through Express
echo [Test 3] ML API Health through Express
echo Command: curl http://localhost:5000/api/ml/health
curl -s http://localhost:5000/api/ml/health
echo.
echo.

REM Test 4: Personality Analysis - Adventure Type
echo [Test 4] Personality Analysis - Adventure Type
echo Command: curl -X POST http://localhost:5000/api/ml/personality-analysis
curl -s -X POST http://localhost:5000/api/ml/personality-analysis ^
  -H "Content-Type: application/json" ^
  -d "{\"spend_time\": \"adventure\", \"curiosity\": \"hidden_gems\", \"recharge\": \"hike_adventure\", \"travel_pref\": \"group_new\"}"
echo.
echo.

REM Test 5: Personality Analysis - Relaxation Type
echo [Test 5] Personality Analysis - Relaxation Type
curl -s -X POST http://localhost:5000/api/ml/personality-analysis ^
  -H "Content-Type: application/json" ^
  -d "{\"spend_time\": \"scenic_relax\", \"curiosity\": \"landmarks\", \"recharge\": \"lake_scenic\", \"travel_pref\": \"solo\"}"
echo.
echo.

REM Test 6: Personality Analysis - Culture Type
echo [Test 6] Personality Analysis - Culture Type
curl -s -X POST http://localhost:5000/api/ml/personality-analysis ^
  -H "Content-Type: application/json" ^
  -d "{\"spend_time\": \"city_culture\", \"curiosity\": \"landmarks\", \"recharge\": \"cafe_social\", \"travel_pref\": \"friends_family\"}"
echo.
echo.

REM Test 7: Trip Recommendation - Adventure Budget
echo [Test 7] Trip Recommendation - Adventure (Budget: $2000)
curl -s -X POST http://localhost:5000/api/ml/trip-recommendation ^
  -H "Content-Type: application/json" ^
  -d "{\"personality_answers\": {\"spend_time\": \"adventure\", \"curiosity\": \"hidden_gems\", \"recharge\": \"hike_adventure\", \"travel_pref\": \"group_new\"}, \"gender\": \"male\", \"trip_budget\": 2000, \"duration\": 7, \"number_of_people\": 4, \"weather\": \"sunny\"}"
echo.
echo.

REM Test 8: Trip Recommendation - Luxury Budget
echo [Test 8] Trip Recommendation - Luxury (Budget: $5000)
curl -s -X POST http://localhost:5000/api/ml/trip-recommendation ^
  -H "Content-Type: application/json" ^
  -d "{\"personality_answers\": {\"spend_time\": \"scenic_relax\", \"curiosity\": \"landmarks\", \"recharge\": \"lake_scenic\", \"travel_pref\": \"friends_family\"}, \"gender\": \"female\", \"trip_budget\": 5000, \"duration\": 10, \"number_of_people\": 2, \"weather\": \"sunny\"}"
echo.
echo.

REM Test 9: Trip Recommendation - Budget Travel
echo [Test 9] Trip Recommendation - Budget Travel ($800)
curl -s -X POST http://localhost:5000/api/ml/trip-recommendation ^
  -H "Content-Type: application/json" ^
  -d "{\"personality_answers\": {\"spend_time\": \"adventure\", \"curiosity\": \"hidden_gems\", \"recharge\": \"cafe_social\", \"travel_pref\": \"solo\"}, \"gender\": \"prefer_not_to_say\", \"trip_budget\": 800, \"duration\": 5, \"number_of_people\": 1, \"weather\": \"any\"}"
echo.
echo.

echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo Summary:
echo - ML API should be running on http://localhost:8000
echo - Express Backend should be running on http://localhost:5000
echo - Frontend should be running on http://localhost:5173
echo.
echo If any tests failed, check:
echo 1. Are all services running?
echo 2. Are the ports correct?
echo 3. Check server logs for errors
echo 4. Verify model files exist in ml-server/app/models/
echo.
pause
