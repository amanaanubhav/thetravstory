"use client";
// src/pages/Explore.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Bookmark, MessageCircle, Grid, Check } from "lucide-react";

import Card from "../../../shared/ui/Card";
import Button from "../../../shared/ui/Button";
import { mockFeed } from "../../../shared/mocks/mockFeed";
import { useTrip } from "../../../app/providers/TripProvider";
import { Search, MapPin, Heart as HeartIcon, Play, Plus, SlidersHorizontal } from "lucide-react";

/* ------------------------------------------------------------------ */
/* FILTER RAIL (adapted from new UI) */
/* ------------------------------------------------------------------ */
function ExploreFilters({ selectedLocation, setSelectedLocation, selectedType, setSelectedType }) {
  const locations = ["All places", "Japan", "France"];
  const types = ["All types", "Café", "Hotel", "Hidden gem", "City"];
  const [onMyRoute, setOnMyRoute] = useState(false); // kept for visual, not used in logic

  return (
    <div className="fixed left-46 top-1/2 -translate-y-1/2 z-30 mt-15">
      {/* Back card */}
      <div className="absolute -inset-x-4 -inset-y-6 rounded-[28px] bg-white backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.18)]" />

      {/* Filter content */}
      <div className="relative flex flex-col gap-5 px-4 py-8">
        {/* Location group */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Location</span>
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className="flex items-center gap-3 text-[15px] font-medium text-gray-500 hover:text-sky-600 transition w-full"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  selectedLocation === loc
                    ? "bg-sky-600 border-sky-600 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedLocation === loc && <Check size={14} strokeWidth={3} />}
              </div>
              <span className={selectedLocation === loc ? "text-sky-600" : ""}>{loc}</span>
            </button>
          ))}
        </div>

        {/* Type group */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Type</span>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className="flex items-center gap-3 text-[15px] font-medium text-gray-500 hover:text-sky-600 transition w-full"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  selectedType === type
                    ? "bg-sky-600 border-sky-600 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedType === type && <Check size={14} strokeWidth={3} />}
              </div>
              <span className={selectedType === type ? "text-sky-600" : ""}>{type}</span>
            </button>
          ))}
        </div>

        {/* On My Route toggle (visual only) */}
        <div className="flex items-center justify-between gap-4 text-[16px] font-medium text-gray-600 pt-2">
          <span>On My Route</span>
          <button
            onClick={() => setOnMyRoute(!onMyRoute)}
            className={`relative w-11 h-6 rounded-full transition ${
              onMyRoute ? "bg-sky-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                onMyRoute ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RIGHT ACTION BUTTON (from new UI) */
/* ------------------------------------------------------------------ */
function Action({ icon, label, onClick }) {
  return (
    <div
      className="flex items-center gap-3 text-gray-600 hover:text-gray-900 cursor-pointer transition"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
        {icon}
      </div>
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN EXPLORE COMPONENT */
/* ------------------------------------------------------------------ */
export default function Explore() {
  const { activeTrip } = useTrip();
  const [selectedLocation, setSelectedLocation] = useState("All places");
  const [selectedType, setSelectedType] = useState("All types");
  const [likedStates, setLikedStates] = useState({}); // track liked items

  // Filter mockFeed based on selection
  const filtered = mockFeed.exploreReels.filter((item) => {
    const locationOk =
      selectedLocation === "All places" || item.locationTag === selectedLocation;
    const typeOk =
      selectedType === "All types" ||
      item.type.toLowerCase() === selectedType.toLowerCase();
    return locationOk && typeOk;
  });

  // Refs for each reel to enable thumbnail scrolling
  const reelRefs = useRef([]);
  useEffect(() => {
    reelRefs.current = reelRefs.current.slice(0, filtered.length);
  }, [filtered]);

  const scrollToReel = (index) => {
    reelRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLike = (reelId) => {
    setLikedStates((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const handleAddToTrip = (reel) => {
    if (!activeTrip) {
      alert("Please start a trip first");
      return;
    }
    alert(`Added "${reel.caption}" to your trip!`);
  };

  // Generate a consistent image URL based on id (using Picsum with seed)
  const getImageUrl = (id, width = 360, height = 560) =>
    `https://picsum.photos/seed/${id}/${width}/${height}`;

  return (
    <div className="min-h-screen w-full">
      <div className="relative w-full min-h-screen px-24">
        {/* LEFT FILTERS */}
        <ExploreFilters
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        {/* MAIN FLOATING CARD */}
        <div
          className="
            relative
            mx-auto
            max-w-[1200px]
            translate-x-[45px]
            translate-y-[-5px]
            bg-white/70
            backdrop-blur-xl
            rounded-[44px]
            shadow-[0_40px_120px_rgba(0,0,0,0.18)]
            px-20
            py-8
          "
        >
          <div className="flex items-start justify-center gap-16">
            {/* LEFT MINI THUMBNAILS (from filtered list) */}
            <div className="flex flex-col items-center pt-18 text-gray-400">
              <span className="text-xs mb-4">Swipe / scroll</span>
              {filtered.map((reel, i) => (
                <div key={reel.id} className="flex flex-col items-center">
                  <div
                    className="relative cursor-pointer"
                    onClick={() => scrollToReel(i)}
                  >
                    <div className="absolute -inset-1 rounded-[14px] bg-white/60 shadow" />
                    <div className="relative w-12 h-14 rounded-xl overflow-hidden">
                      <img
                        src={getImageUrl(reel.id, 48, 56)}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {i !== filtered.length - 1 && (
                    <div className="flex flex-col gap-1 py-2">
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CENTER REEL CAROUSEL */}
            <div className="relative -mt-2">
              <div className="absolute -inset-3 rounded-[40px] bg-white/60 shadow" />

              {/* SCROLL CONTAINER */}
              <div
                className="
                  relative
                  w-[360px]
                  h-[560px]
                  overflow-y-scroll
                  overflow-x-hidden
                  snap-y
                  snap-mandatory
                  no-scrollbar
                  scroll-smooth
                  overscroll-contain
                "
              >
                {filtered.map((reel, index) => (
                  <motion.div
                    key={reel.id}
                    ref={(el) => (reelRefs.current[index] = el)}
                    className="
                      snap-start
                      snap-always
                      relative
                      w-full
                      h-[560px]
                      rounded-[32px]
                      overflow-hidden
                      shadow-[0_30px_80px_rgba(0,0,0,0.25)]
                    "
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* IMAGE */}
                    <img
                      src={getImageUrl(reel.id)}
                      alt={reel.location}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* GRADIENT */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* LOCATION */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs">
                      {reel.location}
                    </div>

                    {/* INDEX */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white rounded-full text-xs">
                      {index + 1} / {filtered.length}
                    </div>

                    {/* CAPTION */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-xs opacity-80">@{reel.handle}</p>
                      <p className="text-sm">{reel.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex flex-col gap-6 mt-40">
              <Action
                icon={<Heart size={18} />}
                label={filtered.reduce((sum, reel) => sum + (likedStates[reel.id] ? 1 : 0), 0).toString() + "k" || "12.4k"}
                onClick={() => {
                  // Like the currently visible reel (simplified: like the first one)
                  if (filtered[0]) handleLike(filtered[0].id);
                }}
              />
              <Action icon={<Bookmark size={18} />} label="84" />
              <Action
                icon={<MessageCircle size={18} />}
                label="Save to trip"
                onClick={() => {
                  // Save the currently visible reel (simplified: use first)
                  if (filtered[0]) handleAddToTrip(filtered[0]);
                }}
              />
              <Action icon={<Grid size={18} />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}