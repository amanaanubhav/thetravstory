// src/components/RecommendationPanel.jsx
/**
 * Recommendation Panel Component
 * Displays ML-generated trip recommendations
 */

import React, { useState, useEffect } from 'react';
import Card from '../../../shared/ui/Card';
import Button from '../../../shared/ui/Button';
import { useUser } from '../../../app/providers/UserProvider';
import useMlPredictions from '../../ml-predictions/lib/useMlPredictions';

const RecommendationPanel = ({ tripDetails }) => {
  const { preferences } = useUser();
  const { getRecommendations, loading, error, recommendationData } = useMlPredictions();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Auto-fetch recommendations when component mounts
    if (preferences?.quiz_answers && tripDetails) {
      fetchRecommendations();
    }
  }, []);

  const fetchRecommendations = async () => {
    try {
      await getRecommendations({
        personality_answers: preferences.quiz_answers,
        gender: tripDetails.gender || 'prefer_not_to_say',
        trip_budget: tripDetails.budget || 1000,
        duration: tripDetails.duration || 7,
        number_of_people: tripDetails.people || 2,
        weather: tripDetails.weather || 'any',
      });
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <p className="text-sm text-red-700">Error: {error}</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={fetchRecommendations}
        >
          Retry
        </Button>
      </Card>
    );
  }

  if (!recommendationData) {
    return (
      <Card className="p-4">
        <p className="text-sm text-slate-500">No recommendations yet</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={fetchRecommendations}
        >
          Get Recommendations
        </Button>
      </Card>
    );
  }

  const {
    destination,
    trip_type,
    activities,
    budget_breakdown,
    personality_scores,
  } = recommendationData;

  return (
    <div className="space-y-3">
      {/* Main Recommendation */}
      <Card className="p-4 bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
        <div className="mb-3">
          <p className="text-xs text-sky-600 font-semibold mb-1">RECOMMENDED FOR YOU</p>
          <h3 className="text-lg font-semibold text-slate-900">{destination}</h3>
          <p className="text-sm text-slate-600">{trip_type}</p>
        </div>
      </Card>

      {/* Activities */}
      <Card className="p-4">
        <p className="text-xs text-slate-500 font-semibold mb-2">SUGGESTED ACTIVITIES</p>
        <div className="space-y-2">
          {activities.slice(0, 4).map((activity, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-slate-700">{activity}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Budget Breakdown */}
      <Card className="p-4">
        <p className="text-xs text-slate-500 font-semibold mb-3">BUDGET BREAKDOWN</p>
        <div className="space-y-2">
          {Object.entries(budget_breakdown as Record<string, number>).map(([category, amount]) => (
            <div key={category} className="flex justify-between items-center">
              <p className="text-sm text-slate-600 capitalize">{category}</p>
              <p className="text-sm font-semibold text-slate-900">${amount}</p>
            </div>
          ))}
          <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-center">
            <p className="text-sm font-semibold text-slate-900">Total</p>
            <p className="text-sm font-bold text-sky-600">
              ${(Object.values(budget_breakdown as Record<string, number>)).reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* Personality Scores */}
      {showDetails && (
        <Card className="p-4 bg-slate-50">
          <p className="text-xs text-slate-500 font-semibold mb-3">YOUR TRAVEL PERSONALITY</p>
          <div className="space-y-3">
            {Object.entries(personality_scores as Record<string, number>).map(([score, value]) => (
              <div key={score}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-slate-600 capitalize">
                    {score.replace('_score', '')}
                  </p>
                  <p className="text-xs font-semibold text-slate-900">
                    {Math.round(value * 100)}%
                  </p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-sky-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={fetchRecommendations}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default RecommendationPanel;
