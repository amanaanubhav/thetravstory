// src/pages/Bookings.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/common/Card";
import { Plane, Hotel, Car, Calendar, Sparkles, Map, ArrowLeft, Star, MapPin, Search, ChevronDown, Clock, Bed } from "lucide-react";

// Mock Data for AI Suggestions
const suggestedTrips = [
    {
        id: 1,
        title: "Paris Getaway",
        date: "10 Oct - 15 Oct",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
        summary: {
            destination: "Paris, France",
            days: 6,
            itinerary: [
                { day: 1, activity: "Arrival & Seine Cruise", status: "AI Suggested" },
                { day: 2, activity: "Louvre Museum Tour", status: "Edited" },
                { day: 3, activity: "Eiffel Tower & Dining", status: "AI Suggested" },
                { day: 4, activity: "Montmartre Art Walk", status: "Manual" },
                { day: 5, activity: "Versailles Day Trip", status: "AI Suggested" },
                { day: 6, activity: "Departure", status: "AI Suggested" },
            ]
        },
        suggestions: {
            flights: [
                { id: 101, airline: "Air France", time: "10:00 AM - 12:30 PM", price: "$450", duration: "2h 30m" },
                { id: 102, airline: "EasyJet", time: "06:00 AM - 08:30 AM", price: "$120", duration: "2h 30m" },
                { id: 105, airline: "Lufthansa", time: "02:00 PM - 04:30 PM", price: "$380", duration: "2h 30m" },
            ],
            hotels: [
                { id: 201, name: "Hotel Eiffel Blomet", rating: 4.8, price: "$320/night", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" },
                { id: 202, name: "Le Marais Boutique", rating: 4.6, price: "$280/night", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop" },
                { id: 205, name: "The Peninsula Paris", rating: 5.0, price: "$950/night", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop" },
            ],
            transport: [
                { id: 301, type: "Private Transfer", detail: "Airport to Hotel", price: "$60" },
                { id: 302, type: "Metro Pass", detail: "5-Day Unlimited", price: "$45" },
            ],
        },
    },
    {
        id: 2,
        title: "Goa Weekend",
        date: "24 Nov - 27 Nov",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop",
        summary: {
            destination: "Goa, India",
            days: 4,
            itinerary: [
                { day: 1, activity: "Beach Sunset & Dinner" },
                { day: 2, activity: "North Goa Forts" },
                { day: 3, activity: "Old Goa Churches" },
                { day: 4, activity: "Departure" },
            ]
        },
        suggestions: {
            flights: [
                { id: 103, airline: "IndiGo", time: "05:00 PM - 06:15 PM", price: "$90", duration: "1h 15m" },
            ],
            hotels: [
                { id: 203, name: "Taj Exotica", rating: 4.9, price: "$450/night", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop" },
            ],
            transport: [
                { id: 303, type: "Self-Drive Car", detail: "Thar Convertible", price: "$60/day" },
            ],
        },
    },
    {
        id: 3,
        title: "Dubai Luxury Trip",
        date: "15 Dec - 20 Dec",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=900&auto=format&fit=crop",
        summary: {
            destination: "Dubai, UAE",
            days: 6,
            itinerary: [
                { day: 1, activity: "Burj Khalifa Top View" },
                { day: 2, activity: "Desert Safari" },
                { day: 3, activity: "Palm Jumeirah" },
                { day: 4, activity: "Dubai Mall Shopping" },
                { day: 5, activity: "Yacht Cruise" },
                { day: 6, activity: "Departure" },
            ]
        },
        suggestions: {
            flights: [
                { id: 104, airline: "Emirates", time: "09:00 PM - 01:00 AM", price: "$850", duration: "4h 00m" },
            ],
            hotels: [
                { id: 204, name: "Atlantis The Royal", rating: 5.0, price: "$1200/night", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop" },
            ],
            transport: [
                { id: 304, type: "Chauffeur", detail: "Rolls Royce Phantom", price: "$300/ride" },
            ],
        },
    },
];

const Bookings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Final Plan");
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [bookedItemIds, setBookedItemIds] = useState([101, 201, 301, 401]); // 401 for Louvre tour confirmed

    const toggleBooking = (id) => {
        setBookedItemIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const tabs = ["Final Plan", "Explore and Book", "Confirmed"];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedTrip(null);
    };

    return (
        <div className="bg-slate-50/50 min-h-full">
            <div className="max-w-[1400px] mx-auto px-10 sm:px-16 lg:px-20 pt-6 pb-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Your Bookings</h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Manage all your flights, hotels, and reservations in one place.
                        </p>
                    </div>

                    {/* Tab Switcher - Minimal Underline */}
                    <div className="flex items-center justify-center space-x-8 border-b border-slate-200 w-full max-w-2xl mx-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`relative pb-3 text-sm font-medium transition-colors duration-300 ${activeTab === tab
                                    ? "text-sky-600"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-t-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === "Confirmed" && (
                        <motion.div
                            key="confirmed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <Card className="mx-14 p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] border-dashed border-2 border-slate-200 bg-sky-50/20 rounded-[32px]">
                                <div className="bg-white p-6 rounded-full shadow-md ring-1 ring-sky-100">
                                    <Plane className="w-12 h-12 text-[#0081C9]" />
                                </div>
                                <div className="max-w-md space-y-2">
                                    <h2 className="text-2xl font-bold text-[#0B1527]">
                                        No upcoming trips
                                    </h2>
                                    <p className="text-slate-500 font-medium">
                                        You haven't booked any trips yet. When you do, they'll appear here
                                        organized by date.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate("/explore")}
                                    className="px-8 py-4 bg-[#0081C9] text-white font-bold rounded-2xl hover:bg-[#0071B8] transition shadow-xl shadow-blue-100 hover:shadow-blue-200 transform active:scale-95 duration-200"
                                >
                                    Start Exploring
                                </button>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: Hotel, color: "sky", label: "Hotels", count: "0 Active" },
                                    { icon: Car, color: "emerald", label: "Transport", count: "0 Active" },
                                    { icon: Calendar, color: "violet", label: "Past Trips", count: "History" },
                                ].map((item, idx) => (
                                    <Card key={idx} className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-transparent hover:border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 bg-${item.color}-50 rounded-2xl group-hover:bg-${item.color}-100 transition-colors duration-300`}>
                                                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">
                                                    {item.label}
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium">{item.count}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "Final Plan" && (
                        <motion.div
                            key="final-plan"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {!selectedTrip ? (
                                <Card className="mx-14 p-8 min-h-[400px] border border-slate-100 shadow-xl bg-white rounded-[32px]">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-sky-500" />
                                            Trips Ready for Processing
                                        </h2>
                                        <p className="text-slate-500 text-sm">Confirm and book your final itineraries</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {suggestedTrips.map((trip) => (
                                            <motion.div
                                                key={trip.id}
                                                whileHover={{ y: -8 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedTrip(trip)}
                                                className="cursor-pointer group h-full"
                                            >
                                                <Card className="overflow-hidden border border-slate-200 hover:border-sky-200 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                                                    <div className="h-48 overflow-hidden relative">
                                                        <img
                                                            src={trip.image}
                                                            alt={trip.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
                                                        <div className="absolute bottom-4 left-4 text-white">
                                                            <h3 className="font-bold text-lg mb-0.5">{trip.title}</h3>
                                                            <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                                                                <Calendar className="w-3 h-3" />
                                                                {trip.date}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 flex-1 bg-white">
                                                        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                                                            <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{trip.suggestions.flights.length} Flights</span>
                                                            <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{trip.suggestions.hotels.length} Hotels</span>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            ) : (
                                <div className="flex flex-col xl:flex-row gap-8 items-start">
                                    {/* LEFT COLUMN: SUGGESTIONS */}
                                    <div className="flex-1 w-full min-w-0 space-y-6">
                                        {/* Header Card */}
                                        {(() => {
                                            const completedCount = [
                                                selectedTrip.suggestions.flights.some(f => bookedItemIds.includes(f.id)),
                                                selectedTrip.suggestions.hotels.some(h => bookedItemIds.includes(h.id)),
                                                selectedTrip.suggestions.transport.some(t => bookedItemIds.includes(t.id)),
                                                bookedItemIds.includes(401)
                                            ].filter(Boolean).length;

                                            return (
                                                <Card className="p-6 rounded-[28px] border border-slate-100 shadow-sm bg-white sticky top-6 z-30">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-5">
                                                            <button
                                                                onClick={() => setSelectedTrip(null)}
                                                                className="p-3 hover:bg-slate-50 border border-slate-200/60 rounded-2xl transition-all group shadow-sm bg-white flex items-center justify-center"
                                                            >
                                                                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                                                            </button>
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-0.5">
                                                                    <h2 className="text-2xl font-black text-[#0B1527] tracking-tight">
                                                                        {selectedTrip.title}
                                                                    </h2>
                                                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">
                                                                        Final Plan
                                                                    </span>
                                                                </div>
                                                                <p className="text-slate-400 text-sm font-medium">{selectedTrip.date} · Build your perfect trip</p>
                                                            </div>
                                                        </div>

                                                        <div className="hidden md:flex flex-col items-end gap-1.5">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-bold text-slate-900">{completedCount} of 4 completed</span>
                                                                <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${(completedCount / 4) * 100}%` }}
                                                                        className="h-full bg-emerald-500 rounded-full"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking Progress</p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })()}

                                        {/* TRAVEL SECTION */}
                                        <Card className="p-7 rounded-[28px] border border-slate-100 shadow-sm bg-white">
                                            <div id="section-travel" className="scroll-mt-24">
                                                <div className="flex items-baseline justify-between mb-6">
                                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <Plane className="w-5 h-5 text-[#0081C9]" />
                                                        Find Your Flight
                                                    </h3>
                                                    <span className="text-xs font-bold text-[#0081C9] bg-sky-50 px-2 py-0.5 rounded-md">Step 1 of 3</span>
                                                </div>
                                                <div className="space-y-4">
                                                    {(() => {
                                                        const confirmed = selectedTrip.suggestions.flights.filter(f => bookedItemIds.includes(f.id));
                                                        const suggestions = selectedTrip.suggestions.flights.filter(f => !bookedItemIds.includes(f.id));

                                                        return (
                                                            <>
                                                                {confirmed.length > 0 && confirmed.map(flight => (
                                                                    <Card key={flight.id} className="p-4 border-emerald-500 bg-emerald-50/20 flex gap-4 items-center">
                                                                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                                            <Plane className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex justify-between items-center">
                                                                                <div>
                                                                                    <p className="text-xs font-bold text-emerald-600 uppercase">Booked Flight</p>
                                                                                    <h4 className="font-bold text-slate-900">{flight.airline} · {flight.time}</h4>
                                                                                </div>
                                                                                <button onClick={() => toggleBooking(flight.id)} className="text-xs font-medium text-slate-400 hover:text-red-500">
                                                                                    Change
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                ))}
                                                                {suggestions.length > 0 && (
                                                                    <div className="space-y-4">
                                                                        {confirmed.length > 0 && (
                                                                            <div className="flex items-center gap-2 px-1">
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Other AI Suggestions</span>
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                            </div>
                                                                        )}
                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            {suggestions.map((flight, idx) => (
                                                                                <div key={flight.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${confirmed.length === 0 && idx === 0 ? 'bg-sky-50/30 border-sky-100 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                                                                    <div className="flex items-center gap-4">
                                                                                        <div className="text-center min-w-[60px]">
                                                                                            <p className="text-sm font-bold text-slate-900">{flight.time.split(' - ')[0]}</p>
                                                                                            <p className="text-[10px] font-medium text-slate-400">Departure</p>
                                                                                        </div>
                                                                                        <div className="h-px w-8 bg-slate-200" />
                                                                                        <div>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <p className="font-bold text-slate-800 text-sm">{flight.airline}</p>
                                                                                                {confirmed.length === 0 && idx === 0 && <span className="bg-sky-100 text-sky-600 text-[9px] font-bold px-1.5 py-0.5 rounded">AI PICK</span>}
                                                                                            </div>
                                                                                            <p className="text-xs text-slate-500">{flight.duration} · Non-stop</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-4">
                                                                                        <p className="font-bold text-slate-900">{flight.price}</p>
                                                                                        <button onClick={() => toggleBooking(flight.id)} className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">
                                                                                            Select
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="pt-2">
                                                                    <button onClick={() => setActiveTab("Explore and Book")} className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold text-sm hover:border-[#0081C9] hover:text-[#0081C9] hover:bg-sky-50/50 transition-all flex items-center justify-center gap-2 mt-2">
                                                                        <Search className="w-4 h-4" />
                                                                        Explore flights on your own
                                                                    </button>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </Card>

                                        {/* STAY & TRANSFER SECTION */}
                                        <Card className="p-7 rounded-[28px] border border-slate-100 shadow-sm bg-white">
                                            {/* STAY SECTION */}
                                            <div id="section-stay" className="scroll-mt-24">
                                                <div className="flex items-baseline justify-between mb-6">
                                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <Bed className="w-5 h-5 text-indigo-500" />
                                                        Pick your stay
                                                    </h3>
                                                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">Step 2 of 3</span>
                                                </div>
                                                <div className="space-y-4">
                                                    {(() => {
                                                        const confirmed = selectedTrip.suggestions.hotels.filter(h => bookedItemIds.includes(h.id));
                                                        const suggestions = selectedTrip.suggestions.hotels.filter(h => !bookedItemIds.includes(h.id));

                                                        return (
                                                            <>
                                                                {confirmed.length > 0 && confirmed.map(hotel => (
                                                                    <Card key={hotel.id} className="p-0 border-emerald-500 bg-emerald-50/20 flex overflow-hidden">
                                                                        <img src={hotel.image} className="w-32 h-24 object-cover" alt="" />
                                                                        <div className="flex-1 p-4">
                                                                            <div className="flex justify-between items-start">
                                                                                <div>
                                                                                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Booked Hotel</p>
                                                                                    <h4 className="font-bold text-slate-900">{hotel.name}</h4>
                                                                                    <p className="text-xs text-slate-500">{hotel.rating} Stars · 4 Nights</p>
                                                                                </div>
                                                                                <button onClick={() => toggleBooking(hotel.id)} className="text-xs font-medium text-slate-400 hover:text-red-500">
                                                                                    Change
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                ))}
                                                                {suggestions.length > 0 && (
                                                                    <div className="space-y-4">
                                                                        {confirmed.length > 0 && (
                                                                            <div className="flex items-center gap-2 px-1">
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Other AI Suggestions</span>
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                            </div>
                                                                        )}
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            {suggestions.map((hotel, idx) => (
                                                                                <div key={hotel.id} className={`p-3 rounded-2xl border transition-all flex gap-4 group ${confirmed.length === 0 && idx === 0 ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                                                    <img src={hotel.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                                                            <h4 className="font-bold text-slate-800 text-sm truncate">{hotel.name}</h4>
                                                                                            {confirmed.length === 0 && idx === 0 && <span className="bg-indigo-100 text-indigo-600 text-[8px] font-bold px-1 py-0.5 rounded shadow-sm">TOP CHOICE</span>}
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-2">
                                                                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                                                            {hotel.rating} · {hotel.price}
                                                                                        </div>
                                                                                        <button onClick={() => toggleBooking(hotel.id)} className="w-full py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">
                                                                                            Select Hotel
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="pt-2">
                                                                    <button onClick={() => setActiveTab("Explore and Book")} className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 mt-2">
                                                                        <Search className="w-4 h-4" />
                                                                        Explore stays on your own
                                                                    </button>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            {/* TRANSFER SECTION */}
                                            <div id="section-transfer" className="scroll-mt-24 mt-8 pt-8 border-t border-slate-100">
                                                <div className="flex items-baseline justify-between mb-6">
                                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <Car className="w-5 h-5 text-emerald-500" />
                                                        Ground Transfer
                                                    </h3>
                                                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Step 3 of 3</span>
                                                </div>
                                                <div className="space-y-4">
                                                    {(() => {
                                                        const confirmed = selectedTrip.suggestions.transport.filter(t => bookedItemIds.includes(t.id));
                                                        const suggestions = selectedTrip.suggestions.transport.filter(t => !bookedItemIds.includes(t.id));

                                                        return (
                                                            <>
                                                                {confirmed.length > 0 && confirmed.map(transport => (
                                                                    <Card key={transport.id} className="p-4 border-emerald-500 bg-emerald-50/20 flex gap-4 items-center">
                                                                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                                            <Car className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex justify-between items-center">
                                                                                <div>
                                                                                    <p className="text-xs font-bold text-emerald-600 uppercase">Confirmed Pick-up</p>
                                                                                    <h4 className="font-bold text-slate-900">{transport.type} · {transport.detail}</h4>
                                                                                </div>
                                                                                <button onClick={() => toggleBooking(transport.id)} className="text-xs font-medium text-slate-400 hover:text-red-500">
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                ))}
                                                                {suggestions.length > 0 && (
                                                                    <div className="space-y-4">
                                                                        {confirmed.length > 0 && (
                                                                            <div className="flex items-center gap-2 px-1">
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Other AI Suggestions</span>
                                                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                                            </div>
                                                                        )}
                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            {suggestions.map((transport, idx) => (
                                                                                <div key={transport.id} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between group">
                                                                                    <div className="flex items-center gap-4">
                                                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                                                                                            <Car className="w-6 h-6" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <h4 className="font-bold text-slate-800 text-sm tracking-tight">{transport.type}</h4>
                                                                                            <p className="text-xs text-slate-400 font-medium">{transport.detail}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-4">
                                                                                        <p className="font-bold text-slate-900">{transport.price}</p>
                                                                                        <button onClick={() => toggleBooking(transport.id)} className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">
                                                                                            Select
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="pt-2">
                                                                    <button onClick={() => setActiveTab("Explore and Book")} className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-2 mt-2">
                                                                        <Search className="w-4 h-4" />
                                                                        Explore transport on your own
                                                                    </button>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </Card>

                                        {/* DAY 2 */}
                                        <Card className="p-7 rounded-[28px] border border-slate-100 shadow-sm bg-white">
                                            <section>
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 text-slate-400 flex items-center justify-center font-bold text-lg shadow-sm">2</div>
                                                        <div>
                                                            <h4 className="font-bold text-[#0B1527] text-xl">Day 2: City Exploration</h4>
                                                            <p className="text-sm text-slate-400 font-medium">Oct 13 · 3 stops</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100">1 BOOKING</span>
                                                </div>

                                                <div className="space-y-4 pl-4 border-l-2 border-slate-100 ml-4">
                                                    {/* Mock Activity Card */}
                                                    <Card className="group p-0 flex gap-0 items-stretch border-slate-100 hover:shadow-xl transition-all bg-white overflow-hidden rounded-[24px]">
                                                        <div className="w-40 relative overflow-hidden">
                                                            <img src="https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt="Louvre" />
                                                        </div>
                                                        <div className="flex-1 p-6">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-bold text-[#0B1527] text-xl">Louvre Museum Guided Tour</h4>
                                                                    <p className="text-slate-400 text-sm font-medium mt-1">Skip-the-line Tickets · Audio Guide Included</p>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-2">
                                                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">Confirmed</span>
                                                                    <p className="text-lg font-bold text-[#0B1527]">$45</p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-6 flex items-center gap-8">
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Start Time</p>
                                                                    <div className="flex items-center gap-2 text-[#0B1527] font-bold">
                                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                                        10:00 AM
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Duration</p>
                                                                    <p className="font-bold text-[#0B1527]">3 Hours</p>
                                                                </div>
                                                                <div className="ml-auto">
                                                                    <button className="text-sm border border-slate-200 bg-white text-slate-700 px-4 py-1.5 rounded-lg font-bold hover:border-slate-900 hover:text-slate-900 transition shadow-sm">
                                                                        View Ticket
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </section>
                                        </Card>
                                    </div>

                                    {/* RIGHT COLUMN: ITINERARY SUMMARY (Booked Items Only) */}
                                    <div className="w-full xl:w-[480px] flex-shrink-0">
                                        <div className="sticky top-6">
                                            <Card className="rounded-[32px] border border-slate-100 shadow-2xl bg-white max-h-[calc(100vh-48px)] flex flex-col overflow-hidden">
                                                {/* Header - Fixed */}
                                                <div className="p-6 pb-2 shrink-0 bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] z-20">
                                                    {/* Header */}
                                                    <div className="mb-2 pl-2">
                                                        <h3 className="font-extrabold text-[#0B1527] text-[28px] tracking-tight mb-1">Itinerary</h3>

                                                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                                            <button className="px-3 py-1.5 bg-[#0081C9] text-white font-bold rounded-xl text-[11px] shadow-lg shadow-blue-100 transition-all active:scale-95">All Days</button>
                                                            <button className="px-3 py-1.5 bg-white border border-slate-100 text-slate-500 font-bold rounded-xl text-[11px] hover:border-slate-200 transition-all">Oct 12</button>
                                                            <button className="px-3 py-1.5 bg-white border border-slate-100 text-slate-500 font-bold rounded-xl text-[11px] hover:border-slate-200 transition-all">Oct 13</button>
                                                            <button className="px-3 py-1.5 bg-white border border-slate-100 text-slate-500 font-bold rounded-xl text-[11px] hover:border-slate-200 transition-all">Oct 14</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Scrollable Body */}
                                                <div className="flex-1 overflow-y-auto p-8 pt-4 no-scrollbar space-y-6">
                                                    {/* DAY 1: ARRIVAL & CLASSICS */}
                                                    <Card className="p-0 border-slate-50 bg-[#F8FAFC]/30 rounded-[32px] overflow-hidden">
                                                        {/* Day Header - Sticky */}
                                                        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 pb-2 flex items-center justify-between transition-all z-10 border-b border-slate-50 shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-[#0081C9] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-100">1</div>
                                                                <div>
                                                                    <h4 className="font-bold text-[#0B1527] text-sm">Day 1: Arrival & Classics</h4>
                                                                    <p className="text-[10px] text-slate-400 font-medium">Oct 12 · 4 stops</p>
                                                                </div>
                                                            </div>
                                                            <div className="w-7 h-7 flex items-center justify-center bg-white border border-slate-50 rounded-full text-slate-400 shadow-sm">
                                                                <ChevronDown className="w-4 h-4" />
                                                            </div>
                                                        </div>

                                                        {/* Stop Cards */}
                                                        <div className="p-4 pt-4 space-y-3">
                                                            {/* Bookable: Flight */}
                                                            {selectedTrip.suggestions.flights.slice(0, 1).map(flight => (
                                                                <div key={flight.id} className="group bg-white p-2.5 rounded-[20px] border border-slate-50 shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer">
                                                                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 duration-500">
                                                                        <img src="https://t3.ftcdn.net/jpg/03/34/74/16/360_F_334741604_pl0DBoNDIhuS2zTYo4WjvgYKSuWrPBn4.jpg" alt="Flight" className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                        <h5 className="font-bold text-[#0B1527] text-[15px] truncate text-emerald-600">Flight Booked</h5>
                                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 w-fit rounded-md text-slate-500 mt-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            <span className="text-[11px] font-bold">10:00 AM</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* Bookable: Hotel */}
                                                            {selectedTrip.suggestions.hotels.slice(0, 1).map(hotel => (
                                                                <div key={hotel.id} className="group bg-white p-2.5 rounded-[20px] border border-slate-50 shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer">
                                                                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 duration-500">
                                                                        <img src={hotel.image} alt="Hotel" className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                        <h5 className="font-bold text-[#0B1527] text-[15px] truncate text-indigo-600">Hotel Reserved</h5>
                                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 w-fit rounded-md text-slate-500 mt-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            <span className="text-[11px] font-bold">12:30 PM</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* Non-Bookable: Lunch */}
                                                            <div className="group bg-white p-2.5 rounded-[20px] border border-slate-50 shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                                                                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 duration-500">
                                                                    <img src="https://cdn.prod.rexby.com/image/46bbd6b24e1745de9c64dc6feca3df4e?format=webp&width=1080&height=1350" alt="Restaurant" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                    <h5 className="font-bold text-[#0B1527] text-[15px] truncate">Lunch at Angelina</h5>
                                                                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">Angelina Paris · 01:30 PM</p>
                                                                </div>
                                                            </div>

                                                            {/* Non-Bookable: Seine Cruise */}
                                                            <div className="group bg-white p-2.5 rounded-[20px] border border-slate-50 shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                                                                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 duration-500">
                                                                    <img src="https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=800&auto=format&fit=crop" alt="Seine" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                    <h5 className="font-bold text-[#0B1527] text-[15px] truncate">Seine River Cruise</h5>
                                                                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">Bateaux Parisiens · 07:00 PM</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>

                                                    {/* DAY 2: MUSEUM DAY */}
                                                    <Card className="p-0 border-slate-50 bg-[#F8FAFC]/30 rounded-[32px] overflow-hidden">
                                                        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 pb-2 flex items-center justify-between transition-all z-10 border-b border-slate-50 shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-white border border-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs shadow-sm">2</div>
                                                                <div>
                                                                    <h4 className="font-bold text-[#0B1527] text-sm">Day 2: Museum & Art</h4>
                                                                    <p className="text-[10px] text-slate-400 font-medium">Oct 13 · 3 stops</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-4 pt-4 space-y-3">
                                                            {/* Bookable: Louvre (Confirmed in left column) */}
                                                            <div className="group bg-white p-2.5 rounded-[20px] border border-emerald-100 bg-emerald-50/20 shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer">
                                                                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                                                    <img src="data:image/jpeg;base64,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" alt="Louvre" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                    <h5 className="font-bold text-emerald-700 text-[15px] truncate">Louvre Tour (Confirmed)</h5>
                                                                    <p className="text-[11px] text-emerald-600 font-medium truncate mt-0.5">10:00 AM · Skip-the-line</p>
                                                                </div>
                                                            </div>

                                                            {/* Non-Bookable: Montmartre */}
                                                            <div className="group bg-white p-2.5 rounded-[20px] border border-slate-50 shadow-sm hover:shadow-md transition-all flex gap-3.5 cursor-pointer opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                                                                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                                                    <img src="https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80&w=800&auto=format&fit=crop" alt="Montmartre" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                    <h5 className="font-bold text-[#0B1527] text-[15px] truncate">Montmartre Walk</h5>
                                                                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">Artist Square · 03:00 PM</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>

                                                    {/* DAYS 3-6: AI REFERENCE */}
                                                    <div className="space-y-4 pt-2">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Remaining Itinerary</p>
                                                        {selectedTrip.summary.itinerary.slice(2).map((day) => (
                                                            <div key={day.day} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-xs text-slate-400">
                                                                        {day.day}
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-bold text-slate-700 text-sm">{day.activity}</h5>
                                                                        <p className="text-[10px] text-slate-400">AI Suggested</p>
                                                                    </div>
                                                                </div>
                                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Tip Card - Kept for consistency */}
                                                    <Card className="p-4 bg-gradient-to-br from-[#0081C9] to-blue-600 text-white shadow-xl shadow-blue-100 border-0 rounded-2xl">
                                                        <div className="flex items-start gap-3">
                                                            <Sparkles className="w-5 h-5 mt-0.5 text-blue-100" />
                                                            <div>
                                                                <p className="font-bold text-sm mb-1">AI Travel Tip</p>
                                                                <p className="text-xs text-blue-50 leading-relaxed">Your hotel offers free shuttle service to the city center. Ask at the front desk upon check-in!</p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "Explore and Book" && (
                        <motion.div
                            key="explore-book"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <Card className="mx-14 p-8 border border-slate-100 shadow-xl bg-white rounded-[32px]">
                                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                                    <div className="relative flex-1 w-full">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm"
                                            placeholder="Search destinations, flights, hotels, or activities..."
                                        />
                                    </div>
                                    <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg w-full md:w-auto active:scale-95">
                                        Search
                                    </button>
                                </div>

                                <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
                                    {["All", "Flights", "Stays", "Experiences", "Transport"].map((cat) => (
                                        <button key={cat} className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${cat === 'All' ? 'bg-[#0081C9] text-white shadow-md shadow-blue-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'}`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            <div className="mx-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {/* Mock Item 1 */}
                                <Card className="overflow-hidden border border-slate-200 hover:border-sky-200 hover:shadow-2xl transition-all duration-300 flex flex-col group bg-white shadow-md rounded-[24px] p-0">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Hotel" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-bold text-slate-900">5.0</span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col bg-white">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 leading-tight">The Peninsula</h3>
                                                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5 font-medium">
                                                    <MapPin className="w-3 h-3" /> Paris, France
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-[#0B1527]">$950<span className="text-[10px] text-slate-400 font-medium block">/night</span></p>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-5">
                                            <button className="w-full py-3 bg-[#0B1527] text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-lg transition-all active:scale-95 border border-slate-800">
                                                Add to Trip
                                            </button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Mock Item 2 */}
                                <Card className="overflow-hidden border border-slate-200 hover:border-sky-200 hover:shadow-2xl transition-all duration-300 flex flex-col group bg-white shadow-md rounded-[24px] p-0">
                                    <div className="h-48 overflow-hidden relative bg-slate-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                                        <Plane className="w-16 h-16 text-slate-300 group-hover:text-sky-300 transition-colors" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-600 shadow-sm border border-slate-100 mb-2 inline-block">Flight</span>
                                            <h3 className="font-bold text-xl text-slate-800">JFK <span className="text-slate-400">→</span> CDG</h3>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col bg-white">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900 leading-tight">Air France</h3>
                                                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5 font-medium">
                                                    <Clock className="w-3 h-3" /> 7h 45m · Non-stop
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-[#0B1527]">$450</p>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-5">
                                            <button className="w-full py-3 bg-[#0B1527] text-white text-sm font-bold rounded-xl border border-slate-800 hover:bg-slate-800 shadow-lg transition-all active:scale-95">
                                                Add to Trip
                                            </button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Mock Item 3 */}
                                <Card className="overflow-hidden border border-slate-200 hover:border-sky-200 hover:shadow-2xl transition-all duration-300 flex flex-col group bg-white shadow-md rounded-[24px] p-0">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src="https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Activity" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-bold text-slate-900">4.8</span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col bg-white">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 leading-tight">Seine Cruise</h3>
                                                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5 font-medium">
                                                    <Clock className="w-3 h-3" /> 2.5 Hours
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-[#0B1527]">$120<span className="text-[10px] text-slate-400 font-medium block">/person</span></p>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-5">
                                            <button className="w-full py-3 bg-[#0B1527] text-white text-sm font-bold rounded-xl border border-slate-800 hover:bg-slate-800 shadow-lg transition-all active:scale-95">
                                                Add to Trip
                                            </button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Mock Item 4 */}
                                <Card className="overflow-hidden border border-slate-200 hover:border-sky-200 hover:shadow-2xl transition-all duration-300 flex flex-col group bg-white shadow-md rounded-[24px] p-0">
                                    <div className="h-48 overflow-hidden relative bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                        <Car className="w-16 h-16 text-slate-300 group-hover:text-emerald-300 transition-colors" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-600 shadow-sm border border-slate-100 mb-2 inline-block">Transport</span>
                                            <h3 className="font-bold text-xl text-slate-800">Private Transfer</h3>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col bg-white">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-slate-900 leading-tight">Executive Car</h3>
                                                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5 font-medium">
                                                    Mercedes S-Class
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-[#0B1527]">$150</p>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-5">
                                            <button className="w-full py-3 bg-white text-[#0B1527] text-sm font-bold rounded-xl border border-slate-200 hover:border-slate-400 shadow-sm hover:shadow-md transition-all active:scale-95">
                                                In Your Trip
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Bookings;
