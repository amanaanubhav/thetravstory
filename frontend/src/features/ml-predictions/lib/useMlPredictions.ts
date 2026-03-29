// src/hooks/useMlPredictions.js
/**
 * Custom hook for ML predictions
 * Handles loading states, errors, and caching
 */

import { useState, useCallback } from 'react';
import mlService from '../api/mlService';

export const useMlPredictions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personalityData, setPersonalityData] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);

  /**
   * Analyze personality from quiz answers
   */
  const analyzePersonality = useCallback(async (answers) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mlService.analyzePersonality(answers);
      if (result.success) {
        setPersonalityData(result);
        return result;
      } else {
        throw new Error(result.error || 'Failed to analyze personality');
      }
    } catch (err) {
      setError(err.message);
      console.error('Personality analysis error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get trip recommendations
   */
  const getRecommendations = useCallback(async (tripDetails) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mlService.getTripRecommendation(tripDetails);
      if (result.success) {
        setRecommendationData(result);
        return result;
      } else {
        throw new Error(result.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError(err.message);
      console.error('Recommendation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check ML API health
   */
  const checkHealth = useCallback(async () => {
    try {
      const result = await mlService.checkMLHealth();
      return result;
    } catch (err) {
      console.error('Health check error:', err);
      return { status: 'unhealthy', error: err.message };
    }
  }, []);

  return {
    loading,
    error,
    personalityData,
    recommendationData,
    analyzePersonality,
    getRecommendations,
    checkHealth,
  };
};

export default useMlPredictions;
