// src/pages/Auth.jsx
import React from "react";
import { motion as Motion } from "framer-motion";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const handleContinue = (e) => {
    e.preventDefault();
    // existing auth / navigation logic here
    navigate("/chat");
  };
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-50 via-sky-50 to-sky-100 flex items-center justify-center px-6">
      {/* background glows */}
      <div className="pointer-events-none absolute -top-40 -right-20 w-[520px] h-[520px] bg-gradient-to-tr from-sky-300/55 to-sky-500/40 blur-[110px] opacity-80" />
      <div className="pointer-events-none absolute bottom-[-220px] left-[-80px] w-[520px] h-[520px] bg-gradient-to-tr from-slate-200/70 to-sky-200/50 blur-[130px]" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT: bigger type + “why sign in” */}
        <Motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/2 space-y-6"
        >
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            It’s time to fly again.
          </h1>

          <p className="text-base md:text-lg text-slate-700 max-w-md leading-relaxed">
            Keep every chaotic‑good itinerary, hidden gem, and last‑minute
            flight in one calm place. Pick up any trip on any device.
          </p>

          {/* mini benefits row to fill space 
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="rounded-2xl bg-white/80 border border-slate-200 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold text-sky-600">
                SYNC ACROSS DEVICES
              </p>
              <p className="text-sm text-slate-700">
                Start on laptop, tweak from airport WiFi.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold text-sky-600">
                SAVE YOUR CHAOS
              </p>
              <p className="text-sm text-slate-700">
                One place for flights, stays, and “we’ll see” plans.
              </p>
            </div>
          </div> */}
        </Motion.div>

        {/* RIGHT: larger card + denser layout */}
        <Motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="lg:w-1/2 w-full"
        >
          <Card className="px-8 pt-8 pb-6 rounded-[2.5rem] bg-white/95 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.9)]">
            {/* card header */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-sky-600">
                The Trav Story
              </p>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold text-slate-900">
                Welcome back, nomad.
              </h2>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                Log in to open your next chaotic‑good escape.
              </p>
            </div>

            <form onSubmit={handleContinue} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="jane.doe@example.com"
                  className="w-full text-sm md:text-base rounded-full bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full text-sm md:text-base rounded-full bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
                />
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center bg-slate-900 hover:bg-slate-800 text-base md:text-lg py-3.5"
                >
                  Continue
                </Button>
              </div>
            </form>

            {/* footer row inside card to reduce emptiness */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs md:text-sm text-slate-500">
                New here?{" "}
                <span className="text-sky-600 font-semibold cursor-pointer">
                  Get your vibe first
                </span>
              </p>
              <p className="text-[11px] text-slate-400">No spam. Just trips.</p>
            </div>
          </Card>

          <p className="mt-5 text-[11px] md:text-xs text-center text-slate-400 max-w-sm mx-auto">
            By continuing, you agree to travel way more than your group chat.
          </p>
        </Motion.div>
      </div>
    </div>
  );
};
export default Auth;
