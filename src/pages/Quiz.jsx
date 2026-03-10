// src/pages/Quiz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { useUser } from "../context/UserContext";

const vibes = [
  {
    id: "explorer",
    label: "The Explorer",
    description: "Hidden alleys, back‑street food, and zero fixed plans.",
  },
  {
    id: "chill",
    label: "The Soft Landing",
    description: "Slow mornings, long coffees, and beachfront sunsets.",
  },
  {
    id: "lux",
    label: "The Quiet Luxury",
    description: "Design hotels, tasting menus, and airport lounges.",
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const { setPersonality, updatePreferences } = useUser();
  const [selectedVibe, setSelectedVibe] = useState("explorer");

  const handleSubmit = () => {
    const tag =
      vibes.find((v) => v.id === selectedVibe)?.label || "The Explorer";
    setPersonality(tag);
    updatePreferences({
      vibe: tag,
    });
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-sky-100 flex flex-col">
      <div className="flex-1 px-6 pt-10 pb-6 max-w-md mx-auto flex flex-col">
        <p className="text-xs text-sky-500 tracking-[0.18em] font-semibold mb-2">
          GET YOUR VIBE
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Yo, I’m your vibe AI.
        </h1>
        <p className="text-sm text-slate-500 mb-4">
          Tell what kind of energy you are chasing next: chaotic, chill, luxe,
          or just survive‑the‑weekend mode.
        </p>

        <Card className="p-4 mb-4">
          <p className="text-xs text-slate-500 mb-3">
            Pick the vibe that feels most like your next trip.
          </p>
          <div className="flex flex-col gap-2">
            {vibes.map((vibe) => (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`w-full text-left rounded-2xl px-3 py-3 border text-sm transition-all ${
                  selectedVibe === vibe.id
                    ? "bg-sky-50 border-sky-200 text-sky-700"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-medium">{vibe.label}</span>
                  <div
                    className={`h-4 w-4 rounded-full border ${
                      selectedVibe === vibe.id
                        ? "border-sky-500 bg-sky-500"
                        : "border-slate-300 bg-white"
                    }`}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {vibe.description}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <Button variant="primary" className="w-full mt-2" onClick={handleSubmit}>
          Lock in my vibe
        </Button>
      </div>
    </div>
  );
};

export default Quiz;
