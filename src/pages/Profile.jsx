import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Settings, UserPlus, Heart } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useTrip } from "../context/TripContext";

const Profile = () => {
  const { user } = useUser();
  const { trips } = useTrip();
  const [activeTab, setActiveTab] = useState("Trips");
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tabsRef = useRef(null);
  const cardRef = useRef(null);
  const bannerRef = useRef(null);

  // Sticky tabs detection + scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current && cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const tabsRect = tabsRef.current.getBoundingClientRect();
        setIsTabsSticky(tabsRect.top <= cardRect.top + 20);
      }

      // Track scroll progress for banner fade effect
      if (bannerRef.current) {
        const bannerRect = bannerRef.current.getBoundingClientRect();
        const bannerHeight = bannerRef.current.offsetHeight;
        const scrolled = Math.max(0, -bannerRect.top);
        const progress = Math.min(1, scrolled / bannerHeight);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* CENTERED CARD CONTAINER */}
      <div
        ref={cardRef}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
      >
        {/* --- CINEMATIC BANNER --- */}
        <motion.div
          ref={bannerRef}
          className="w-full h-96 relative overflow-hidden"
          style={{
            opacity: 1 - scrollProgress * 0.3,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: `scale(${1 + scrollProgress * 0.1})`,
            }}
          />
          {/* Enhanced Gradient Overlay with scroll-based darkening */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500"
            style={{
              opacity: 1 + scrollProgress * 0.4,
            }}
          />
        </motion.div>

        {/* --- PROFILE CONTENT --- */}
        <div className="relative px-10 pb-20 pt-4">
          {/* AVATAR - Enhanced with more breathing room */}
          <div className="flex justify-center mb-8 -mt-24">
            <div className="w-48 h-48 rounded-full border-8 border-white/90 shadow-2xl overflow-hidden bg-gradient-to-br from-white/90 to-slate-50/50 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* IDENTITY - More spacious */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              {user.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
              <MapPin size={18} />
              <span className="text-lg">{user.basedIn || "Global Citizen"}</span>
            </div>
            <p className="text-slate-600 max-w-2xl mx-auto text-xl leading-relaxed font-light">
              Collector of sunsets and passport stamps. Traveling to find the places that make me feel small. 🌿✨
            </p>
          </div>

          {/* STATS ROW - Perfectly centered & balanced */}
          <div className="flex items-end justify-center gap-8 py-6 border-y border-slate-100/50 mb-12 px-8">
            {[
              { value: user.stats?.trips || 12, label: "Trips" },
              { value: user.stats?.savedSpots || 148, label: "Saved" },
              { value: "8.5k", label: "Followers" },
              { value: "342", label: "Following" }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center group cursor-pointer flex-1 min-w-[80px]">
                <motion.p
                  className="text-3xl font-black text-slate-900 mb-2 group-hover:scale-105 transition-transform"
                  whileHover={{ y: -4 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold group-hover:text-slate-600 transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS - Enhanced spacing */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold px-10 h-14 rounded-2xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:from-slate-800 hover:to-slate-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 text-lg"
            >
              <Settings size={18} />
              Edit Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="h-14 w-14 flex items-center justify-center bg-white/80 backdrop-blur-sm border-2 border-slate-200/50 rounded-2xl hover:bg-white/100 hover:border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UserPlus size={20} className="text-slate-700" />
            </motion.button>
          </div>

          {/* STICKY NAVIGATION TABS */}
          <div
            ref={tabsRef}
            className={`sticky-nav-wrapper transition-all duration-300 ${isTabsSticky
              ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm py-2 top-0 z-20'
              : 'border-b border-slate-100/50 mb-20 pb-8'
              }`}
          >
            <div className="flex items-center justify-center gap-16 max-w-2xl mx-auto">
              {["Trips", "Saved", "Reviews", "Highlights"].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-4 py-3 text-lg font-semibold transition-all duration-300 group"
                  whileHover={{ y: -2 }}
                >
                  <span className={`block transition-colors duration-200 ${activeTab === tab
                    ? "text-slate-900 font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                    : "text-slate-500 hover:text-slate-700"
                    }`}>
                    {tab}
                  </span>
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-gradient-to-r from-slate-900 to-slate-700 rounded-full w-8"
                      transition={{ type: "spring", bounce: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* TABS CONTENT - Enhanced spacing & layout */}
          <div className="space-y-12">
            {activeTab === "Trips" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl mx-auto">
                {[
                  {
                    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=900&auto=format&fit=crop",
                    title: "Summer in Santorini",
                    location: "Santorini, Greece",
                    dates: "June 15-22, 2024",
                    description: "Exploring the white-washed villages and stunning sunsets of the Greek islands."
                  },
                  {
                    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=900&auto=format&fit=crop",
                    title: "Tokyo Adventures",
                    location: "Tokyo, Japan",
                    dates: "March 10-20, 2024",
                    description: "Immersing in the vibrant culture, incredible food, and neon-lit streets of Japan's capital."
                  },
                  {
                    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=900&auto=format&fit=crop",
                    title: "Swiss Alps Retreat",
                    location: "Zermatt, Switzerland",
                    dates: "December 5-12, 2023",
                    description: "Skiing through pristine powder and enjoying cozy mountain chalets with breathtaking views."
                  },
                  {
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa4aJi17NAsUj1b8ktlrRUoIN5gP-i_ykKrA&s",
                    title: "Bali Escape",
                    location: "Ubud, Bali",
                    dates: "August 1-10, 2023",
                    description: "Finding peace in rice terraces, ancient temples, and traditional Balinese culture."
                  },
                  {
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtOGVgK5DXm2PHmmGDz6VVoBu39iuB17-wbQ&s",
                    title: "Parisian Dreams",
                    location: "Paris, France",
                    dates: "May 1-7, 2023",
                    description: "Wandering through charming streets, world-class museums, and iconic landmarks."
                  }
                ].map((trip, index) => (
                  <motion.div
                    key={`trip-${index}`}
                    className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-lg hover:bg-white/80 transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                  >
                    {/* Unified Image Block with All Content */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-110"
                      />

                      {/* Softer Cinematic Gradient - Bottom 40% Only */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 via-60% to-transparent" />

                      {/* All Content Overlaid on Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-7">
                        <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                          {trip.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-white/75 mb-1.5">
                          <MapPin size={14} className="flex-shrink-0" />
                          <span className="text-sm font-medium">{trip.location}</span>
                        </div>
                        <p className="text-xs text-white/60 font-medium mb-2.5">{trip.dates}</p>

                        {/* Description inside image */}
                        <p className="text-xs text-white/65 leading-relaxed line-clamp-2 font-light">
                          {trip.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "Saved" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {[
                  { name: "Eiffel Tower", location: "Paris, France", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=600&auto=format&fit=crop" },
                  { name: "Santorini Sunset", location: "Santorini, Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=600&auto=format&fit=crop" },
                  { name: "Tokyo Tower", location: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600&auto=format&fit=crop" },
                  { name: "Grand Canyon", location: "Arizona, USA", image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=600&auto=format&fit=crop" },
                  { name: "Machu Picchu", location: "Cusco, Peru", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=600&auto=format&fit=crop" },
                  { name: "Northern Lights", location: "Iceland", image: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?q=80&w=600&auto=format&fit=crop" },
                  { name: "Bali Rice Terraces", location: "Ubud, Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop" },
                  { name: "Swiss Alps", location: "Zermatt, Switzerland", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=600&auto=format&fit=crop" },
                  { name: "Great Wall", location: "Beijing, China", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=600&auto=format&fit=crop" }
                ].map((place, i) => (
                  <motion.div
                    key={i}
                    className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    {/* Tall Portrait Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-110"
                      />

                      {/* Soft Bottom Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent via-70% to-transparent" />

                      {/* Minimal Overlaid Text */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h4 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {place.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-white/75">
                          <MapPin size={12} className="flex-shrink-0" />
                          <span className="text-xs font-medium">{place.location}</span>
                        </div>
                      </div>

                      {/* Heart Icon on Hover */}
                      <motion.button
                        className="absolute top-4 right-4 h-10 w-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart size={16} className="fill-rose-500 text-rose-500" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="text-center py-32">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-24 h-24 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
                    <p className="text-2xl font-bold text-slate-400">📝</p>
                  </div>
                  <p className="text-slate-400 text-xl font-medium">No reviews yet</p>
                  <p className="text-slate-500 text-lg">Your adventures will appear here once you start sharing your stories.</p>
                </div>
              </div>
            )}

            {activeTab === "Highlights" && (
              <div className="text-center py-32">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-24 h-24 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
                    <p className="text-2xl font-bold text-slate-400">✨</p>
                  </div>
                  <p className="text-slate-400 text-xl font-medium">No highlights yet</p>
                  <p className="text-slate-500 text-lg">Create moments worth remembering and showcase them here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
