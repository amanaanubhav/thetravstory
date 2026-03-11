// src/pages/Auth.jsx
import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import { useUser } from "../../../app/providers/UserProvider";
import { registerUser, loginUser } from "../../../features/auth/api/authService";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }

    if (!isLogin && !formData.name) {
      setError("Name is required for registration");
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      let response;

      if (isLogin) {
        // Login
        response = await loginUser({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        response = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      if (response.success) {
        // Update user context
        login(response.user);

        // Navigate to quiz for new users, home for existing
        if (!isLogin) {
          // New user - go to quiz
          navigate("/quiz");
        } else {
          // Existing user - go to home
          navigate("/home");
        }
      } else {
        setError(response.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-50 via-sky-50 to-sky-100 flex items-center justify-center px-6">
      {/* background glows */}
      <div className="pointer-events-none absolute -top-40 -right-20 w-[520px] h-[520px] bg-gradient-to-tr from-sky-300/55 to-sky-500/40 blur-[110px] opacity-80" />
      <div className="pointer-events-none absolute bottom-[-220px] left-[-80px] w-[520px] h-[520px] bg-gradient-to-tr from-slate-200/70 to-sky-200/50 blur-[130px]" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT: bigger type + "why sign in" */}
        <Motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/2 space-y-6"
        >
          <p className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-sky-500">
            {isLogin ? "Sign in" : "Join us"}
          </p>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {isLogin ? "Welcome back, nomad." : "Ready for your next adventure?"}
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-md leading-relaxed">
            {isLogin
              ? "Keep every chaotic‑good itinerary, hidden gem, and last‑minute flight in one calm place."
              : "Discover personalized travel recommendations based on your unique personality and preferences."
            }
          </p>

          {/* mini benefits row to fill space */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl bg-white/70 border border-slate-200 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold text-sky-500">
                PERSONALIZED TRIPS
              </p>
              <p className="text-sm text-slate-700">
                AI-powered recommendations just for you.
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 border border-slate-200 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold text-sky-500">
                SYNC ACROSS DEVICES
              </p>
              <p className="text-sm text-slate-700">
                Start on laptop, tweak from airport Wi‑Fi.
              </p>
            </div>
          </div>
        </Motion.div>

        {/* RIGHT: auth form */}
        <Motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="lg:w-1/2 w-full"
        >
          <Card className="px-8 pt-8 pb-6 rounded-[2.5rem] bg-white/95 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.9)]">
            {/* card header */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.22em] uppercase text-sky-500">
                Travixo account
              </p>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold text-slate-900">
                {isLogin ? "Welcome back, nomad." : "Create your account"}
              </h2>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                {isLogin
                  ? "Log in to open your next chaotic‑good escape."
                  : "Sign up to get personalized travel recommendations."
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field (only for signup) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    className="w-full text-sm md:text-base rounded-full bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jane.doe@example.com"
                  className="w-full text-sm md:text-base rounded-full bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
                  disabled={loading}
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full text-sm md:text-base rounded-full bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
                  disabled={loading}
                />
              </div>

              {/* Confirm Password field (only for signup) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full text-sm md:text-base rounded-full bg-slate-50 border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center bg-slate-900 hover:bg-slate-800 text-base md:text-lg py-3.5"
                  disabled={loading}
                >
                  {loading
                    ? (isLogin ? "Signing in..." : "Creating account...")
                    : (isLogin ? "Sign In" : "Create Account")
                  }
                </Button>
              </div>
            </form>

            {/* Toggle between login/signup */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                {isLogin ? "New to Travixo?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sky-600 font-semibold hover:text-sky-700 transition-colors"
                  disabled={loading}
                >
                  {isLogin ? "Create account" : "Sign in"}
                </button>
              </p>
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
