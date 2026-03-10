// src/context/UserContext.jsx
import React, { createContext, useContext, useState } from "react";
import { mockUser } from "../data/mockUser";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser);

  const setPersonality = (tag) => {
    setUser((prev) => ({
      ...prev,
      personalityTag: tag,
    }));
  };

  const updatePreferences = (prefs) => {
    setUser((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs },
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, setPersonality, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
