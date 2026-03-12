"use client";
// src/pages/Planner.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapContainer, TileLayer, Marker, Popup, Polyline, useMap,
} from "react-leaflet";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Search, Plane, Hotel, Utensils, Camera, MapPin, Plus,
  ChevronDown, Trash2, Navigation, Clock, Star, ArrowLeft,
  Calendar, DollarSign, Sparkles, Loader2, X, Globe, Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTrip } from "../../../app/providers/TripProvider";
import { useUser } from "../../../app/providers/UserProvider";

// ─── Fix Leaflet icons ────────────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Image helpers — no API key needed ───────────────────────────────────────
function placeImg(name, city) {
  const q = encodeURIComponent(`${name} ${city}`);
  return `https://source.unsplash.com/800x500/?${q}`;
}

// ─── Free API helpers ─────────────────────────────────────────────────────────
const OTM_KEY = "5ae2e3f221c38a28845f05b66eb3b62a21b5b37d8ed3d2b3bf5a5bfd";

async function geocodeCity(city) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en", "User-Agent": "Travixo/1.0" } }
    );
    const data = await res.json();
    if (!data[0]) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch { return null; }
}

async function fetchPlacesForCity(city) {
  const geo = await geocodeCity(city);

  if (geo) {
    try {
      const res = await fetch(
        `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${geo.lon}&lat=${geo.lat}&kinds=interesting_places,cultural,natural,architecture,museums&limit=20&format=json&apikey=${OTM_KEY}`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data
          .filter(p => p.name && p.name.trim() !== "")
          .slice(0, 15)
          .map((p, i) => ({
            id: p.xid || `otm-${i}`,
            name: p.name,
            type: "activity",
            rating: (3.8 + Math.random() * 1.2).toFixed(1),
            img: placeImg(p.name, city),
            coords: [parseFloat(p.point.lat), parseFloat(p.point.lon)],
            category: (p.kinds || "attraction").split(",")[0].replace(/_/g, " "),
            cost: ["Free","$10–$25","$15–$35","$5–$20"][i % 4],
            duration: ["1–2h","2–3h","30 min","Half day"][i % 4],
            bestTime: ["Morning","Afternoon","Evening","Anytime"][i % 4],
            tags: (p.kinds || "").split(",").slice(0, 3).map(k => k.replace(/_/g, " ")),
            desc: `Explore ${p.name} — a ${(p.kinds||"attraction").split(",")[0].replace(/_/g," ")} in ${city}.`,
          }));
      }
    } catch { /* fall through */ }
  }

  // Fallback: generated list
  return Array.from({ length: 9 }, (_, i) => {
    const names = [`${city} Old Town`,`${city} Museum`,`${city} Market`,`${city} Cathedral`,`${city} Park`,`${city} Waterfront`,`${city} Art Gallery`,`${city} Castle`,`${city} Night Market`];
    return {
      id: `fb-${i}`,
      name: names[i],
      type: "activity",
      rating: (4.0 + Math.random() * 0.9).toFixed(1),
      img: placeImg(names[i], city),
      coords: geo ? [geo.lat + (Math.random()-0.5)*0.05, geo.lon + (Math.random()-0.5)*0.05] : null,
      category: ["Landmark","Museum","Market","Heritage","Nature","Food"][i % 6],
      cost: ["Free","$10–$20","$15–$30","$5–$15"][i % 4],
      duration: ["1–2h","2–3h","30 min","Half day"][i % 4],
      bestTime: ["Morning","Afternoon","Evening","Anytime"][i % 4],
      tags: [city, "Attraction"],
      desc: `Discover ${names[i]}, a highlight of ${city}.`,
    };
  });
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DAY_COLORS = ["#0ea5e9","#8b5cf6","#f97316","#10b981","#f59e0b","#ec4899","#06b6d4","#84cc16"];
const getItemIcon = t => ({ flight:Plane, stay:Hotel, food:Utensils, activity:Camera }[t] || MapPin);
const getTypeColor = t => ({ flight:"#3b82f6", stay:"#8b5cf6", food:"#f97316", activity:"#10b981" }[t] || "#64748b");
const createCustomIcon = (n, color) => L.divIcon({
  className: "",
  html: `<div style="background:${color};width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);color:white;font-weight:900;font-size:11px;">${n}</div>`,
  iconSize:[30,30], iconAnchor:[15,15],
});

// ─── Map controller — flies to selected place & fits bounds ──────────────────
function MapController({ markers, flyTo }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) map.flyTo(flyTo, 15, { duration: 1.2 });
  }, [flyTo, map]);
  useEffect(() => {
    const valid = markers.filter(m => m.coords);
    if (valid.length === 0) return;
    if (valid.length === 1) { map.flyTo(valid[0].coords, 13, { duration: 1 }); return; }
    const bounds = L.latLngBounds(valid.map(m => m.coords));
    if (bounds.isValid()) map.fitBounds(bounds, { padding:[70,70], maxZoom:14, duration:1 });
  }, [markers.length]);
  return null;
}

