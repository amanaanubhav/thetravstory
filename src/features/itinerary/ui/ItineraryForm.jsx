// src/components/ItineraryForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTrip } from "../../../app/providers/TripProvider";
import { useUser } from "../../../app/providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, DollarSign, Users, Sparkles, ArrowRight,
  ArrowLeft, X, Check, Plane, Star, Clock, Zap, Wind, Coffee,
  Mountain, Waves, Building2, UtensilsCrossed, Compass, ChevronRight
} from "lucide-react";

// ─── Free API helpers

const UNSPLASH_ACCESS_KEY = "pFGGZMvFtmEWMtXVRSmJ_k37qMnJwm-U0UVHe4RPVB0"; // demo key

async function fetchDestinationImage(city) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + " travel")}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || `https://source.unsplash.com/800x500/?${encodeURIComponent(city)},travel`;
  } catch {
    return `https://source.unsplash.com/800x500/?${encodeURIComponent(city)},travel`;
  }
}

async function fetchCityInfo(city) {
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const geoData = await geoRes.json();
    return geoData[0] || null;
  } catch {
    return null;
  }
}

// Generate itinerary locally using OpenTripMap + smart scheduling
async function generateSmartItinerary({ destinations, startDate, endDate, budget, pace, groupSize, personality }) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));

  const activitiesPerDay = pace === "relaxed" ? 2 : pace === "intense" ? 4 : 3;

  const days = [];
  let dayCounter = 0;

  for (const dest of destinations) {
    const daysForDest = Math.max(1, Math.floor(totalDays / destinations.length));

    // Try to get real places from OpenTripMap (free, no key needed for basic)
    let places = [];
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(dest)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const geoData = await geoRes.json();
      if (geoData[0]) {
        const { lat, lon } = geoData[0];
        const radius = 5000;
        const otmRes = await fetch(
          `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=interesting_places,cultural,natural,architecture,religion,museums&limit=20&format=json&apikey=5ae2e3f221c38a28845f05b66eb3b62a21b5b37d8ed3d2b3bf5a5bfd`
        );
        const otmData = await otmRes.json();
        if (Array.isArray(otmData)) {
          places = otmData.filter(p => p.name && p.name.trim() !== "").slice(0, daysForDest * activitiesPerDay);
        }
      }
    } catch (e) {
      // fallback below
    }

    // Fallback: generate themed activities based on personality
    if (places.length < 3) {
      const personalityActivities = {
        "The Explorer": [
          { name: `${dest} City Walk & Hidden Gems`, kinds: "natural", xid: null },
          { name: `${dest} Adventure Tour`, kinds: "natural", xid: null },
          { name: `Local Market Exploration in ${dest}`, kinds: "cultural", xid: null },
          { name: `${dest} Viewpoint Trek`, kinds: "natural", xid: null },
          { name: `Street Art District - ${dest}`, kinds: "cultural", xid: null },
        ],
        "The Relaxer": [
          { name: `${dest} Spa & Wellness Morning`, kinds: "other", xid: null },
          { name: `Beachside Retreat near ${dest}`, kinds: "natural", xid: null },
          { name: `${dest} Garden & Parks Stroll`, kinds: "natural", xid: null },
          { name: `Sunset Cruise from ${dest}`, kinds: "other", xid: null },
          { name: `${dest} Meditation Retreat`, kinds: "other", xid: null },
        ],
        "The Foodie": [
          { name: `${dest} Street Food Safari`, kinds: "foods", xid: null },
          { name: `${dest} Local Market & Cooking Class`, kinds: "foods", xid: null },
          { name: `Fine Dining Experience in ${dest}`, kinds: "foods", xid: null },
          { name: `${dest} Wine & Cheese Tasting`, kinds: "foods", xid: null },
          { name: `${dest} Night Food Market`, kinds: "foods", xid: null },
        ],
        "The Culture Vulture": [
          { name: `${dest} History Museum`, kinds: "museums", xid: null },
          { name: `${dest} Old Town Walking Tour`, kinds: "cultural", xid: null },
          { name: `Traditional ${dest} Ceremony Experience`, kinds: "cultural", xid: null },
          { name: `${dest} Art Gallery Tour`, kinds: "museums", xid: null },
          { name: `${dest} UNESCO Heritage Site Visit`, kinds: "architecture", xid: null },
        ],
      };
      const fallbackActivities = personalityActivities[personality] || personalityActivities["The Explorer"];
      places = fallbackActivities.map((a, i) => ({ name: a.name, kinds: a.kinds, xid: `fallback-${i}`, point: { lon: 0, lat: 0 } }));
    }

    const categoryMap = {
      natural: "nature",
      cultural: "sightseeing",
      museums: "sightseeing",
      architecture: "sightseeing",
      religion: "sightseeing",
      foods: "food",
      other: "activity",
    };

    const timeSlots = ["09:00", "11:00", "14:00", "16:30", "19:00"];
    const costRanges = {
      low: ["Free", "$5–$15", "$10–$20"],
      medium: ["$15–$30", "$25–$50", "Free"],
      high: ["$50–$100", "$30–$60", "$80–$150"],
    };
    const budgetLevel = budget < 1000 ? "low" : budget < 3000 ? "medium" : "high";

    for (let d = 0; d < daysForDest; d++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + dayCounter);
      const dateStr = currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const dayPlaces = places.slice(d * activitiesPerDay, (d + 1) * activitiesPerDay);

      const items = [];

      // Add flight on first day of first destination
      if (dayCounter === 0) {
        items.push({
          type: "flight",
          time: "08:00",
          title: `Fly to ${dest}`,
          meta: `Arrival at ${dest} International Airport`,
          location: dest,
          cost: `$${Math.round(budget * 0.2 / groupSize)}`,
          duration: "varies",
          category: "Transport",
          bestTime: "Morning",
          tags: ["Flight", "Arrival"],
          coords: null,
          img: `https://source.unsplash.com/800x500/?airport,travel`,
        });
      }

      // Add hotel check-in on first day of each destination
      if (d === 0) {
        items.push({
          type: "stay",
          time: "14:00",
          title: `Hotel Check-in — ${dest}`,
          meta: `${daysForDest} nights in ${dest}`,
          location: dest,
          cost: `$${Math.round(budget * 0.35 / destinations.length / daysForDest)}/night`,
          duration: `${daysForDest} nights`,
          category: "Hotel",
          bestTime: "Afternoon",
          tags: ["Hotel", "Check-in"],
          coords: null,
          img: `https://source.unsplash.com/800x500/?hotel,${encodeURIComponent(dest)}`,
        });
      }

      dayPlaces.forEach((place, idx) => {
        const kindKey = (place.kinds || "other").split(",")[0];
        const category = categoryMap[kindKey] || "activity";
        const costs = costRanges[budgetLevel];
        const cost = costs[idx % costs.length];

        items.push({
          type: category === "food" ? "food" : "activity",
          time: timeSlots[idx + (d === 0 ? 2 : 0)] || "10:00",
          title: place.name,
          meta: `${dest} · ${place.kinds?.split(",")[0]?.replace(/_/g, " ") || "Activity"}`,
          location: dest,
          cost,
          duration: category === "food" ? "1–2h" : "2–3h",
          category: category === "food" ? "Food" : "Sightseeing",
          bestTime: idx === 0 ? "Morning" : idx === 1 ? "Afternoon" : "Evening",
          tags: [dest, place.kinds?.split(",")[0] || "Activity"],
          coords: place.point?.lat && place.point?.lon ? [place.point.lat, place.point.lon] : null,
          img: `https://source.unsplash.com/800x500/?${encodeURIComponent(place.name.split(" ")[0])},${encodeURIComponent(dest)}`,
        });
      });

      days.push({
        label: `Day ${dayCounter + 1} · ${dest}`,
        date: dateStr,
        destination: dest,
        items,
      });

      dayCounter++;
    }
  }

  return days;
}

