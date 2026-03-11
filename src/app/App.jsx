// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/landing/ui/Landing";
import Auth from "../pages/auth/ui/Auth";
import Quiz from "../pages/quiz/ui/Quiz";
import Home from "../pages/home/ui/Home";
import Explore from "../pages/explore/ui/Explore";
import Chat from "../pages/chat/ui/Chat";
import Planner from "../pages/planner/ui/Planner";
import Profile from "../pages/profile/ui/Profile";
import MainLayout from "./layouts/MainLayout";
import { useUser } from "./providers/UserProvider";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useUser();

  if (isAuthLoading) {
    // Show loading spinner while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useUser();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
      <Route element={<MainLayout />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner/:tripId"
          element={
            <ProtectedRoute>
              <Planner />
            </ProtectedRoute>
          }
        />
        <Route path="/planner" element={<Navigate to="/planner/1" />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
