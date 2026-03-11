// src/hooks/useChatAI.js
/**
 * Custom hook for AI chat
 * Manages chat state, messages, and API calls
 */

import { useState, useCallback } from 'react';
import chatService from '../api/chatService';

export const useChatAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: "Yo, I'm your Vibe AI. Tell me what kind of energy you're looking for. Chaotic? Chill? Luxury? Or just 'survive the weekend'?",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  /**
   * Send message and get AI response
   */
  const sendMessage = useCallback(
    async (userMessage, tripContext = null) => {
      if (!userMessage.trim()) return;

      setLoading(true);
      setError(null);

      try {
        // Add user message to chat
        const userMsg = {
          id: messages.length + 1,
          from: 'user',
          text: userMessage,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);

        // Get AI response
        const response = await chatService.sendChatMessage(userMessage, tripContext);

        if (response.success) {
          // Add AI response
          const botMsg = {
            id: messages.length + 2,
            from: 'bot',
            text: response.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMsg]);

          // Store suggestions if any
          if (response.suggestions) {
            setSuggestions(response.suggestions);
          }

          return response;
        } else {
          throw new Error(response.error || 'Failed to get AI response');
        }
      } catch (err) {
        console.error('Chat error:', err);
        setError(err.message);

        // Add error message to chat
        const errorMsg = {
          id: messages.length + 1,
          from: 'bot',
          text: `Sorry, I encountered an error: ${err.message}. Please try again.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  /**
   * Generate trip from chat
   */
  const generateTrip = useCallback(async (message, personalityData = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatService.generateTripFromChat(message, personalityData);

      if (response.success) {
        return response.trip;
      } else {
        throw new Error(response.error || 'Failed to generate trip');
      }
    } catch (err) {
      console.error('Trip generation error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear chat history
   */
  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        from: 'bot',
        text: "Yo, I'm your Vibe AI. Tell me what kind of energy you're looking for. Chaotic? Chill? Luxury? Or just 'survive the weekend'?",
        timestamp: new Date(),
      },
    ]);
    setSuggestions([]);
    setError(null);
  }, []);

  /**
   * Get suggestions
   */
  const getSuggestions = useCallback(() => {
    return suggestions;
  }, [suggestions]);

  return {
    messages,
    loading,
    error,
    suggestions,
    sendMessage,
    generateTrip,
    clearChat,
    getSuggestions,
  };
};

export default useChatAI;
