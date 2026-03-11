// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../shared/ui/Card";
import Button from "../../../shared/ui/Button"; // Kept import to prevent breaking, even if unused directly in this specific UI layout
import { useUser } from "../../../app/providers/UserProvider";
import { mockFeed } from "../../../shared/mocks/mockFeed";
import { PlaneTakeoff, Users, MapPin, Sparkles, ArrowRight } from "lucide-react"; // Added a few icons for visual flair
import { motion } from "framer-motion";
import ItineraryForm from "../../../features/itinerary/ui/ItineraryForm";

const Home = () => {
  const { user } = useUser();
  const firstName = user.name.split(" ")[0] || "Nomad";
  const navigate = useNavigate();
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="space-y-6 pb-6">
      {/* Header Section */}
      <header className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Good Evening
            </p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Hey, {firstName}
            </h1>
          </div>
          <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
             <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
              {user.personalityTag}
            </p>
          </div>
        </div>
        
        {/* Next Flight Alert - Moved out for better visibility */}
        <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 mt-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-emerald-700 font-medium">GA-881 · On time</p>
          </div>
          <p className="text-[10px] text-emerald-600/70 font-medium">Upcoming</p>
        </div>
      </header>

      {/* Main Action Area */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          Start planning <Sparkles size={16} className="text-amber-400" />
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-indigo-600 mb-4 underline"
        >
          Build custom itinerary
        </button>
        <div className="grid grid-cols-12 gap-3">
          {/* Custom Itinerary Builder - Primary Action (Span 7) */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="col-span-7 relative overflow-hidden rounded-[24px] bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 flex flex-col justify-between min-h-[140px] shadow-lg shadow-purple-200"
          >
            <div className="bg-white/20 w-fit p-2 rounded-full backdrop-blur-sm">
              <MapPin size={20} className="text-white" />
            </div>
            <div className="text-left z-10">
              <span className="block text-base font-bold">Custom Itinerary</span>
              <span className="text-[11px] text-purple-100 opacity-90 leading-tight block mt-1">
                AI-powered personalized planning
              </span>
            </div>
            {/* Decorative circle */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          </motion.button>

          {/* Solo Trip & Ideas (Span 5) */}
          <div className="col-span-5 flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/chat")}
              className="flex-1 rounded-[24px] bg-white border border-slate-100 p-3 flex flex-col justify-center gap-1 shadow-sm relative overflow-hidden group"
            >
              <PlaneTakeoff size={18} className="text-rose-500 mb-1" />
              <div className="text-left">
                <span className="block text-sm font-bold text-slate-800">Solo Trip</span>
                <span className="text-[10px] text-slate-400">AI-guided chaos mode</span>
              </div>
            </motion.button>
            
            <button className="h-10 w-full rounded-[18px] bg-slate-50 text-slate-400 text-[10px] font-medium hover:bg-slate-100 transition-colors">
              Save ideas
            </button>
          </div>
        </div>
      </section>

      {/* Trending Horizontal Scroll */}
      <section>
        <div className="flex items-center justify-between px-1 mb-3">
          <h3 className="text-sm font-bold text-slate-800">Trending Vibe</h3>
          <button 
            onClick={() => navigate('/explore')}
            className="text-xs text-indigo-600 font-medium flex items-center gap-1"
          >
            See all <ArrowRight size={12} />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
          {mockFeed.trendingForVibe.map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explore')}
              className="snap-center min-w-[140px] flex flex-col gap-2 cursor-pointer group"
            >
              <div className={`h-32 w-full rounded-[24px] ${item.thumbnailColor} shadow-sm relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-700">
                  {item.tag}
                </span>
              </div>
              <div className="px-1">
                <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin size={10} /> {item.city}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* From The Feed */}
      <Card className="p-0 overflow-hidden border-none shadow-none bg-transparent">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-slate-800">Community</h3>
          <button
            className="text-[11px] text-slate-400 font-medium"
            onClick={() => navigate("/explore")}
          >
            Explore
          </button>
        </div>
        
        <div className="space-y-3">
          {mockFeed.fromFeed.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate('/explore')}
              className="group bg-white rounded-[20px] p-4 border border-slate-100 shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-xs">✈️</span>
                </div>
                <div>
                   <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-0.5">
                    {post.location}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {post.snippet}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {showForm && (
        <ItineraryForm isOpen={showForm} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default Home;