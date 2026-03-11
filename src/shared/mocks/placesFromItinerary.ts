// src/data/placesFromItinerary.js
import { itinerary } from "./itinerary";
import { selectedPlaces } from "./selectedPlaces";

// Step 1: build image lookup from itinerary
const itineraryImageMap = itinerary.days.reduce((map, day) => {
  if (day.placeKey && day.img && !map[day.placeKey]) {
    map[day.placeKey] = day.img;
  }
  return map;
}, {});

// Step 2: merge images into selected places
export const derivedSelectedPlaces = selectedPlaces.map((place) => ({
  ...place,
  img: itineraryImageMap[place.placeKey] ?? "/fallback.jpg",
}));