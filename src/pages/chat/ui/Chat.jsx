// src/pages/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowUpRight,
  Plane,
  MapPin,
  Clock,
  Plus,
  Loader,
  Send,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import useChatAI from "../../../features/chat/lib/useChatAI";
import { useUser } from "../../../app/providers/UserProvider";
import { useTrip } from "../../../app/providers/TripProvider";
import Button from "../../../shared/ui/Button";

// Static data from the second design (keep for now)
import { derivedSelectedPlaces } from "../../../shared/mocks/placesFromItinerary";
import { itinerary } from "../../../shared/mocks/itinerary";

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
  // Original functionality
  const { messages, loading, sendMessage, suggestions } = useChatAI();
  const { user } = useUser();
  const { addTrip } = useTrip();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // UI state from the second design
  const [activeDay, setActiveDay] = useState("All days");
  const [activePlaceId, setActivePlaceId] = useState(
    derivedSelectedPlaces[0]?.id || 1
  );
  const [activeNearbyId, setActiveNearbyId] = useState(nearbyPlaces[0]?.id || 1);
  const [activeTab, setActiveTab] = useState("itinerary"); // "itinerary", "places", "nearby"
  const [placeIndex, setPlaceIndex] = useState(0);

  // Data for places/nearby tabs (static from second design)
  const places = itinerary.days;
  const currentPlace = places[placeIndex] || places[0];
  const currentNearby = nearbyPlaces.find((p) => p.id === activeNearbyId) || nearbyPlaces[0];
  const selectedPlace = derivedSelectedPlaces.find((p) => p.id === activePlaceId) || derivedSelectedPlaces[0];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userInput = input;
    setInput("");
    await sendMessage(userInput);
  };

  const handleCreateTrip = async (suggestion) => {
    try {
      const newTrip = {
        title: suggestion.title || "New Trip",
        description: suggestion.description || "",
        locations: suggestion.locations || [],
        dates: {
          start: suggestion.start_date || new Date().toISOString().split("T")[0],
          end: suggestion.end_date || new Date().toISOString().split("T")[0],
        },
        duration: suggestion.duration || 7,
        budget: {
          total: suggestion.budget || 2000,
          currency: "USD",
          breakdown: suggestion.budget_breakdown || {},
        },
        itinerary: suggestion.itinerary || [],
        personality_match: suggestion.personality_match || {},
      };
      addTrip(newTrip);
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  const handleNewChat = () => {
    // Optional: clear messages – depends on your useChatAI implementation
    // If your hook supports reset, call it here. Otherwise, you might reload the page.
    // For now we'll just clear input.
    setInput("");
    // You could also trigger a reset method from the hook if available.
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-sky-50 via-sky-100 to-white">
      {/* Header (from first design) */}
      <header className="h-16 flex items-center justify-between border-b border-slate-200">
        <div className="w-full max-w-[1650px] px-12 flex gap-12">
          <div className="flex items-center gap-2 text-lg font-semibold">
            TRAVIXO
            <span className="h-2 w-2 rounded-full bg-sky-500" />
          </div>
          <div className="flex items-center gap-3 text-sm ml-auto">
            <div className="text-right">
              <div className="font-semibold">{user?.name || "Traveler"}</div>
              <div className="text-sky-500 text-xs">{user?.personality || "Explorer"}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-sky-200" />
          </div>
        </div>
      </header>

      {/* Main content (adapted from second design) */}
      <main className="flex-1 w-full px-20 py-6 overflow-hidden">
        <div className="h-full grid gap-8" style={{ gridTemplateColumns: "64% 36%" }}>
          {/* CHAT CARD */}
          <section>
            <div className="h-[570px] rounded-[32px] bg-white shadow-2xl border border-slate-100 flex flex-col">
              {/* Chat Header */}
              <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                    Travixo
                  </div>
                  <div>
                    <div className="font-semibold">Travixo AI Assistant</div>
                    <div className="text-[12px] text-slate-500 font-semibold">
                      Your personal travel companion
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNewChat}
                  className="text-m font-semibold border text-white bg-sky-600 hover:text-sky-700 hover:bg-sky-50 px-3 py-1 rounded-full transition"
                >
                  + New Chat
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 px-8 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm ${
                          msg.from === "user"
                            ? "bg-sky-500 text-white"
                            : "bg-sky-50 text-slate-900 shadow"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-sky-50 rounded-2xl px-5 py-4 flex items-center gap-2 shadow">
                        <Loader size={16} className="animate-spin" />
                        <span className="text-sm text-slate-600">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="px-10 pb-8">
                <div className="flex items-center gap-3 bg-sky-50 rounded-full px-6 py-3 shadow-inner">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your vibe (e.g. 'Cyberpunk Tokyo weekend')"
                    className="flex-1 bg-transparent outline-none text-sm"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* RIGHT PANEL with tabs */}
          <aside>
            <div className="h-[570px] rounded-[32px] bg-white shadow-2xl border border-slate-100 flex flex-col relative">
              {/* Tabs */}
              <div className="px-11 pt-6 flex justify-between">
                <div className="flex gap-2 text-s font-semibold">
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`px-5 py-1.5 rounded-full border transition-all duration-200 ${
                      activeTab === "itinerary"
                        ? "bg-slate-900 text-white border-sky-500"
                        : "bg-white text-slate-800 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                    }`}
                  >
                    Suggestions
                  </button>
                  <button
                    onClick={() => setActiveTab("places")}
                    className={`px-4 py-1.5 rounded-full border transition-all duration-200 ${
                      activeTab === "places"
                        ? "bg-slate-900 text-white border-sky-500"
                        : "bg-white text-slate-600 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                    }`}
                  >
                    Places
                  </button>
                  <button
                    onClick={() => setActiveTab("nearby")}
                    className={`px-4 py-1.5 rounded-full border transition-all duration-200 ${
                      activeTab === "nearby"
                        ? "bg-slate-900 text-white border-sky-500"
                        : "bg-white text-slate-600 border-sky-200 hover:bg-sky-100 hover:border-sky-400"
                    }`}
                  >
                    Explore Nearby
                  </button>
                </div>
              </div>

              {/* Suggestions Tab (replaces Live Itinerary) */}
              <AnimatePresence mode="wait">
                {activeTab === "itinerary" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute top-[70px] left-1/2 -translate-x-1/2 w-[85%] z-20"
                  >
                    <div className="rounded-3xl bg-white shadow-2xl px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto no-scrollbar">
                      {suggestions.length > 0 ? (
                        suggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl border bg-slate-50 px-4 py-3 space-y-2 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-semibold text-sm">{suggestion.title}</div>
                                <div className="text-xs text-slate-500">
                                  {suggestion.locations?.join(" → ")}
                                </div>
                              </div>
                              <MapPin size={14} className="text-sky-500 flex-shrink-0" />
                            </div>
                            <div className="text-xs text-slate-600">{suggestion.description}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock size={12} />
                              {suggestion.duration} days
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full mt-2 text-xs"
                              onClick={() => handleCreateTrip(suggestion)}
                            >
                              Create Trip
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-slate-500">
                            Chat with AI to get trip suggestions
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Places Tab (static from second design) */}
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
                        <p className="text-sm font-semibold">Places from this plan</p>
                        <p className="text-xs text-sky-700 font-semibold">
                          As planned · Day {currentPlace?.id}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setPlaceIndex((i) => Math.max(i - 1, 0))}
                          disabled={placeIndex === 0}
                          className="absolute left-[-50px] top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-sky-600 flex items-center justify-center shadow-md hover:bg-sky-700 disabled:opacity-90"
                        >
                          <ChevronLeft size={20} className="text-white" />
                        </button>
                        <button
                          onClick={() => setPlaceIndex((i) => Math.min(i + 1, places.length - 1))}
                          disabled={placeIndex === places.length - 1}
                          className="absolute right-[-50px] top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-sky-600 flex items-center justify-center shadow-md hover:bg-sky-700 disabled:opacity-40"
                        >
                          <ChevronRight size={20} className="text-white" />
                        </button>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedPlace?.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative mb-3"
                          >
                            <img
                              src={selectedPlace?.img}
                              alt={selectedPlace?.name}
                              className="h-[160px] w-full object-cover rounded-2xl"
                            />
                            <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                              <p className="text-sm font-semibold text-white">{selectedPlace?.name}</p>
                              <p className="text-xs text-white/80">{selectedPlace?.desc}</p>
                            </div>
                          </motion.div>
                        </AnimatePresence>
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
                                <img src={p.img} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                                <div className="text-left">
                                  <p className="text-xs font-semibold text-slate-800">{p.name}</p>
                                  <p className="text-[11px] text-slate-500">{p.desc}</p>
                                </div>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Explore Nearby Tab (static from second design) */}
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
                      <div className="flex justify-between mb-3">
                        <p className="text-sm font-semibold">Explore nearby</p>
                        <p className="text-xs text-sky-700 font-semibold">
                          Optional · Day {currentPlace?.id}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setPlaceIndex((i) => Math.max(i - 1, 0))}
                          disabled={placeIndex === 0}
                          className="absolute left-[-50px] top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-sky-600 flex items-center justify-center shadow-md hover:bg-sky-700 disabled:opacity-90"
                        >
                          <ChevronLeft size={20} className="text-white" />
                        </button>
                        <button
                          onClick={() => setPlaceIndex((i) => Math.min(i + 1, places.length - 1))}
                          disabled={placeIndex === places.length - 1}
                          className="absolute right-[-50px] top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-sky-600 flex items-center justify-center shadow-md hover:bg-sky-700 disabled:opacity-40"
                        >
                          <ChevronRight size={20} className="text-white" />
                        </button>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeNearbyId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative mb-3"
                          >
                            <img
                              src={currentNearby?.img}
                              alt={currentNearby?.name}
                              className="h-[160px] w-full object-cover rounded-2xl"
                            />
                            <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                              <p className="text-sm font-semibold text-white">{currentNearby?.name}</p>
                              <p className="text-xs text-white/80">{currentNearby?.desc}</p>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                        <div className="mt-4 space-y-2 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
                          {nearbyPlaces
                            .filter((p) => p.id !== activeNearbyId)
                            .slice(0, 4)
                            .map((p) => (
                              <motion.button
                                key={p.id}
                                onClick={() => setActiveNearbyId(p.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition"
                              >
                                <img src={p.img} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                                <div className="text-left">
                                  <p className="text-xs font-semibold text-slate-800">{p.name}</p>
                                  <p className="text-[11px] text-slate-500">{p.desc}</p>
                                </div>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom fade */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-white rounded-b-[32px]" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}