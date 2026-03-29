// src/data/itinerary.js
import { Plane, MapPin, Clock } from "lucide-react";

export const itinerary = {
  title: "Paris & London",
  dates: "Oct 12 – Oct 20",
  days: [
    {
      id: 1,
      placeKey: "cdg",
      time: "Airport Pickup · 09:00 AM",
      title: "Day 1: Paris – Arrival & Check-in",
      place: "CDG Terminal 2",
      icon: Plane,
      img: "place1.jpg",
    },
    {
      id: 2,
      placeKey: "louvre",
      time: "Louvre Museum · 10:00 AM",
      title: "Day 2: Paris – Culture & Cuisine",
      place: "Louvre Museum",
      icon: MapPin,
      img: "place7.jpg",
    },
    {
      id: 3,
      placeKey: "eiffel",
      time: "Evening Walk · 07:00 PM",
      title: "Day 3: Paris – Iconic Sights",
      place: "Eiffel Tower",
      icon: MapPin,
      img: "place8.jpg",
    },
    {
      id: 4,
      placeKey: "coventgarden",
      time: "Hotel Check-in · 01:00 PM",
      title: "Day 5: London – Arrival",
      place: "Covent Garden",
      icon: MapPin,
      img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=900&auto=format&fit=crop",
    },
    {
      id: 5,
      placeKey: "bigben",
      time: "City Walk · 05:00 PM",
      title: "Day 6: London – Landmarks",
      place: "Big Ben & Westminster",
      icon: MapPin,
      img: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=900&auto=format&fit=crop",
    },
    {
      id: 6,
      placeKey: "britishmuseum",
      time: "Museum Visit · 11:00 AM",
      title: "Day 7: London – History & Culture",
      place: "British Museum",
      icon: MapPin,
      img: "place5.jpg",
    },
  ],
};