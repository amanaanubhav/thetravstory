// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("user");
        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  // Used by Quiz.jsx after personality analysis completes
  const setPersonality = (tag) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), personalityTag: tag };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const updatePreferences = (preferences) => {
    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        preferences: { ...(prev?.preferences || {}), ...preferences },
      };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    isAuthenticated,
    isAuthLoading,
    login,
    logout,
    setPersonality,
    updatePreferences,
    preferences: user?.preferences || {},
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};