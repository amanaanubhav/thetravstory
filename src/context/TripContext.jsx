// src/context/TripContext.jsx
import React, { createContext, useContext, useState } from "react";
import { mockTrips } from "../data/mockTrips";

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(mockTrips);
  const [activeTripId, setActiveTripId] = useState(mockTrips[0]?.id || null);

  const setActiveTrip = (tripId) => {
    setActiveTripId(tripId);
  };

  const createTrip = (tripData) => {
    const newTrip = {
      id: String(trips.length + 1),
      ...tripData,
    };
    setTrips((prev) => [...prev, newTrip]);
    setActiveTripId(newTrip.id);
    return newTrip;
  };

  const addItemToTrip = (tripId, dayIndex, item) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              itinerary: trip.itinerary.map((day, idx) =>
                idx === dayIndex
                  ? { ...day, items: [...day.items, item] }
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
        setActiveTrip,
        addItemToTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
