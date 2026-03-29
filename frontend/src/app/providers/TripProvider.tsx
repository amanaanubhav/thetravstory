"use client";
// src/context/TripContext.jsx
import React, { createContext, useContext, useState } from "react";

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]); // No mock data
  const [activeTripId, setActiveTripId] = useState(null);

  const setActiveTrip = (tripId) => {
    setActiveTripId(tripId);
  };

  const createTrip = (tripData) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...tripData,
    };
    setTrips((prev) => [...prev, newTrip]);
    setActiveTripId(newTrip.id);
    return newTrip;
  };

  const updateTrip = (tripId, updates) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === tripId ? { ...trip, ...updates } : trip))
    );
  };

  const deleteTrip = (tripId) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTripId === tripId) {
      setActiveTripId(null);
    }
  };

  const addItemToTrip = (tripId, dayIndex, item) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              itinerary: trip.itinerary.map((day, idx) =>
                idx === dayIndex
                  ? {
                      ...day,
                      items: [
                        ...day.items,
                        { ...item, id: `custom-${Date.now()}-${Math.random()}` },
                      ],
                    }
                  : day
              ),
            }
          : trip
      )
    );
  };

  const removeItemFromTrip = (tripId, dayIndex, itemId) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              itinerary: trip.itinerary.map((day, idx) =>
                idx === dayIndex
                  ? { ...day, items: day.items.filter((i) => i.id !== itemId) }
                  : day
              ),
            }
          : trip
      )
    );
  };

  const activeTrip = trips.find((t) => t.id === activeTripId) || null;

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTripId,
        activeTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        setActiveTrip,
        addItemToTrip,
        removeItemFromTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);