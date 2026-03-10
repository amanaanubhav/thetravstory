import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Plane, MapPin, Clock, DollarSign, Users, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import CircleLogo from "../pages/CircleLogo.png"

import { derivedSelectedPlaces } from "../data/placesFromItinerary";
import { itinerary } from "../data/itinerary";


const messagesInit = [
  {
    id: 1,
    from: "bot",
    text:
      "Yo, I'm your Vibe AI. Tell me what kind of energy you’re looking for. " +
      "Chaotic? Chill? Luxury? Or just ‘survive the weekend’?",
  },
];


const nearbyPlaces = [
  {
    id: 1,
    name: "Eiffel Tower Area",
    desc: "Iconic views, cafés, evening walks",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Montmartre",
    desc: "Art streets, cafés, city views",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Le Marais",
    desc: "Boutiques, food, historic vibes",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Eiffel Tower Area",
    desc: "Iconic views, cafés, evening walks",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Eiffel Tower Area",
    desc: "Iconic views, cafés, evening walks",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
  },
];

export default function Chat() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState("All days");
  const [activePlaceId, setActivePlaceId] = useState(
    derivedSelectedPlaces[0]?.id || 1
  );
  const [activeNearbyId, setActiveNearbyId] = useState(nearbyPlaces[0]?.id || 1);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    destination: "",
    budget: "Moderate",
    vibe: "Balanced",
    people: "2 People"
  });

  const [trips, setTrips] = useState([
    {
      id: 1,
      name: "Paris Summer",
      messages: messagesInit,
      itinerary: itinerary
    },
    {
      id: 2,
      name: "Dubai Luxury",
      messages: [
        { id: 1, from: "bot", text: "Welcome back! Ready to add some gold and desert vibes to your Dubai plan?" }
      ],
      itinerary: itinerary
    },
    {
      id: 3,
      name: "Kyoto Zen",
      messages: [
        { id: 1, from: "bot", text: "Kon'nichiwa! Let's find some peaceful temples and hidden tea houses in Kyoto." }
      ],
      itinerary: itinerary
    }
  ]);
  const [activeTripId, setActiveTripId] = useState(1);
  const [showTripSelector, setShowTripSelector] = useState(false);

  // Derived state for the active trip
  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];
  const messages = activeTrip.messages;

  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("itinerary");
  const [placeIndex, setPlaceIndex] = useState(0);

  const places = activeTrip.itinerary?.days?.flatMap(day => day.activities || [day]) || [];
  const currentPlace = places[placeIndex] || places[0] || {};
  const currentNearby = nearbyPlaces.find((p) => p.id === activeNearbyId) || nearbyPlaces[0];
  const selectedPlace = derivedSelectedPlaces?.find(
    (p) => p.id === activePlaceId
  ) || derivedSelectedPlaces[0] || {};

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setTrips(prev => prev.map(t =>
      t.id === activeTripId
        ? { ...t, messages: [...t.messages, { id: t.messages.length + 1, from: "user", text: input }] }
        : t
    ));
    setInput("");
  };

  const handleNewChat = () => {
    setShowOnboarding(true);
    setOnboardingStep(1);
    setOnboardingData({
      destination: "",
      budget: "Moderate",
      vibe: "Balanced",
      people: "2 People"
    });
  };

  const completeOnboarding = () => {
    const newId = Date.now();
    const newTrip = {
      id: newId,
      name: onboardingData.destination || `Trip ${trips.length + 1}`,
      messages: [
        {
          id: 1,
          from: "bot",
          text: onboardingData.destination
            ? `Got it! A ${onboardingData.vibe.toLowerCase()} trip to ${onboardingData.destination} for ${onboardingData.people} with a ${onboardingData.budget.toLowerCase()} budget. I'm already cooking up something epic. What's the first thing you want to do once we land?`
            : `Alright, level 1: blank slate. I'm ready to build your perfect trip from scratch. Where are we thinking of going first, or should I just throw some wild ideas at you?`
        }
      ],
      itinerary: itinerary
    };
    setTrips(prev => [...prev, newTrip]);
    setActiveTripId(newId);
    setShowOnboarding(false);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full w-full bg-white flex flex-col"
    >
      {/* ONBOARDING MODAL */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl overflow-hidden relative"
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                <motion.div
                  className="h-full bg-sky-600"
                  initial={{ width: "25%" }}
                  animate={{ width: `${(onboardingStep / 4) * 100}%` }}
                />
              </div>

              <button
                onClick={() => setShowOnboarding(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 transition"
              >
                <X size={18} className="text-slate-400" />
              </button>

              <div className="p-8 pt-10 text-center">
                <AnimatePresence mode="wait">
                  {onboardingStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-1">
                        <MapPin className="text-sky-600 w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Where to?</h2>
                      <p className="text-sm text-slate-500">Pick a city, country, or even just a continent.</p>
                      <input
                        autoFocus
                        value={onboardingData.destination}
                        onChange={(e) => setOnboardingData({ ...onboardingData, destination: e.target.value })}
                        placeholder="e.g. Tokyo, Japan"
                        className="w-full px-5 py-3.5 bg-slate-100/50 border-2 border-transparent focus:border-sky-600 rounded-xl outline-none text-base transition"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => setOnboardingStep(2)}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-base hover:bg-slate-200 transition"
                        >
                          Skip
                        </button>
                        <button
                          disabled={!onboardingData.destination}
                          onClick={() => setOnboardingStep(2)}
                          className="flex-[2] py-3 bg-sky-600 text-white rounded-xl font-bold text-base hover:bg-sky-700 transition disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {onboardingStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-1">
                        <DollarSign className="text-emerald-600 w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Budget?</h2>
                      <p className="text-sm text-slate-500">How much are we ballin'?</p>
                      <div className="grid grid-cols-2 gap-3">
                        {["Budget", "Moderate", "Luxury", "Broke AF"].map(b => (
                          <button
                            key={b}
                            onClick={() => setOnboardingData({ ...onboardingData, budget: b })}
                            className={`p-3.5 rounded-xl border-2 transition font-bold text-sm ${onboardingData.budget === b ? 'border-sky-600 bg-sky-50 text-sky-600' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setOnboardingStep(3)}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-base hover:bg-slate-200 transition"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => setOnboardingStep(3)}
                          className="flex-[2] py-3 bg-sky-600 text-white rounded-xl font-bold text-base hover:bg-sky-700 transition"
                        >
                          Next
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {onboardingStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-1">
                        <Sparkles className="text-purple-600 w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">The Vibe?</h2>
                      <p className="text-sm text-slate-500">What's the energy like?</p>
                      <div className="grid grid-cols-2 gap-3">
                        {["Chaotic", "Chill", "Adventure", "Balanced"].map(v => (
                          <button
                            key={v}
                            onClick={() => setOnboardingData({ ...onboardingData, vibe: v })}
                            className={`p-3.5 rounded-xl border-2 transition font-bold text-sm ${onboardingData.vibe === v ? 'border-sky-600 bg-sky-50 text-sky-600' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setOnboardingStep(4)}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-base hover:bg-slate-200 transition"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => setOnboardingStep(4)}
                          className="flex-[2] py-3 bg-sky-600 text-white rounded-xl font-bold text-base hover:bg-sky-700 transition"
                        >
                          Next
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {onboardingStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-1">
                        <Users className="text-orange-600 w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">Who's going?</h2>
                      <p className="text-sm text-slate-500">Solo mission or the whole squad?</p>
                      <div className="grid grid-cols-2 gap-3">
                        {["Solo", "2 People", "Small Squad", "Large Group"].map(p => (
                          <button
                            key={p}
                            onClick={() => setOnboardingData({ ...onboardingData, people: p })}
                            className={`p-3.5 rounded-xl border-2 transition font-bold text-sm ${onboardingData.people === p ? 'border-sky-600 bg-sky-50 text-sky-600' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={completeOnboarding}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-base hover:bg-slate-200 transition"
                        >
                          Skip
                        </button>
                        <button
                          onClick={completeOnboarding}
                          className="flex-[2] py-3 bg-sky-600 text-white rounded-xl font-bold text-base hover:bg-sky-700 transition"
                        >
                          Plan My Trip!
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Global Skip Option */}
                <div className="mt-8 pt-6 border-t border-slate-50">
                  <button
                    onClick={completeOnboarding}
                    className="text-slate-400 hover:text-slate-600 text-sm font-semibold transition flex items-center justify-center gap-1.5 mx-auto px-4 py-2 hover:bg-slate-50 rounded-xl"
                  >
                    Skip all and start chatting
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="h-8 flex items-center" />

      <main className="flex-1 w-full px-20">
        <div
          className="h-full grid gap-8"
          style={{ gridTemplateColumns: "64% 36%" }}
        >
          {/* CHAT */}
          <section>
            <div className="h-[570px] rounded-[32px] bg-white shadow-2xl border border-slate-100 flex flex-col">
              {/* HEADER */}
              <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-black tracking-tighter">
                    <img src={CircleLogo} alt="CircleLogo" />
                  </div>
                  <div>
                    <div className="font-semibold">Trap Vibe AI</div>
                    <div className="text-[12px] text-slate-500 font-semibold">
                      Knows vibes, not visas
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* TRIP SELECTOR DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTripSelector(!showTripSelector)}
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-800 text-sm font-semibold hover:border-sky-300 transition shadow-lg shadow-slate-100"
                    >
                      <span className="text-slate-400 font-medium mr-1">Planning:</span>
                      {activeTrip.name}
                      <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${showTripSelector ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showTripSelector && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-3 w-56 bg-white rounded-[24px] shadow-2xl border border-slate-100 py-3 z-50 overflow-hidden"
                        >
                          <div className="px-5 py-2.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">
                            Select active trip
                          </div>
                          <div className="max-h-[280px] overflow-y-auto no-scrollbar">
                            {trips.map(trip => (
                              <button
                                key={trip.id}
                                onClick={() => {
                                  setActiveTripId(trip.id);
                                  setShowTripSelector(false);
                                }}
                                className={`w-full px-5 py-3 text-left text-[14px] font-bold transition-all flex items-center justify-between group ${activeTripId === trip.id
                                  ? 'bg-sky-50 text-sky-600'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-sky-600'}`}
                              >
                                {trip.name}
                                {activeTripId === trip.id ? (
                                  <div className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]" />
                                ) : (
                                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-sky-400" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* NEW TRIP BUTTON */}
                  <button
                    onClick={handleNewChat}
                    className="text-sm font-semibold border border-sky-600 text-white bg-sky-600 hover:bg-sky-700 px-4 py-1.5 rounded-full transition shadow-md shadow-sky-100"
                  >
                    + New Trip
                  </button>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 px-8 py-4 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm shadow-sm ${m.from === "user"
                        ? "bg-sky-600 text-white rounded-br-none"
                        : "bg-sky-50 text-slate-800 rounded-bl-none border border-sky-100"
                        }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <form onSubmit={send} className="px-10 pb-8">
                <div className="flex items-center gap-3 bg-sky-50 rounded-full px-6 py-3 shadow-inner">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your vibe"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* ITINERARY */}
          <aside>
            <div className="h-[570px] rounded-[32px] bg-white shadow-2xl border border-slate-100 flex flex-col relative">
              {/* TABS */}
              <div className="px-11 pt-6 flex justify-between">
                <div className="flex gap-2 text-s font-semibold">
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`px-5 py-1.5 rounded-full border transition-all duration-200 ${activeTab === "itinerary"
                      ? "bg-slate-900 text-white border-slate-800"
                      : "bg-white text-slate-800 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                      }`}
                  >
                    Live Itinerary
                  </button>

                  <button
                    onClick={() => setActiveTab("places")}
                    className={`px-4 py-1.5 rounded-full border transition-all duration-200 ${activeTab === "places"
                      ? "bg-slate-900 text-white border-slate-800"
                      : "bg-white text-slate-600 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                      }`}
                  >
                    Places
                  </button>

                  <button
                    onClick={() => setActiveTab("nearby")}
                    className={`px-4 py-1.5 rounded-full border transition-all duration-200 ${activeTab === "nearby"
                      ? "bg-slate-900 text-white border-slate-800"
                      : "bg-white text-slate-600 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                      }`}
                  >
                    Explore Nearby
                  </button>
                </div>
              </div>

              {/* LIVE ITINERARY TAB */}
              <AnimatePresence mode="wait">
                {activeTab === "itinerary" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-[70px] left-1/2 -translate-x-1/2 w-[85%] z-20"
                  >
                    {/* DAY FILTER — OUTSIDE CARD */}
                    <div
                      className="
          sticky top-[-16px] z-30
          mb-4
          px-2
          py-3
          bg-white
          rounded-2xl
          shadow-sm
          flex gap-2
          overflow-x-auto no-scrollbar
        "
                    >
                      {[
                        "All days",
                        "Day 1",
                        "Day 2",
                        "Day 3",
                        "Day 4",
                        "Day 5",
                        "Day 6",
                      ].map((day) => (
                        <button
                          key={day}
                          onClick={() => setActiveDay(day)}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap transition ${activeDay === day
                            ? "bg-sky-600 text-white border-sky-500"
                            : "bg-white text-slate-600 border-slate-300 hover:border-sky-400"
                            }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>

                    {/* BIG FLOATING CARD */}
                    <div className="rounded-3xl bg-white shadow-2xl px-6 py-5 space-y-4 max-h-[48vh] overflow-y-auto no-scrollbar relative mb-4">
                      {/* ITINERARY DAYS */}
                      {(activeTrip.itinerary?.days || [])
                        .filter(day => activeDay === "All days" || `Day ${day.dayNumber}` === activeDay)
                        .map((day, dayIdx) => (
                          <div key={day.id} className="space-y-4 mb-8">
                            {/* Day Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="h-px flex-1 bg-slate-100" />
                              <div className="bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest">Day {day.dayNumber}</span>
                                <div className="h-1 w-1 rounded-full bg-slate-200" />
                                <span className="text-[11px] font-bold text-slate-500">{day.date}</span>
                              </div>
                              <div className="h-px flex-1 bg-slate-100" />
                            </div>

                            {(day.activities || [day]).map((activity, actIdx) => {
                              const Icon = activity.icon || MapPin;
                              const isLastInDay = day.activities ? actIdx === day.activities.length - 1 : true;
                              const isLastDay = dayIdx === activeTrip.itinerary.days.length - 1;

                              return (
                                <motion.div
                                  key={activity.id}
                                  initial={{ opacity: 0, y: 12 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                  className="flex gap-4 items-stretch"
                                >
                                  {/* TIMELINE */}
                                  <div className="flex flex-col items-center">
                                    <div
                                      className="
                                      h-4 w-4
                                      rounded-full
                                      border-2 border-sky-600
                                      bg-transparent
                                      flex items-center justify-center
                                    "
                                    >
                                      {actIdx === 0 && (
                                        <Icon size={10} className="text-sky-600" />
                                      )}
                                    </div>

                                    {(!isLastInDay || !isLastDay) && (
                                      <div className="flex-1 w-px border-l-2 border-dotted border-sky-300 mt-1" />
                                    )}
                                  </div>

                                  {/* CARD */}
                                  <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 20,
                                    }}
                                    className="
                                    relative
                                    flex items-center gap-4
                                    w-full
                                    rounded-2xl
                                    bg-white
                                    px-6 py-3
                                    shadow-xl
                                    border border-slate-100
                                    hover:shadow-2xl
                                    transition-all
                                  "
                                  >
                                    {/* LEFT CONTENT */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 text-[10px] text-sky-600 font-bold uppercase tracking-wide">
                                        <Icon size={12} /> {activity.time} • {activity.type}
                                      </div>

                                      <div className="font-bold text-[14px] text-slate-800 mt-1">
                                        {activity.title}
                                      </div>

                                      <div className="text-[11px] text-slate-400 mt-0.5">
                                        {activity.place}
                                      </div>
                                    </div>

                                    {/* RIGHT IMAGE */}
                                    <img
                                      src={activity.img}
                                      alt={activity.title}
                                      className="
                                      h-14 w-14
                                      rounded-xl
                                      object-cover
                                      shadow-lg
                                      ring-4 ring-white
                                      translate-y-[-2px]
                                    "
                                    />
                                  </motion.div>
                                </motion.div>
                              );
                            })}
                          </div>
                        ))}
                    </div>

                    {/* FINALIZE BUTTON */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/bookings")}
                      className="
                          w-full py-4 rounded-2xl
                          bg-gradient-to-r from-sky-600 to-sky-500
                          text-white font-bold text-sm
                          shadow-xl shadow-sky-100
                          flex items-center justify-center gap-3
                          hover:shadow-2xl hover:shadow-sky-300
                          transition-all duration-300
                        "
                    >
                      <Sparkles size={18} />
                      Finalize & Show Bookings
                      <ChevronRight size={18} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PLACES TAB */}
              <AnimatePresence mode="wait">
                {activeTab === "places" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[85%] z-20"
                  >
                    <div className="rounded-3xl bg-white shadow-2xl px-6 py-1">
                      <div className="flex justify-between mb-3">
                        <p className="text-sm font-semibold">
                          Places from this plan
                        </p>
                        <p className="text-xs text-sky-700 font-semibold">
                          As planned · Day {currentPlace.id}
                        </p>
                      </div>

                      <div className="relative">
                        {/* LEFT */}
                        <button
                          onClick={() =>
                            setPlaceIndex((i) => Math.max(i - 1, 0))
                          }
                          disabled={placeIndex === 0}
                          className="
    absolute left-[-50px] top-1/2 -translate-y-1/2
    h-9 w-9 rounded-full
    bg-sky-600
    flex items-center justify-center
    shadow-md
    transition
    hover:bg-sky-700
    disabled:opacity-90
  "
                        >
                          <ChevronLeft size={20} className="text-white" />
                        </button>

                        <button
                          onClick={() =>
                            setPlaceIndex((i) =>
                              Math.min(i + 1, places.length - 1)
                            )
                          }
                          disabled={placeIndex === places.length - 1}
                          className="
    absolute right-[-50px] top-1/2 -translate-y-1/2
    h-9 w-9 rounded-full
    bg-sky-600
    flex items-center justify-center
    shadow-md
    transition
    hover:bg-sky-700
    disabled:opacity-40
  "
                        >
                          <ChevronRight size={20} className="text-white" />
                        </button>

                        <AnimatePresence mode="wait">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative mb-3"
                          >
                            {/* IMAGE */}
                            <img
                              src={selectedPlace?.img || "place1.jpg"}
                              alt={selectedPlace?.name || "Place"}
                              className="h-[160px] w-full object-cover rounded-2xl"
                            />

                            {/* IMAGE DESCRIPTION */}
                            <div
                              className="absolute bottom-0 left-0 right-0
                    rounded-b-2xl
                    bg-gradient-to-t from-black/60 to-transparent
                    px-4 py-3"
                            >
                              <p className="text-sm font-semibold text-white">
                                {selectedPlace?.name}
                              </p>
                              <p className="text-xs text-white/80">
                                {selectedPlace?.desc}
                              </p>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* OTHER PLACES */}
                        <div className="mt-4 space-y-2 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
                          {derivedSelectedPlaces
                            .filter((p) => p.id !== activePlaceId)
                            .slice(0, 4)
                            .map((p) => (
                              <motion.button
                                key={p.id}
                                onClick={() => setActivePlaceId(p.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition"
                              >
                                <img
                                  src={p.img}
                                  alt={p.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="text-left">
                                  <p className="text-xs font-semibold text-slate-800">
                                    {p.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {p.desc}
                                  </p>
                                </div>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* EXPLORE NEARBY TAB */}
              <AnimatePresence mode="wait">
                {activeTab === "nearby" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[85%] z-20"
                  >
                    <div className="rounded-3xl bg-white shadow-2xl px-6 py-1">
                      {/* HEADER */}
                      <div className="flex justify-between mb-3">
                        <p className="text-sm font-semibold">Explore nearby</p>
                        <p className="text-xs text-sky-700 font-semibold">
                          Optional · Day {currentPlace.id}
                        </p>
                      </div>

                      <div className="relative">
                        {/* LEFT */}
                        <button
                          onClick={() =>
                            setPlaceIndex((i) => Math.max(i - 1, 0))
                          }
                          disabled={placeIndex === 0}
                          className="
    absolute left-[-50px] top-1/2 -translate-y-1/2
    h-9 w-9 rounded-full
    bg-sky-600
    flex items-center justify-center
    shadow-md
    transition
    hover:bg-sky-700
    disabled:opacity-90
  "
                        >
                          <ChevronLeft size={20} className="text-white" />
                        </button>

                        {/* RIGHT */}
                        <button
                          onClick={() =>
                            setPlaceIndex((i) =>
                              Math.min(i + 1, places.length - 1)
                            )
                          }
                          disabled={placeIndex === places.length - 1}
                          className="
    absolute right-[-50px] top-1/2 -translate-y-1/2
    h-9 w-9 rounded-full
    bg-sky-600
    flex items-center justify-center
    shadow-md
    transition
    hover:bg-sky-700
    disabled:opacity-40
  "
                        >
                          <ChevronRight size={20} className="text-white" />
                        </button>

                        {/* MAIN IMAGE */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeNearbyId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative mb-3"
                          >
                            {/* IMAGE */}
                            <img
                              src={currentNearby?.img || "nearby1.jpg"}
                              alt={currentNearby?.name || "Nearby"}
                              className="h-[160px] w-full object-cover rounded-2xl"
                            />

                            {/* IMAGE DESCRIPTION */}
                            <div
                              className="absolute bottom-0 left-0 right-0
                    rounded-b-2xl
                    bg-gradient-to-t from-black/60 to-transparent
                    px-4 py-3"
                            >
                              <p className="text-sm font-semibold text-white">
                                {currentNearby?.name}
                              </p>
                              <p className="text-xs text-white/80">
                                {currentNearby?.desc}
                              </p>
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        {/* OTHER NEARBY OPTIONS */}
                        <div className="mt-4 space-y-2 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
                          {nearbyPlaces
                            .filter((p) => p.id !== currentNearby?.id)
                            .slice(0, 4)
                            .map((p) => (
                              <motion.button
                                key={p.id}
                                onClick={() => setActiveNearbyId(p.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition"
                              >
                                <img
                                  src={p.img}
                                  alt={p.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="text-left">
                                  <p className="text-xs font-semibold text-slate-800">
                                    {p.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {p.desc}
                                  </p>
                                </div>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-white rounded-b-[32px]" />
            </div>
          </aside>
        </div >
      </main >
    </motion.div >
  );
}
