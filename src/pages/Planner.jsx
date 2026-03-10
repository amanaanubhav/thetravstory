import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Search,
  Plane,
  Hotel,
  Utensils,
  Camera,
  MapPin,
  Plus,
  ChevronDown,
  Trash2,
  Navigation,
  Clock,
  Star,
  ArrowLeft,
  Calendar,
  Tag,
  DollarSign,
  Check,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Undo2,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Icons
try {
  if (L && L.Icon && L.Icon.Default) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }
} catch (e) {
  console.error("Leaflet icon fix failed", e);
}

// --- Mock Data ---

const initialDays = {
  "day-1": {
    id: "day-1",
    title: "Day 1: Arrival & Classics",
    date: "Oct 12",
    color: "#0284c7",
    items: [
      {
        id: "item-1",
        type: "flight",
        title: "Landing at CDG",
        time: "10:00 AM",
        location: "Charles de Gaulle Airport",
        coords: [49.0097, 2.5479],
        img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600",
        category: "Transit",
        cost: "N/A",
        duration: "1h 30m",
        bestTime: "Morning",
        tags: ["Travel", "Airport"],
        desc: "Arrival at Paris Charles de Gaulle. Proceed to baggage claim and take the RER B train to the city center."
      },
      {
        id: "item-2",
        type: "hotel",
        title: "Check-in at Le Littré",
        time: "12:00 PM",
        location: "Hotel Le Littré",
        coords: [48.8431, 2.3248],
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
        category: "Stay",
        cost: "€250/night",
        duration: "Check-in",
        bestTime: "After 2 PM",
        tags: ["Luxury", "Comfort"],
        desc: "A charming 4-star hotel located in the 6th arrondissement, between Saint-Germain-des-Prés and Montparnasse."
      },
      {
        id: "item-3",
        type: "food",
        title: "Lunch at Angelina",
        time: "01:30 PM",
        location: "Angelina Paris",
        coords: [48.8653, 2.3292],
        img: "https://images.unsplash.com/photo-1554679665-f5537f187268?q=80&w=600",
        category: "Food",
        cost: "€40-60",
        duration: "1h 30m",
        bestTime: "Lunch",
        tags: ["Famous", "Hot Chocolate", "Pastry"],
        desc: "Famous tearoom known for its signature hot chocolate 'L'Africain' and Mont-Blanc pastry. A must-visit classic."
      },
      {
        id: "item-4",
        type: "activity",
        title: "Louvre Museum",
        time: "03:00 PM",
        location: "Musée du Louvre",
        coords: [48.8606, 2.3376],
        img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
        category: "Landmark",
        cost: "€17",
        duration: "3h+",
        bestTime: "Early Morning or Late Night",
        tags: ["Art", "History", "Museum"],
        desc: "The world's largest art museum and a historic monument in Paris. Home to the Mona Lisa and thousands of other masterpieces."
      },
    ],
  },
  "day-2": {
    id: "day-2",
    title: "Day 2: Bohemian Vibes",
    date: "Oct 13",
    color: "#0284c7",
    items: [
      {
        id: "item-5",
        type: "food",
        title: "Brunch at Carette",
        time: "10:00 AM",
        location: "Carette",
        coords: [48.8637, 2.2872],
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
        category: "Food",
        cost: "€30-50",
        duration: "1h 30m",
        bestTime: "Morning",
        tags: ["Brunch", "Macarons", "View"],
        desc: "Elegant café serving delicious brunch and pastries. Great view of Trocadéro."
      },
      {
        id: "item-6",
        type: "activity",
        title: "Montmartre Walk",
        time: "11:30 AM",
        location: "Montmartre",
        coords: [48.8867, 2.3431],
        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=60",
        category: "Adventure",
        cost: "Free",
        duration: "2h",
        bestTime: "Anytime",
        tags: ["Walking", "Views", "Art"],
        desc: "Explore the artistic hilltop district of Montmartre, famous for its cobbled streets, artists, and the Sacré-Cœur."
      },
    ],
  },
  "day-3": {
    id: "day-3",
    title: "Day 3: Shopping & Seine",
    date: "Oct 14",
    color: "#0284c7",
    items: [],
  },
};