// ─── Personality config ──────────────────────────────────────────────────────

const PERSONALITY_CONFIG = {
  "The Explorer": {
    color: "#f97316",
    gradient: "from-orange-500 to-rose-500",
    bg: "from-orange-50 to-rose-50",
    icon: Compass,
    label: "Explorer",
    destinations: ["Bali", "Peru", "New Zealand", "Nepal", "Patagonia"],
    desc: "Off-the-beaten-path adventures",
  },
  "The Relaxer": {
    color: "#06b6d4",
    gradient: "from-cyan-500 to-teal-500",
    bg: "from-cyan-50 to-teal-50",
    icon: Waves,
    label: "Relaxer",
    destinations: ["Maldives", "Santorini", "Bali", "Phuket", "Amalfi Coast"],
    desc: "Serene escapes and slow travel",
  },
  "The Foodie": {
    color: "#f59e0b",
    gradient: "from-amber-500 to-yellow-500",
    bg: "from-amber-50 to-yellow-50",
    icon: UtensilsCrossed,
    label: "Foodie",
    destinations: ["Tokyo", "Naples", "Bangkok", "Lyon", "Mexico City"],
    desc: "Culinary journeys & tastings",
  },
  "The Culture Vulture": {
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-600",
    bg: "from-violet-50 to-purple-50",
    icon: Building2,
    label: "Culture Vulture",
    destinations: ["Rome", "Athens", "Kyoto", "Cairo", "Istanbul"],
    desc: "History, art & deep dives",
  },
};