// ─── Safe image with fallback ─────────────────────────────────────────────────
function SafeImg({ src, alt, className, city = "travel" }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? `https://source.unsplash.com/800x500/?${encodeURIComponent(city)},travel` : src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
    />
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ navigate }) {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center max-w-sm px-6">
        <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-2xl mx-auto mb-6">
          <Globe size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">No trip yet</h1>
        <p className="text-slate-500 mb-7 leading-relaxed">Generate your first itinerary and it'll appear here, fully personalized.</p>
        <button onClick={() => navigate("/home")}
          className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-bold shadow-xl">
          <Sparkles size={17} /> Plan Your Trip
        </button>
      </motion.div>
    </div>
  );
}

// ─── Explore card ─────────────────────────────────────────────────────────────
function ExploreCard({ place, onAdd, onClick, idx }) {
  return (
    <motion.div
      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: Math.min(idx*0.04, 0.35) }}
      onClick={() => onClick(place)}
      className="group bg-white rounded-[18px] p-2.5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all border border-slate-100 cursor-pointer"
    >
      <div className="relative h-26 rounded-xl overflow-hidden mb-2 bg-slate-100" style={{ height: "100px" }}>
        <SafeImg src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" city={place.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-1.5 right-1.5 bg-white/90 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5">
          <Star size={8} className="text-amber-500 fill-amber-500" /> {place.rating}
        </div>
        <div className="absolute bottom-1.5 left-1.5 bg-black/50 px-1.5 py-0.5 rounded text-white text-[9px] font-bold capitalize">{place.category}</div>
      </div>
      <div className="flex items-start gap-2 px-0.5">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-xs truncate group-hover:text-sky-600 transition-colors">{place.name}</p>
          <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{place.desc}</p>
        </div>
        <button className="shrink-0 w-6 h-6 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all"
          onClick={e => { e.stopPropagation(); onAdd(place); }}>
          <Plus size={13} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Planner() {
  const { tripId } = useParams();
  const router = useRouter();
  const { trips, setActiveTrip, activeTripId, addItemToTrip, removeItemFromTrip } = useTrip();

  const trip = trips.find(t => t.id === tripId) || trips[0];

  const [selectedDayId, setSelectedDayId] = useState("all");
  const [collapsedDays, setCollapsedDays]  = useState({});
  const [selectedPlace, setSelectedPlace]  = useState(null);
  const [mapFlyTo, setMapFlyTo]            = useState(null);

  // Explore
  const [searchInput, setSearchInput]     = useState("");
  const [activeCity, setActiveCity]       = useState("");
  const [exploreData, setExploreData]     = useState([]);
  const [exploreLoading, setExploreLoading] = useState(false);

  // Add modal
  const [addModal, setAddModal] = useState({ open:false, place:null });
  const [addDayIdx, setAddDayIdx] = useState(0);

  // Weather
  const [weather, setWeather] = useState(null);

  async function loadExplore(city) {
    if (!city?.trim()) return;
    setExploreLoading(true);
    const results = await fetchPlacesForCity(city.trim());
    setExploreData(results);
    setExploreLoading(false);
  }

  async function loadWeather(city) {
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      const data = await res.json();
      const w = data.current_condition?.[0];
      if (w) setWeather({ temp: w.temp_C, desc: w.weatherDesc?.[0]?.value || "" });
    } catch { /* silent */ }
  }

  useEffect(() => {
    if (trip?.locations?.[0]) {
      const city = trip.locations[0];
      setSearchInput(city);
      setActiveCity(city);
      loadExplore(city);
      loadWeather(city);
    }
  }, [trip?.id]);

  const handleSearch = useCallback(() => {
    const city = searchInput.trim();
    if (!city) return;
    setActiveCity(city);
    loadExplore(city);
  }, [searchInput]);

  const handleSelectPlace = (item) => {
    setSelectedPlace(item);
    if (item?.coords) setMapFlyTo([...item.coords]); // new array ref triggers effect
  };

  if (!trip) return <EmptyState navigate={(path) => router.push(path)} />;
  if (activeTripId !== trip.id) setActiveTrip(trip.id);

  // Build days
  const dayOrder = trip.itinerary.map((_, i) => `day-${i}`);
  const days = trip.itinerary.reduce((acc, day, i) => {
    const id = `day-${i}`;
    acc[id] = {
      id, color: DAY_COLORS[i % DAY_COLORS.length],
      title: day.label || `Day ${i+1}`,
      date:  day.date  || `Day ${i+1}`,
      destination: day.destination || trip.locations?.[0] || "",
      items: (day.items || []).map((item, j) => ({
        ...item,
        id: item.id || `${id}-${j}`,
        img: item.img || placeImg(item.title || "travel", day.destination || trip.locations?.[0] || "travel"),
        category: item.category || item.type || "Activity",
        cost: item.cost || "N/A",
        duration: item.duration || "1–2h",
        bestTime: item.bestTime || "Anytime",
        tags: item.tags || [],
        desc: item.desc || item.meta || "",
      })),
    };
    return acc;
  }, {});

  const visibleDays = selectedDayId === "all" ? dayOrder : [selectedDayId];

  const mapMarkers = [];
  const mapPolylines = [];
  visibleDays.forEach(dayId => {
    const day = days[dayId];
    if (!day) return;
    const coords = [];
    day.items.forEach((item, idx) => {
      if (item.coords) {
        mapMarkers.push({ ...item, dayColor: day.color, number: idx+1, dayId });
        coords.push(item.coords);
      }
    });
    if (coords.length > 1) mapPolylines.push({ coords, color: day.color, dayId });
  });

  const defaultCenter = mapMarkers[0]?.coords || [20, 0];

  const handleAddPlace = (place) => {
    addItemToTrip(trip.id, addDayIdx, {
      type: place.type || "activity",
      time: "Custom",
      title: place.name,
      meta: place.desc,
      location: place.name,
      coords: place.coords,
      img: place.img,
      category: place.category,
      cost: place.cost,
      duration: place.duration,
      bestTime: place.bestTime,
      tags: place.tags,
      desc: place.desc,
    });
    setAddModal({ open: false, place: null });
    if (place.coords) setMapFlyTo([...place.coords]);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-100 via-sky-50/30 to-indigo-50/20 grid grid-cols-[390px_1fr_350px] gap-3 p-3 overflow-hidden">
      <DragDropContext onDragEnd={() => {}}>

        {/* ── LEFT: ITINERARY ───────────────────────────────────── */}
        <motion.div initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}
          className="bg-white rounded-[22px] shadow-lg flex flex-col overflow-hidden border border-slate-100">

          <div className="px-4 pt-4 pb-3 shrink-0 border-b border-slate-100">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-black text-slate-900 truncate">{trip.title}</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{trip.dates}</p>
              </div>
              {weather && (
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-slate-700">{weather.temp}°C</p>
                  <p className="text-[9px] text-slate-400">{weather.desc}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {trip.budget?.total && (
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
                  <DollarSign size={8}/> ${trip.budget.total.toLocaleString()}
                </span>
              )}
              {trip.vibeTag && (
                <span className="text-[9px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">{trip.vibeTag}</span>
              )}
              {trip.locations?.map(loc => (
                <span key={loc} className="text-[9px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 flex items-center gap-0.5">
                  <MapPin size={7}/>{loc}
                </span>
              ))}
            </div>
          </div>

          {/* Day pills */}
          <div className="px-3 py-2 shrink-0">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
              <button onClick={() => setSelectedDayId("all")}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${selectedDayId==="all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}>
                All
              </button>
              {dayOrder.map(dayId => {
                const day = days[dayId]; const active = selectedDayId === dayId;
                return (
                  <button key={dayId} onClick={() => setSelectedDayId(dayId)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${active ? "text-white border-transparent" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
                    style={active ? { backgroundColor: day.color } : {}}>
                    {day.date}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 no-scrollbar space-y-2">
            {visibleDays.map(dayId => {
              const day = days[dayId]; if (!day) return null;
              const collapsed = collapsedDays[dayId];
              return (
                <div key={dayId} className="bg-slate-50/80 rounded-[16px] overflow-hidden border border-slate-100">
                  <div onClick={() => setCollapsedDays(p => ({...p, [dayId]: !p[dayId]}))}
                    className="flex items-center gap-2 p-2.5 cursor-pointer hover:bg-white/60 transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0"
                      style={{ backgroundColor: day.color }}>{dayOrder.indexOf(dayId)+1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-[11px] truncate">{day.title}</p>
                      <p className="text-[9px] text-slate-400">{day.date} · {day.items.length} stops</p>
                    </div>
                    <ChevronDown size={12} className={`text-slate-400 shrink-0 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div initial={{ height:0 }} animate={{ height:"auto" }} exit={{ height:0 }} className="overflow-hidden">
                        <Droppable droppableId={dayId}>
                          {(provided, snap) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}
                              className={`px-2 pb-2 space-y-1.5 min-h-[32px] ${snap.isDraggingOver ? "bg-sky-50/50 rounded-xl" : ""}`}>
                              {day.items.map((item, index) => {
                                const tc = getTypeColor(item.type);
                                return (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(prov, isDragging) => (
                                      <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                                        style={{ ...prov.draggableProps.style }}
                                        onClick={() => handleSelectPlace(item)}
                                        className={`group flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer ${isDragging.isDragging ? "rotate-1 scale-105 shadow-xl ring-2 ring-sky-400 z-50":""}  ${selectedPlace?.id===item.id ? "ring-2 ring-sky-400":""}`}>
                                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                                          <SafeImg src={item.img} alt={item.title} className="w-full h-full object-cover" city={item.location || item.title} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-slate-800 text-[10px] truncate">{item.title}</p>
                                          <div className="flex gap-1 mt-0.5">
                                            <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background:`${tc}18`, color:tc }}>{item.time||"TBD"}</span>
                                            {item.cost && item.cost !== "N/A" && (
                                              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">{item.cost}</span>
                                            )}
                                          </div>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full text-slate-300 hover:text-rose-500 self-center shrink-0 transition-all"
                                          onClick={e => { e.stopPropagation(); removeItemFromTrip?.(trip.id, dayOrder.indexOf(dayId), item.id); }}>
                                          <Trash2 size={10} />
                                        </button>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                              {day.items.length === 0 && (
                                <div className="flex items-center justify-center py-3 border-2 border-dashed border-slate-200 rounded-xl">
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Drop activities here</p>
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
          </div>
        </motion.div>

        {/* ── CENTER: MAP / DETAIL ──────────────────────────────── */}
        <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.4, delay:0.1 }}
          className="rounded-[26px] shadow-xl overflow-hidden flex flex-col bg-white border border-slate-100">
          <AnimatePresence mode="wait">
            {selectedPlace ? (
              <motion.div key="detail" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="h-full flex flex-col">
                <div className="relative shrink-0" style={{ height: "40%" }}>
                  <SafeImg src={selectedPlace.img} alt={selectedPlace.title} className="w-full h-full object-cover" city={selectedPlace.location || selectedPlace.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <button onClick={() => setSelectedPlace(null)}
                    className="absolute top-4 left-4 bg-white/90 hover:bg-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <ArrowLeft size={12} /> Back
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="px-2 py-0.5 bg-white/20 border border-white/30 text-white text-[9px] font-bold rounded uppercase tracking-wider mb-2 inline-block">
                      {selectedPlace.category||"Place"}
                    </span>
                    <h1 className="text-2xl font-black text-white leading-tight">{selectedPlace.title}</h1>
                    {(selectedPlace.location||selectedPlace.meta) && (
                      <p className="text-white/75 text-xs mt-1 flex items-center gap-1">
                        <MapPin size={10} className="text-sky-300"/>{selectedPlace.location||selectedPlace.meta}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon:DollarSign, label:"Cost",      val:selectedPlace.cost||"Free",    bg:"bg-emerald-50", color:"text-emerald-600" },
                      { icon:Clock,      label:"Duration",  val:selectedPlace.duration||"1–2h", bg:"bg-sky-50",     color:"text-sky-600" },
                      { icon:Calendar,   label:"Best Time", val:selectedPlace.bestTime||"Anytime", bg:"bg-amber-50", color:"text-amber-600" },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center`}>
                        <s.icon size={13} className={`${s.color} mx-auto mb-1`}/>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">{s.label}</p>
                        <p className="text-[11px] font-black text-slate-800 mt-0.5">{s.val}</p>
                      </div>
                    ))}
                  </div>
                  {selectedPlace.desc && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3">{selectedPlace.desc}</p>
                  )}
                  {selectedPlace.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPlace.tags.map((t,i)=>(
                        <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-full text-[9px] font-semibold capitalize">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    {selectedPlace.coords && (
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.coords[0]},${selectedPlace.coords[1]}`}
                        target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                        <Navigation size={12}/> Directions
                      </a>
                    )}
                    <button onClick={() => { setAddModal({open:true, place:selectedPlace}); setAddDayIdx(0); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-sky-500 text-white rounded-xl text-xs font-bold hover:bg-sky-600 transition-colors">
                      <Plus size={12}/> Add to Trip
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="map" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="h-full flex flex-col">
                <div className="flex-1 relative">
                  <MapContainer center={defaultCenter} zoom={defaultCenter[0]===20?2:12}
                    className="w-full h-full" zoomControl={false} key={trip.id}>
                    <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"/>
                    {mapPolylines.map((r,i) => (
                      <Polyline key={`p${i}`} positions={r.coords} pathOptions={{ color:r.color, opacity:0.7, weight:3, dashArray:"1,8" }}/>
                    ))}
                    {mapMarkers.map(m => (
                      <Marker key={`${m.dayId}-${m.id}`} position={m.coords}
                        icon={createCustomIcon(m.number, m.dayColor)}
                        eventHandlers={{ click: () => handleSelectPlace(m) }}>
                        <Popup>
                          <p className="text-xs font-bold">{m.title}</p>
                          <p className="text-[10px] text-slate-500">{m.time} · {m.cost}</p>
                        </Popup>
                      </Marker>
                    ))}
                    <MapController markers={mapMarkers} flyTo={mapFlyTo}/>
                  </MapContainer>
                  <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
                    {["＋","－"].map((s,i)=>(
                      <button key={i} className="w-8 h-8 bg-white rounded-lg shadow-md text-slate-600 font-bold text-sm flex items-center justify-center hover:bg-slate-50 border border-slate-100 active:scale-95 transition">{s}</button>
                    ))}
                  </div>
                  {mapMarkers.length===0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-[300] pointer-events-none">
                      <div className="text-center">
                        <MapPin size={24} className="text-slate-300 mx-auto mb-1.5"/>
                        <p className="text-xs text-slate-400 font-semibold">Add places to see them on the map</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white/90 p-3 border-t border-slate-100 shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-800 text-sm truncate max-w-[180px]">{trip.title}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{trip.itinerary.length} days · {mapMarkers.length} pinned</p>
                    </div>
                    <div className="flex gap-1.5">
                      {[["Stops",mapMarkers.length],["Days",trip.itinerary.length]].map(([l,v])=>(
                        <div key={l} className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                          <p className="text-[8px] font-bold text-slate-400 uppercase">{l}</p>
                          <p className="text-sm font-black text-slate-800">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── RIGHT: EXPLORE ────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, x:18 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4, delay:0.15 }}
          className="bg-white rounded-[22px] shadow-lg flex flex-col overflow-hidden border border-slate-100">

          <div className="px-4 pt-4 pb-3 shrink-0 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900 mb-3">Explore</h2>
            {/* Search bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && handleSearch()}
                  placeholder="Search a city…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-medium outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                />
              </div>
              <button onClick={handleSearch}
                className="px-3 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold hover:bg-sky-600 transition-colors shrink-0">
                Go
              </button>
            </div>
            {/* Quick city picks from trip */}
            {trip.locations?.length > 0 && (
              <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-hide pb-0.5">
                {trip.locations.map(city => (
                  <button key={city}
                    onClick={() => { setSearchInput(city); setActiveCity(city); loadExplore(city); }}
                    className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-[9px] font-bold border transition-colors ${activeCity===city ? "bg-sky-500 text-white border-sky-500" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-sky-300"}`}>
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3 no-scrollbar">
            {exploreLoading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 mt-4">
                <Loader2 size={24} className="animate-spin text-sky-500"/>
                <p className="text-xs text-slate-400 font-semibold">Finding places in {activeCity}…</p>
              </div>
            ) : exploreData.length===0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 mt-4">
                <Globe size={24} className="text-slate-300"/>
                <p className="text-xs text-slate-400 font-semibold text-center">No places found.<br/>Try another city.</p>
              </div>
            ) : (
              <div className="space-y-2 pt-3">
                {exploreData.map((place, idx) => (
                  <ExploreCard key={place.id} place={place} idx={idx}
                    onClick={handleSelectPlace}
                    onAdd={p => { setAddModal({open:true,place:p}); setAddDayIdx(0); }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </DragDropContext>

      {/* ── ADD TO DAY MODAL ──────────────────────────────────────── */}
      <AnimatePresence>
        {addModal.open && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.45)", backdropFilter:"blur(8px)" }}
            onClick={e => e.target===e.currentTarget && setAddModal({open:false,place:null})}>
            <motion.div initial={{ scale:0.9, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:16 }}
              className="bg-white rounded-[22px] p-5 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-800">Add to which day?</h3>
                <button onClick={() => setAddModal({open:false,place:null})}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                  <X size={13}/>
                </button>
              </div>
              {addModal.place && (
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5 mb-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                    <SafeImg src={addModal.place.img} alt={addModal.place.name} className="w-full h-full object-cover" city={addModal.place.name}/>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{addModal.place.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{addModal.place.category}</p>
                  </div>
                </div>
              )}
              <div className="space-y-1.5 max-h-44 overflow-y-auto mb-4 no-scrollbar">
                {dayOrder.map((dayId, idx) => {
                  const day = days[dayId];
                  return (
                    <button key={dayId} onClick={() => setAddDayIdx(idx)}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left border-2 transition-all ${addDayIdx===idx ? "border-sky-400 bg-sky-50" : "border-slate-100 hover:border-slate-200"}`}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0" style={{ backgroundColor:day.color }}>{idx+1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{day.title}</p>
                        <p className="text-[9px] text-slate-400">{day.items.length} stops</p>
                      </div>
                      {addDayIdx===idx && <Check size={12} className="text-sky-500 shrink-0" strokeWidth={3}/>}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => addModal.place && handleAddPlace(addModal.place)}
                className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:opacity-95 transition-opacity">
                Add to Day {addDayIdx+1}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}