const savedPlaces = [
  {
    id: "saved-1",
    name: "Eiffel Tower Area",
    type: "activity",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
    coords: [48.8584, 2.2945],
    category: "Landmark",
    cost: "€26",
    duration: "2-3h",
    bestTime: "Sunset",
    tags: ["Iconic", "View", "Romance"],
    desc: "The Iron Lady. Visit the summit for breathtaking views of Paris."
  },
  {
    id: "saved-2",
    name: "Le Marais",
    type: "activity",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600",
    coords: [48.8575, 2.3592],
    category: "District",
    cost: "Free",
    duration: "3h+",
    bestTime: "Afternoon",
    tags: ["Shopping", "Food", "History"],
    desc: "A historic district in Paris known for its boutiques, galleries, and diverse dining scene."
  },
  {
    id: "saved-3",
    name: "Seine Cruise",
    type: "activity",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1499856871940-a09627c6d7db?q=80&w=600",
    coords: [48.8590, 2.2940],
    category: "Adventure",
    cost: "€15",
    duration: "1h",
    bestTime: "Evening",
    tags: ["Boat", "Scenic", "Relaxing"],
    desc: "Enjoy a scenic boat tour along the Seine River, passing by many of the city's top monuments."
  },
];

const nearbyPlaces = [
  {
    id: "nearby-1",
    name: "Café de Flore",
    type: "food",
    rating: 4.5,
    img: "https://images.squarespace-cdn.com/content/v1/5c39b850f8370ada6518b722/1585242013733-DASOV04TETMNPCT4C11U/julian-dik--czl8QNCVKY-unsplash.jpg",
    coords: [48.8541, 2.3331],
    category: "Food",
    cost: "€20-40",
    duration: "1h",
    bestTime: "Morning",
    tags: ["Coffee", "History", "People Watching"],
    desc: "One of the oldest coffeehouses in Paris, famous for its famous clientele."
  },
  {
    id: "nearby-2",
    name: "Luxembourg Gardens",
    type: "activity",
    rating: 4.8,
    img: "https://eltour.travel/useruploads/articles/article_2678036d54.jpg",
    coords: [48.8462, 2.3371],
    category: "Nature",
    cost: "Free",
    duration: "1-2h",
    bestTime: "Afternoon",
    tags: ["Park", "Relax", "Gardens"],
    desc: "A beautiful 17th-century park & palace, perfect for a relaxing stroll or a picnic."
  },
];

// --- Helpers ---

const getItemIcon = (type) => {
  switch (type) {
    case "flight": return Plane;
    case "hotel": return Hotel;
    case "food": return Utensils;
    case "activity": return Camera;
    default: return MapPin;
  }
};

const createCustomIcon = (number, color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); color: white; font-weight: 800; font-size: 14px;">${number}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 1440;
  if (timeStr.toLowerCase() === "tbd") return 1440;

  // Try to match HH:MM AM/PM
  const match = timeStr.match(/(\d+):?(\d+)?\s*(AM|PM)/i);
  if (!match) {
    // Check for keywords
    const lower = timeStr.toLowerCase();
    if (lower.includes("morning")) return 480; // 8 AM
    if (lower.includes("noon")) return 720; // 12 PM
    if (lower.includes("afternoon")) return 840; // 2 PM
    if (lower.includes("evening")) return 1080; // 6 PM
    if (lower.includes("night")) return 1260; // 9 PM
    return 1441; // Anything else goes to the bottom
  }

  let [_, hours, minutes, period] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes || 0);

  if (period.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

function MapUpdater({ locations }) {
  const map = useMap();
  useEffect(() => {
    if (locations && locations.length > 0) {
      const validCoords = locations.filter(l => l.coords).map(l => l.coords);
      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [100, 100], maxZoom: 14 });
      }
    }
  }, [locations, map]);
  return null;
}

// --- Main Component ---