const DEFAULT_CONFIG = PERSONALITY_CONFIG["The Explorer"];

// ─── Destination Card ────────────────────────────────────────────────────────

function DestCard({ city, selected, onClick, config }) {
  const [img, setImg] = useState(`https://source.unsplash.com/400x300/?${encodeURIComponent(city)},travel`);

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden h-28 text-left group transition-all ${
        selected ? "ring-3 ring-offset-2" : "ring-0"
      }`}
      style={selected ? { ringColor: config.color } : {}}
    >
      <img src={img} alt={city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className={`absolute inset-0 transition-opacity ${selected ? "opacity-60" : "opacity-40"} bg-gradient-to-t from-black to-transparent`} />
      {selected && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg"
        >
          <Check size={12} style={{ color: config.color }} strokeWidth={3} />
        </motion.div>
      )}
      <span className="absolute bottom-2 left-3 text-white font-bold text-sm drop-shadow-lg">{city}</span>
    </motion.button>
  );
}

// ─── Step components ─────────────────────────────────────────────────────────

function StepWhere({ destinations, setDestinations, customDest, setCustomDest, config }) {
  const suggestions = config.destinations;
  const toggleDest = (city) => {
    setDestinations(prev =>
      prev.includes(city) ? prev.filter(d => d !== city) : [...prev, city]
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: config.color }}>
          Suggested for {config.label}s
        </p>
        <div className="grid grid-cols-3 gap-2">
          {suggestions.map(city => (
            <DestCard key={city} city={city} selected={destinations.includes(city)} onClick={() => toggleDest(city)} config={config} />
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400 font-semibold">or type your own</span></div>
      </div>
      <div className="relative">
        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={customDest}
          onChange={e => setCustomDest(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && customDest.trim()) {
              toggleDest(customDest.trim());
              setCustomDest("");
            }
          }}
          placeholder="Type a city and press Enter…"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          style={{ focusRingColor: config.color }}
        />
      </div>
      {destinations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {destinations.map(d => (
            <motion.span
              key={d} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: config.color }}
            >
              {d}
              <button onClick={() => toggleDest(d)} className="opacity-70 hover:opacity-100 transition-opacity">
                <X size={10} />
              </button>
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

function StepWhen({ startDate, setStartDate, endDate, setEndDate, config }) {
  const days = startDate && endDate
    ? Math.max(0, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Depart</label>
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Return</label>
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split("T")[0]}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
          />
        </div>
      </div>
      {days > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${config.bg} rounded-2xl p-5 flex items-center gap-4`}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}aa)` }}>
            {days}
          </div>
          <div>
            <p className="font-black text-slate-800 text-lg">{days} {days === 1 ? "day" : "days"} of adventure</p>
            <p className="text-sm text-slate-500 mt-0.5">
              {days < 3 ? "Quick escape" : days < 7 ? "Perfect short trip" : days < 14 ? "Ideal getaway" : "Epic journey"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StepWho({ groupSize, setGroupSize, pace, setPace, config }) {
  const paceOptions = [
    { value: "relaxed", label: "Relaxed", desc: "2–3 activities/day", icon: Coffee },
    { value: "moderate", label: "Moderate", desc: "3–4 activities/day", icon: Wind },
    { value: "intense", label: "Intense", desc: "4–5 activities/day", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Travelers</label>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setGroupSize(s => Math.max(1, s - 1))}
            className="w-11 h-11 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400 font-bold text-lg transition-all active:scale-90">
            −
          </button>
          <div className="flex-1 text-center">
            <motion.span key={groupSize} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-black text-slate-800">{groupSize}</motion.span>
            <p className="text-sm text-slate-400 mt-1">{groupSize === 1 ? "Solo" : groupSize === 2 ? "Couple" : `Group of ${groupSize}`}</p>
          </div>
          <button type="button" onClick={() => setGroupSize(s => Math.min(12, s + 1))}
            className="w-11 h-11 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-400 font-bold text-lg transition-all active:scale-90"
            style={{ borderColor: groupSize < 12 ? undefined : "transparent" }}>
            +
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Travel Pace</label>
        <div className="grid grid-cols-3 gap-3">
          {paceOptions.map(opt => {
            const Icon = opt.icon;
            const active = pace === opt.value;
            return (
              <button key={opt.value} type="button" onClick={() => setPace(opt.value)}
                className={`rounded-2xl p-4 text-center transition-all border-2 ${active ? "text-white border-transparent shadow-lg" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}
                style={active ? { background: `linear-gradient(135deg, ${config.color}, ${config.color}bb)` } : {}}>
                <Icon size={22} className={`mx-auto mb-2 ${active ? "text-white" : "text-slate-400"}`} />
                <p className="font-bold text-sm">{opt.label}</p>
                <p className={`text-[10px] mt-0.5 ${active ? "text-white/80" : "text-slate-400"}`}>{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepBudget({ budget, setBudget, groupSize, config }) {
  const perPerson = Math.round(budget / groupSize);
  const tiers = [
    { label: "Budget", range: "$500–$1,500", val: 1000 },
    { label: "Mid-range", range: "$1,500–$4,000", val: 2500 },
    { label: "Premium", range: "$4,000–$8,000", val: 6000 },
    { label: "Luxury", range: "$8,000+", val: 12000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-end mb-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Budget</label>
          <motion.span key={budget} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-black" style={{ color: config.color }}>
            ${budget.toLocaleString()}
          </motion.span>
        </div>
        <input
          type="range" min={200} max={20000} step={100} value={budget}
          onChange={e => setBudget(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: config.color }}
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-semibold">
          <span>$200</span><span>$10K</span><span>$20K</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiers.map(t => {
          const active = budget >= (t.val * 0.6) && budget < (t.val * 1.8);
          return (
            <button key={t.label} type="button" onClick={() => setBudget(t.val)}
              className={`rounded-2xl p-4 text-left border-2 transition-all ${active ? "border-transparent text-white shadow-md" : "border-slate-200 hover:border-slate-300"}`}
              style={active ? { background: `linear-gradient(135deg, ${config.color}, ${config.color}99)` } : {}}>
              <p className={`font-bold text-sm ${active ? "text-white" : "text-slate-700"}`}>{t.label}</p>
              <p className={`text-[11px] mt-0.5 ${active ? "text-white/80" : "text-slate-400"}`}>{t.range}</p>
            </button>
          );
        })}
      </div>

      {groupSize > 1 && (
        <div className={`bg-gradient-to-r ${config.bg} rounded-2xl p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-600">Per person ({groupSize} travelers)</span>
          </div>
          <span className="font-black text-slate-800">${perPerson.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ItineraryForm({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { createTrip } = useTrip();
  const { user } = useUser();

  const [step, setStep] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [customDest, setCustomDest] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(2000);
  const [pace, setPace] = useState("moderate");
  const [groupSize, setGroupSize] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("");

  const config = PERSONALITY_CONFIG[user?.personalityTag] || DEFAULT_CONFIG;

  const steps = [
    { id: "where", title: "Where to?", subtitle: "Pick your dream destinations", icon: MapPin },
    { id: "when", title: "When?", subtitle: "Choose your travel dates", icon: Calendar },
    { id: "who", title: "Who's going?", subtitle: "Travelers & pace", icon: Users },
    { id: "budget", title: "Your budget", subtitle: "How much to spend", icon: DollarSign },
  ];

  const canProceed = () => {
    if (step === 0) return destinations.length > 0;
    if (step === 1) return startDate && endDate && new Date(endDate) > new Date(startDate);
    if (step === 2) return groupSize >= 1;
    if (step === 3) return budget >= 200;
    return false;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const msgs = [
      "Mapping your destinations…",
      "Personalizing for your style…",
      "Curating local experiences…",
      "Building your day-by-day plan…",
      "Adding finishing touches…",
    ];
    let msgIdx = 0;
    setLoadingMsg(msgs[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % msgs.length;
      setLoadingMsg(msgs[msgIdx]);
    }, 1800);

    try {
      const itinerary = await generateSmartItinerary({
        destinations,
        startDate,
        endDate,
        budget,
        pace,
        groupSize,
        personality: user?.personalityTag || "The Explorer",
      });

      const newTrip = createTrip({
        title: destinations.length === 1
          ? `${destinations[0]} Getaway`
          : destinations.join(" → "),
        dates: `${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        summary: `${destinations.length} destination${destinations.length > 1 ? "s" : ""} · ${pace} pace · ${groupSize} traveler${groupSize > 1 ? "s" : ""}`,
        locations: destinations,
        vibeTag: user?.personalityTag || "Explorer",
        budget: { total: budget, currency: "USD" },
        itinerary,
      });

      clearInterval(interval);
      navigate(`/planner/${newTrip.id}`);
      onClose();
      setStep(0);
      setDestinations([]);
    } catch (err) {
      clearInterval(interval);
      setError("Could not generate itinerary. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const PersonalityIcon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative"
          >
            {/* Gradient header */}
            <div className={`bg-gradient-to-br ${config.gradient} p-6 pb-8 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <PersonalityIcon size={14} className="text-white" />
                    <span className="text-white text-xs font-bold">{config.label} Mode</span>
                  </div>
                  <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all">
                    <X size={16} />
                  </button>
                </div>
                <h2 className="text-2xl font-black text-white">{steps[step].title}</h2>
                <p className="text-white/80 text-sm mt-1">{steps[step].subtitle}</p>
              </div>
            </div>

            {/* Step dots */}
            <div className="absolute top-[140px] left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {steps.map((s, i) => (
                <motion.div key={i} animate={{ width: i === step ? 24 : 8, opacity: i <= step ? 1 : 0.4 }}
                  className="h-2 rounded-full bg-white shadow-md transition-all" />
              ))}
            </div>

            {/* Content */}
            <div className="p-6 pt-8 min-h-[320px]">
              {loading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 animate-spin"
                      style={{ borderTopColor: config.color }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={20} style={{ color: config.color }} />
                    </div>
                  </div>
                  <motion.p key={loadingMsg} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold text-slate-600 text-center">{loadingMsg}</motion.p>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    {step === 0 && <StepWhere destinations={destinations} setDestinations={setDestinations} customDest={customDest} setCustomDest={setCustomDest} config={config} />}
                    {step === 1 && <StepWhen startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} config={config} />}
                    {step === 2 && <StepWho groupSize={groupSize} setGroupSize={setGroupSize} pace={pace} setPace={setPace} config={config} />}
                    {step === 3 && <StepBudget budget={budget} setBudget={setBudget} groupSize={groupSize} config={config} />}
                  </motion.div>
                </AnimatePresence>
              )}
              {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl p-3 mt-3">{error}</p>}
            </div>

            {/* Footer nav */}
            {!loading && (
              <div className="px-6 pb-6 flex items-center justify-between gap-3">
                <button
                  onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
                >
                  <ArrowLeft size={16} /> {step === 0 ? "Cancel" : "Back"}
                </button>

                {step < steps.length - 1 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg active:scale-95"
                    style={{ background: canProceed() ? `linear-gradient(135deg, ${config.color}, ${config.color}cc)` : undefined, backgroundColor: canProceed() ? undefined : "#cbd5e1" }}
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-xl transition-all disabled:opacity-40 active:scale-95"
                    style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}bb)` }}
                  >
                    <Sparkles size={16} /> Generate Itinerary
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}