export default function Planner() {
  const navigate = useNavigate();

  // Initialize trips with both AI and User versions
  const [trips, setTrips] = useState([
    {
      id: 1,
      name: "Paris Summer",
      aiPlan: initialDays,
      userPlan: JSON.parse(JSON.stringify(initialDays)),
      isModified: false
    },
    {
      id: 2,
      name: "Dubai Luxury",
      aiPlan: {
        "day-1": { id: "day-1", title: "Day 1: Arrival & Burj", date: "Dec 15", color: "#0284c7", items: [] },
        "day-2": { id: "day-2", title: "Day 2: Desert Safari", date: "Dec 16", color: "#0284c7", items: [] },
        "day-3": { id: "day-3", title: "Day 3: Mall & Fountains", date: "Dec 17", color: "#0284c7", items: [] },
      },
      userPlan: {
        "day-1": { id: "day-1", title: "Day 1: Arrival & Burj", date: "Dec 15", color: "#0284c7", items: [] },
        "day-2": { id: "day-2", title: "Day 2: Desert Safari", date: "Dec 16", color: "#0284c7", items: [] },
        "day-3": { id: "day-3", title: "Day 3: Mall & Fountains", date: "Dec 17", color: "#0284c7", items: [] },
      },
      isModified: false
    },
    {
      id: 3,
      name: "Kyoto Zen",
      aiPlan: {
        "day-1": { id: "day-1", title: "Day 1: Temples", date: "Mar 20", color: "#0284c7", items: [] },
        "day-2": { id: "day-2", title: "Day 2: Arashiyama", date: "Mar 21", color: "#0284c7", items: [] },
        "day-3": { id: "day-3", title: "Day 3: Gion District", date: "Mar 22", color: "#0284c7", items: [] },
      },
      userPlan: {
        "day-1": { id: "day-1", title: "Day 1: Temples", date: "Mar 20", color: "#0284c7", items: [] },
        "day-2": { id: "day-2", title: "Day 2: Arashiyama", date: "Mar 21", color: "#0284c7", items: [] },
        "day-3": { id: "day-3", title: "Day 3: Gion District", date: "Mar 22", color: "#0284c7", items: [] },
      },
      isModified: false
    }
  ]);

  const [activeTripId, setActiveTripId] = useState(1);
  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];
  const [showTripSelector, setShowTripSelector] = useState(false);

  // The 'days' state now strictly represents the Working (User) Version of the active trip
  const [days, setDays] = useState(activeTrip.userPlan);

  // Update local days when active trip changes
  useEffect(() => {
    setDays(activeTrip.userPlan);
  }, [activeTripId]);

  // Persist local edits back to the main trips state & detect changes
  useEffect(() => {
    setTrips(prev => prev.map(t => {
      if (t.id === activeTripId) {
        // Detect if user has modified the AI baseline
        const hasChanges = JSON.stringify(t.aiPlan) !== JSON.stringify(days);
        return { ...t, userPlan: days, isModified: hasChanges };
      }
      return t;
    }));
  }, [days, activeTripId]);

  const [dayOrder, setDayOrder] = useState(["day-1", "day-2", "day-3"]);
  const [selectedDayId, setSelectedDayId] = useState("all");
  const [activeTab, setActiveTab] = useState("nearby");
  const [collapsedDays, setCollapsedDays] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingPlace, setAddingPlace] = useState(null); // { place, dayId, time }
  const [addFeedback, setAddFeedback] = useState(null); // { id, dayName }
  const [planMode, setPlanMode] = useState("user"); // 'ai' or 'user'
  const [showPlanSettings, setShowPlanSettings] = useState(false);
  const [editingTimeId, setEditingTimeId] = useState(null);

  const displayDays = planMode === "ai" ? activeTrip.aiPlan : days;
  const isReadOnly = planMode === "ai";

  // --- HISTORY / UNDO LOGIC ---
  const [history, setHistory] = useState([]);

  const pushToHistory = () => {
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(days))].slice(-20)); // Keep last 20 states
  };

  const undo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setDays(lastState);
  };

  // Clear history when switching trips
  useEffect(() => {
    setHistory([]);
  }, [activeTripId]);

  const toggleCollapse = (dayId) => {
    setCollapsedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const onDragEnd = (result) => {
    if (isReadOnly) return;
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    pushToHistory();
    if (source.droppableId === destination.droppableId) {
      const day = days[source.droppableId];
      const newItems = Array.from(day.items);
      const [moved] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, moved);
      setDays({ ...days, [source.droppableId]: { ...day, items: newItems } });
    } else {
      const sourceDay = days[source.droppableId];
      const destDay = days[destination.droppableId];
      const sourceItems = Array.from(sourceDay.items);
      const destItems = Array.from(destDay.items);
      const [moved] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, moved);
      setDays({
        ...days,
        [source.droppableId]: { ...sourceDay, items: sourceItems },
        [destination.droppableId]: { ...destDay, items: destItems },
      });
    }
  };

  const addToDay = (place, dayId, time = "TBD") => {
    if (isReadOnly || !dayId) return;

    pushToHistory();
    const newItem = {
      id: `item-${Date.now()}`,
      placeId: place.id,
      title: place.name,
      type: place.type,
      time: time || "TBD",
      location: place.name,
      coords: place.coords,
      img: place.img,
      category: place.category,
      cost: place.cost,
      duration: place.duration,
      bestTime: place.bestTime,
      tags: place.tags || [],
      desc: place.desc
    };

    setDays(prev => {
      const newItems = [...prev[dayId].items, newItem];
      // Sort items by time
      newItems.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

      return {
        ...prev,
        [dayId]: {
          ...prev[dayId],
          items: newItems
        }
      };
    });

    // Feedback logic
    setAddFeedback({ id: place.id, dayName: days[dayId]?.title?.split(':')[0] || "Day" });
    setAddingPlace(null);
    setTimeout(() => setAddFeedback(null), 3000);
  };

  const updateItemTime = (dayId, itemId, newTime) => {
    if (isReadOnly) return;
    pushToHistory();
    setDays(prev => {
      const newItems = prev[dayId].items.map(item =>
        item.id === itemId ? { ...item, time: newTime } : item
      );
      // Sort items by time
      newItems.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

      return {
        ...prev,
        [dayId]: {
          ...prev[dayId],
          items: newItems
        }
      };
    });
    setEditingTimeId(null);
  };

  const deleteItem = (dayId, itemId) => {
    if (isReadOnly) return;
    pushToHistory();
    setDays(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        items: prev[dayId].items.filter(item => item.id !== itemId)
      }
    }));
  };

  const restorePlan = () => {
    if (window.confirm("Restore to original AI itinerary? Your changes will be lost.")) {
      pushToHistory();
      const original = JSON.parse(JSON.stringify(activeTrip.aiPlan));
      setDays(original);
      // Reset day order from AI plan
      setDayOrder(Object.keys(original));
    }
  };

  const addDay = () => {
    if (isReadOnly) return;
    pushToHistory();
    const nextDayNum = dayOrder.length + 1;
    const nextDayId = `day-${nextDayNum}-${Date.now()}`; // Unique ID

    setDays(prev => ({
      ...prev,
      [nextDayId]: {
        id: nextDayId,
        title: `Day ${nextDayNum}: New Chapter`,
        date: "TBD",
        color: "#0284c7",
        items: []
      }
    }));
    setDayOrder(prev => [...prev, nextDayId]);
  };

  // Map Data Logic
  const mapMarkers = [];
  const mapPolylines = [];
  const visibleDays = selectedDayId === "all" ? dayOrder : [selectedDayId];

  visibleDays.forEach(dayId => {
    const day = displayDays[dayId];
    if (!day) return; // Safety check
    const coords = [];
    (day.items || []).forEach((item, index) => {
      mapMarkers.push({ ...item, dayColor: day.color, number: index + 1, dayId });
      if (item.coords) coords.push(item.coords);
    });
    if (coords.length > 1) {
      mapPolylines.push({ coords, color: day.color, dayId });
    }
  });

  return (
    <div className="h-full bg-slate-50 font-sans grid grid-cols-[450px_1fr_400px] gap-6 p-6 overflow-hidden no-scrollbar">

      <DragDropContext onDragEnd={onDragEnd}>

        {/* --- LEFT CARD: ITINERARY --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[calc(100vh-20px)] relative z-10 border border-slate-200/50"
        >
          {/* Fixed Header */}
          <div className="p-6 pb-2 shrink-0 bg-white/50 backdrop-blur-md z-20">
            <div className="flex flex-col gap-4 mb-4">
              {/* Header Row: Title/Selector & Plan Controls */}
              <div className="flex items-center justify-between relative z-30">
                <div className="flex flex-col">
                  <h2 className="text-[28px] font-[900] text-[#0B1527] tracking-tight">Itinerary</h2>

                  {/* TRIP SELECTOR DROPDOWN Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTripSelector(!showTripSelector)}
                      className="flex items-center gap-1.5 px-0.5 py-0.5 transition-colors group"
                    >
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{activeTrip.name}</span>
                      <ChevronDown size={12} className={`text-slate-300 group-hover:text-slate-500 transition-transform duration-300 ${showTripSelector ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showTripSelector && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden ring-1 ring-black/[0.04]"
                        >
                          <div className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50 mb-1">
                            Switch Trip
                          </div>
                          <div className="max-h-[280px] overflow-y-auto no-scrollbar">
                            {trips.map(trip => (
                              <button
                                key={trip.id}
                                onClick={() => {
                                  setActiveTripId(trip.id);
                                  setShowTripSelector(false);
                                }}
                                className={`w-full px-5 py-3 text-left text-[11px] font-bold transition-all flex items-center justify-between group ${activeTripId === trip.id
                                  ? 'bg-sky-50 text-sky-600'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'}`}
                              >
                                {trip.name}
                                {activeTripId === trip.id && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* CONTROL POSITION: Adjust 'translate-y-[0px]' to move these buttons up or down */}
                <div className="flex items-center gap-2 relative translate-y-[-4px]">
                  {/* Plan Toggle */}
                  <div className="flex p-1 bg-slate-100/30 backdrop-blur-md rounded-md border border-slate-200/50 shadow-sm h-9 items-center">
                    <button
                      onClick={() => setPlanMode('ai')}
                      className={`h-full px-4 text-[9.5px] font-black rounded-md transition-all flex items-center gap-2 ${planMode === 'ai' ? 'bg-white shadow-sm text-slate-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      AI PLAN
                    </button>
                    <button
                      onClick={() => setPlanMode('user')}
                      className={`h-full px-4 text-[9.5px] font-black rounded-md transition-all flex items-center gap-2 ${planMode === 'user' ? 'bg-white shadow-sm text-slate-600 border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      YOUR PLAN
                    </button>
                  </div>

                  {/* Plan Actions Filter Button */}
                  {planMode === 'user' && (
                    <div className="relative">
                      <button
                        onClick={() => setShowPlanSettings(!showPlanSettings)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border outline-none relative ${showPlanSettings ? 'bg-sky-50 border-sky-200 text-sky-600 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-sm'}`}
                        title="Plan Actions & History"
                      >
                        <SlidersHorizontal size={14} strokeWidth={2.5} />
                        {activeTrip.isModified && !showPlanSettings && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-white shadow-sm" />
                        )}
                      </button>

                      <AnimatePresence>
                        {showPlanSettings && (
                          <>
                            {/* Invisible overlay for click-outside to close */}
                            <div className="fixed inset-0 z-40" onClick={() => setShowPlanSettings(false)} />

                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-0 mt-3 w-52 bg-white rounded-[22px] shadow-2xl border border-slate-100 py-3 z-50 ring-1 ring-black/[0.04]"
                            >
                              <div className="px-4 pb-2.5 border-b border-slate-50 mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${activeTrip.isModified ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)] animate-pulse' : 'bg-slate-300'}`} />
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">
                                    {activeTrip.isModified ? 'Status: Modified' : 'Status: Original'}
                                  </span>
                                </div>
                              </div>

                              <div className="px-2 space-y-1">
                                {activeTrip.isModified ? (
                                  <>
                                    <button
                                      onClick={() => { undo(); setShowPlanSettings(false); }}
                                      disabled={history.length === 0}
                                      className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold rounded-xl transition-all group ${history.length > 0 ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-300 pointer-events-none'}`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <Undo2 size={13} className={history.length > 0 ? 'text-slate-400 group-hover:text-sky-600' : 'text-slate-200'} />
                                        <span>Undo Edit</span>
                                      </div>
                                      {history.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-sky-400/20" />}
                                    </button>
                                    <button
                                      onClick={() => { restorePlan(); setShowPlanSettings(false); }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all group"
                                    >
                                      <RotateCcw size={13} className="text-slate-600 group-hover:rotate-180 transition-transform duration-500" />
                                      <span>Restore to AI</span>
                                    </button>
                                  </>
                                ) : (
                                  <div className="px-3 py-4 text-center">
                                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                                      Your plan matches the AI version.<br />Make edits to see history.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Integrated Day Filter Container */}
              <div className="p-2 bg-slate-100/20 backdrop-blur-md rounded-md border border-slate-200/30 shadow-md relative z-10">

                <div className="flex gap-1 overflow-x-auto scrollbar-hide items-center">


                  <button
                    onClick={() => setSelectedDayId("all")}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-md text-[10px] font-black transition-all shadow-sm border ${selectedDayId === "all"
                      ? "bg-sky-600 text-white border-sky-600 shadow-md"
                      : "bg-white/80 text-slate-500 border-slate-100 hover:border-slate-200"
                      }`}
                  >
                    ALL DAYS
                  </button>

                  {dayOrder.map(dayId => {
                    const day = displayDays[dayId];
                    if (!day) return null;
                    const isActive = selectedDayId === dayId;
                    return (
                      /* CONTROL: Change 'py-2' to resize individual date bubble heights */
                      <button
                        key={dayId}
                        onClick={() => setSelectedDayId(dayId)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-[10px] font-black transition-all shadow-sm border ${isActive
                          ? "text-white shadow-md"
                          : "bg-white/80 text-slate-500 border-slate-100 hover:border-slate-200"
                          }`}
                        style={isActive ? { backgroundColor: day.color, borderColor: day.color } : {}}
                      >
                        {day.date.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Timeline */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 pb-6 no-scrollbar">
            <div className="space-y-6 pt-2">
              {visibleDays.map(dayId => {
                const day = displayDays[dayId];
                if (!day) return null; // CRITICAL SAFETY GUARD
                const isCollapsed = collapsedDays[dayId];

                return (

                  <div key={dayId} className="relative bg-white/60 border border-slate-100 p-4 rounded-xl shadow-sm mb-4 backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-md">

                    {/* Day Header */}
                    <div
                      onClick={() => toggleCollapse(dayId)}
                      className="flex items-center gap-4 mb-4 cursor-pointer group"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-sky-100/50 transition-all group-hover:scale-105"
                        style={{ backgroundColor: day.color }}
                      >
                        {day.dayNumber || dayId.split('-')[1]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-[#0B1527] text-[15px] leading-tight truncate">{day.title}</h3>
                        <p className="text-[11px] text-slate-400 font-bold mt-1 tracking-tight">{day.date} • {day.items.length} stops</p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-slate-50 group-hover:border-slate-200 transition-all">
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isCollapsed ? "-rotate-90" : ""}`} />
                      </div>
                    </div>

                    {/* Droppable Area */}
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pt-2"
                        >
                          <Droppable droppableId={dayId}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`rounded-3xl transition-all min-h-[60px] ${snapshot.isDraggingOver ? "bg-slate-50/50 ring-2 ring-dashed ring-slate-300/50" : ""
                                  }`}
                              >
                                {day.items.map((item, index) => {
                                  return (
                                    <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isReadOnly}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{ ...provided.draggableProps.style }}
                                          onClick={() => setSelectedPlace(item)}
                                          className={`group relative flex gap-3 bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all mb-2 cursor-pointer ${snapshot.isDragging ? "rotate-2 scale-105 z-50 shadow-2xl ring-2 ring-sky-400" : ""
                                            } ${selectedPlace?.id === item.id ? "ring-2 ring-sky-400 shadow-md" : ""}`}
                                        >
                                          {/* Image Thumbnail */}
                                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative shadow-md group-hover:shadow-lg transition-shadow">
                                            {item.img ? (
                                              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <MapPin size={22} />
                                              </div>
                                            )}
                                          </div>

                                          {/* Content */}
                                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-bold text-[#0B1527] text-[13px] truncate leading-tight group-hover:text-sky-700 transition-colors">{item.title}</h4>
                                            <div className="flex items-center gap-2 mt-1.5 overflow-visible">
                                              {editingTimeId === item.id ? (
                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                  <input
                                                    type="text"
                                                    autoFocus
                                                    className="w-20 px-2 py-0.5 text-[10px] font-bold text-sky-600 bg-white border border-sky-200 rounded-lg outline-none ring-2 ring-sky-50 shadow-sm"
                                                    defaultValue={item.time}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') updateItemTime(dayId, item.id, e.target.value);
                                                      if (e.key === 'Escape') setEditingTimeId(null);
                                                    }}
                                                    onBlur={(e) => updateItemTime(dayId, item.id, e.target.value)}
                                                  />
                                                </div>
                                              ) : (
                                                <span
                                                  onClick={(e) => {
                                                    if (!isReadOnly) {
                                                      e.stopPropagation();
                                                      setEditingTimeId(item.id);
                                                    }
                                                  }}
                                                  className={`flex items-center gap-1.5 text-[10px] font-bold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 transition-all ${!isReadOnly ? "text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600 cursor-pointer" : "text-slate-500"}`}
                                                >
                                                  <Clock size={10} className={!isReadOnly ? "text-sky-500" : "text-slate-400"} /> {item.time}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-[11px] text-slate-400 truncate mt-1.5 flex items-center gap-1">
                                              <MapPin size={10} /> {item.location}
                                            </p>
                                          </div>

                                          {!isReadOnly && (
                                            <button
                                              className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                deleteItem(dayId, item.id);
                                              }}
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}

                                {day.items.length === 0 && (
                                  <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200/60 rounded-2xl bg-slate-50/50">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-2">
                                      <Plus size={16} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Drag places here</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </Droppable>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              {!isReadOnly && (
                <button
                  onClick={addDay}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50 transition-all font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 group mb-6"
                >
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  Add Day to Plan
                </button>
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/90 to-transparent rounded-b-[32px]" />
        </motion.div>

        {/* --- CENTER CARD: DYNAMIC EXPERIENCE VIEW --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/50 h-[calc(100vh-70px)] p-8 flex flex-col z-0 relative group/center"
        >
          <AnimatePresence mode="wait">
            {selectedPlace ? (
              // --- PLACE MODE ---
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col bg-slate-100/50 rounded-[32px] overflow-hidden p-3"
              >
                <div className="w-full h-full flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm ring-1 ring-black/5">
                  {/* 1. VISUAL HEADER (Fixed Top) */}
                  <div className="h-[40%] shrink-0 relative group/image">
                    <img src={selectedPlace.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105" />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                    {/* Back Button */}
                    <div className="absolute top-6 left-6 z-50">
                      <button
                        onClick={() => setSelectedPlace(null)}
                        className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg border border-white/50 flex items-center gap-2 group/btn"
                      >
                        <ArrowLeft size={16} className="group-hover/btn:-translate-x-1 transition-transform" /> Back
                      </button>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                          {selectedPlace.category || "Place"}
                        </span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none mb-2 drop-shadow-md">
                        {selectedPlace.title}
                      </h1>
                      <p className="text-white/90 text-sm font-medium flex items-center gap-2 drop-shadow-sm">
                        <MapPin size={14} className="text-sky-400 fill-sky-400" /> {selectedPlace.location}
                      </p>
                    </div>
                  </div>

                  {/* 2. SCROLLABLE CONTENT (Cards Layout) */}
                  <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    <div className="space-y-4 pb-16">

                      {/* Description Card */}
                      <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                          <h3 className="text-[11px] font-extrabold text-sky-600 uppercase tracking-widest">Overview</h3>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-bold shadow-md hover:bg-slate-800 transition-all group/nav">
                            <Navigation size={10} className="group-hover/nav:-translate-y-0.5 transition-transform" /> Get Directions
                          </button>
                        </div>
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50">
                          <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                            {selectedPlace.desc || "Experience the unique atmosphere of this location. Perfect for travelers looking to immerse themselves in local culture and history. A true gem in the heart of the city."}
                          </p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Cost */}
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center shrink-0 border border-sky-100">
                            <DollarSign size={20} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Cost</h4>
                            <p className="text-base font-bold text-slate-800">{selectedPlace.cost || "Free"}</p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
                            <Clock size={20} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Duration</h4>
                            <p className="text-base font-bold text-slate-800">{selectedPlace.duration || "1-2h"}</p>
                          </div>
                        </div>

                        {/* Best Time */}
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Best Time</h4>
                            <p className="text-base font-bold text-slate-800">{selectedPlace.bestTime || "Anytime"}</p>
                          </div>
                        </div>

                        {/* Type */}
                        <div className="bg-white p-4 rounded-[24px] shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100">
                            <Tag size={20} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Type</h4>
                            <p className="text-base font-bold text-slate-800">{selectedPlace.category || "General"}</p>
                          </div>
                        </div>
                      </div>

                      {/* CTAs - Removed as requested */}
                      <div className="pt-2"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // --- MAP MODE ---
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col bg-slate-100/50 rounded-[32px] overflow-hidden p-3"
              >
                <div className="w-full h-full flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm ring-1 ring-black/5">
                  {/* 1. VISUAL CARD (Map) */}
                  <div className="flex-1 relative z-0">
                    <MapContainer
                      center={[48.8566, 2.3522]}
                      zoom={13}
                      className="w-full h-full outline-none"
                      zoomControl={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      {mapPolylines.map((route, idx) => (
                        <Polyline
                          key={`${route.dayId}-${idx}`}
                          positions={route.coords}
                          pathOptions={{ color: route.color, opacity: 0.8, weight: 4, dashArray: '1, 8' }}
                        />
                      ))}
                      {mapMarkers.map((marker, idx) => (
                        <Marker
                          key={`${marker.dayId}-${marker.id}`}
                          position={marker.coords}
                          icon={createCustomIcon(marker.number, marker.dayColor)}
                          eventHandlers={{ click: () => setSelectedPlace(marker) }}
                        />
                      ))}
                      <MapUpdater locations={mapMarkers} />
                    </MapContainer>

                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                      <button className="w-9 h-9 bg-white rounded-xl shadow-md text-slate-600 flex items-center justify-center hover:bg-slate-50 font-bold border border-slate-100 transition-transform active:scale-95">+</button>
                      <button className="w-9 h-9 bg-white rounded-xl shadow-md text-slate-600 flex items-center justify-center hover:bg-slate-50 font-bold border border-slate-100 transition-transform active:scale-95">-</button>
                    </div>
                  </div>

                  {/* 2. SUMMARY SECTION (Below) */}
                  <div className="bg-white p-5 shrink-0 border-t border-slate-200 z-10 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h2 className="text-lg font-extrabold text-sky-800">{activeTrip.name}</h2>
                          <p className="text-xs text-slate-500 font-bold mt-0.5">{dayOrder.length} Days • 14.2 km</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Stops</span>
                          <span className="text-sm font-extrabold text-slate-800">
                            {Object.values(displayDays).reduce((sum, d) => sum + (d?.items?.length || 0), 0)}
                          </span>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Days</span>
                          <span className="text-sm font-extrabold text-slate-800">{dayOrder.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- RIGHT CARD: EXPLORE --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden h-[calc(100vh-48px)] z-10 transition-all ${isReadOnly ? 'grayscale-[0.5] opacity-60 pointer-events-none' : ''}`}
        >
          {/* Header & Tabs */}
          <div className="p-6 pb-2 shrink-0 bg-white/50 backdrop-blur-md z-20">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Add to Itinerary</h2>

            <div className="relative group mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search places in ${activeTrip.name.split(' ')[0]}...`}
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all shadow-sm"
              />
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['saved', 'nearby'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-300 ${activeTab === tab
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Places List */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 no-scrollbar">
            <div className="space-y-4 pt-2">
              {searchQuery.trim() && (
                <div className="px-1 mb-2">
                  <p className="text-[11px] font-bold text-slate-400">
                    Results for <span className="text-sky-600">“{searchQuery}”</span>
                  </p>
                </div>
              )}

              {/* EMPTY STATE FOR SAVED */}
              {!searchQuery.trim() && activeTab === "saved" && savedPlaces.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <Star size={18} className="text-slate-300" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">No saved places yet.</h3>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">
                    Save places from Explore to add them here.
                  </p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline transition-all"
                  >
                    Go to Explore
                  </button>
                </div>
              )}

              {(searchQuery.trim()
                ? [...savedPlaces, ...nearbyPlaces].filter(p =>
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.desc.toLowerCase().includes(searchQuery.toLowerCase())
                )
                : (activeTab === "saved" ? savedPlaces : nearbyPlaces)
              ).map((place, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className="group bg-white rounded-[24px] p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-3 group-hover:shadow-md transition-shadow">
                    <img src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1">
                      <Star size={10} className="text-amber-500 fill-amber-500" /> {place.rating}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-white text-[10px] font-bold">
                      {place.category}
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors">{place.name}</h4>
                      {/* Add Action */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        {Object.values(days).some(d => d.items.some(it => it.placeId === place.id)) ? (
                          <div className="flex items-center gap-2">
                            {addFeedback?.id === place.id && (
                              <span className="text-[10px] font-bold text-emerald-600 animate-pulse">
                                {addFeedback.dayName} ✓
                              </span>
                            )}
                            <button
                              disabled
                              className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center cursor-default shadow-sm border border-emerald-100"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setAddingPlace({ place, dayId: dayOrder[0], time: "10:00 AM" })}
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm group/btn bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white"
                            >
                              <Plus size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{place.desc}</p>

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate("/explore"); }}
                        className="text-[10px] font-bold text-sky-600 hover:text-sky-700 hover:underline transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </DragDropContext>

      {/* --- ADD PLACE MODAL (ASKING CARD) --- */}
      <AnimatePresence>
        {addingPlace && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddingPlace(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
            >
              {/* Header */}
              <div className="p-6 pb-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Add to Itinerary</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight truncate w-48">{addingPlace.place.name}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 space-y-5 py-2">
                {/* Day Selection */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Day</p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {dayOrder.map(id => (
                      <button
                        key={id}
                        onClick={() => setAddingPlace({ ...addingPlace, dayId: id })}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-[11px] font-black transition-all border ${addingPlace.dayId === id
                          ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-100"
                          : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300"
                          }`}
                      >
                        {days[id]?.title?.split(':')[0] || "Day"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">What Time?</p>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                      <Clock size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM or Evening"
                      value={addingPlace.time}
                      onChange={(e) => setAddingPlace({ ...addingPlace, time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-bold text-slate-700 outline-none ring-offset-0 focus:ring-2 focus:ring-sky-500/10 focus:border-sky-500/40 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-4 flex gap-3">
                <button
                  onClick={() => setAddingPlace(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-50 text-slate-500 text-xs font-black hover:bg-slate-100 transition-all border border-slate-100"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => addToDay(addingPlace.place, addingPlace.dayId, addingPlace.time)}
                  className="flex-[1.5] py-3.5 rounded-2xl bg-sky-600 text-white text-xs font-black hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 active:scale-95"
                >
                  CONFIRM ADD
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
