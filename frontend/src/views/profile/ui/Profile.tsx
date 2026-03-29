// src/pages/Profile.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "../../../shared/ui/Card";
import Button from "../../../shared/ui/Button";
import { useUser } from "../../../app/providers/UserProvider";
import { useTrip } from "../../../app/providers/TripProvider";
import {
  MapPin,
  Calendar,
  Plane,
  Hotel,
  Star,
  TrendingUp,
  Award,
  Heart,
  Settings,
  Edit3,
  Camera
} from "lucide-react";

const Profile = () => {
  const { user } = useUser();
  const { trips } = useTrip();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");

  // Calculate stats from actual trips
  const tripStats = {
    totalTrips: trips.length,
    upcomingTrips: trips.filter(trip => new Date(trip.dates.split(' - ')[0]) > new Date()).length,
    completedTrips: trips.filter(trip => new Date(trip.dates.split(' - ')[1]) < new Date()).length,
    totalDestinations: [...new Set(trips.flatMap(trip => trip.locations))].length,
    totalBudget: trips.reduce((sum, trip) => sum + (trip.budget?.total || 0), 0)
  };

  const personalityInsights = {
    "The Explorer": {
      icon: "🗺️",
      description: "Adventure seeker who loves discovering new places and cultures",
      strengths: ["Cultural immersion", "Outdoor activities", "Spontaneous travel"],
      recommended: ["Hiking destinations", "Cultural festivals", "Off-the-beaten-path experiences"]
    },
    "The Relaxer": {
      icon: "🏖️",
      description: "Peaceful traveler who values relaxation and comfort",
      strengths: ["Wellness retreats", "Beach destinations", "Luxury experiences"],
      recommended: ["Spa resorts", "Island getaways", "Quiet countryside"]
    },
    "The Foodie": {
      icon: "🍽️",
      description: "Culinary enthusiast who travels for food and dining experiences",
      strengths: ["Local cuisine", "Food markets", "Cooking classes"],
      recommended: ["Culinary tours", "Wine regions", "Street food destinations"]
    },
    "The Culture Vulture": {
      icon: "🏛️",
      description: "History and art lover who seeks cultural enrichment",
      strengths: ["Museums", "Historical sites", "Art galleries"],
      recommended: ["UNESCO sites", "Cultural festivals", "Architectural tours"]
    }
  };

  const currentInsights = personalityInsights[user.personalityTag] || personalityInsights["The Explorer"];

  const upcomingTrips = trips.filter(trip => {
    const startDate = new Date(trip.dates.split(' - ')[0]);
    return startDate > new Date();
  });

  const pastTrips = trips.filter(trip => {
    const endDate = new Date(trip.dates.split(' - ')[1]);
    return endDate < new Date();
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"></div>
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-white p-1">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border">
              <Camera size={16} className="text-slate-600" />
            </button>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Button variant="ghost" className="bg-white/20 text-white hover:bg-white/30">
            <Settings size={16} />
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 px-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-600 flex items-center gap-2">
              <span className="text-lg">{currentInsights.icon}</span>
              {user.personalityTag}
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit3 size={16} />
            Edit Profile
          </Button>
        </div>
        <p className="text-sm text-slate-500">
          Based in {user.basedIn} • Home airport {user.homeAirport} • Member since {user.memberSince}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{tripStats.totalTrips}</div>
          <div className="text-sm text-slate-600">Total Trips</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{tripStats.upcomingTrips}</div>
          <div className="text-sm text-slate-600">Upcoming</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{tripStats.totalDestinations}</div>
          <div className="text-sm text-slate-600">Destinations</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">${tripStats.totalBudget.toLocaleString()}</div>
          <div className="text-sm text-slate-600">Total Spent</div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 px-6">
        {[
          { id: "overview", label: "Overview" },
          { id: "trips", label: "My Trips" },
          { id: "insights", label: "Travel Insights" },
          { id: "bookings", label: "Bookings" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Personality Insights */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{currentInsights.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Your Travel Personality: {user.personalityTag}
                  </h3>
                  <p className="text-slate-600 mb-4">{currentInsights.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Your Strengths</h4>
                      <ul className="space-y-1">
                        {currentInsights.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                            <Star size={12} className="text-yellow-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Recommended For You</h4>
                      <ul className="space-y-1">
                        {currentInsights.recommended.map((rec, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                            <Heart size={12} className="text-red-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => router.push('/')}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  variant="outline"
                >
                  <MapPin size={20} />
                  <span className="text-sm">Plan New Trip</span>
                </Button>
                <Button
                  onClick={() => router.push('/explore')}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  variant="outline"
                >
                  <TrendingUp size={20} />
                  <span className="text-sm">Explore</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('trips')}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  variant="outline"
                >
                  <Calendar size={20} />
                  <span className="text-sm">My Trips</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('bookings')}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  variant="outline"
                >
                  <Award size={20} />
                  <span className="text-sm">Bookings</span>
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "trips" && (
          <div className="space-y-6">
            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Trips</h3>
                <div className="space-y-3">
                  {upcomingTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => router.push(`/planner/${trip.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                          <MapPin size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{trip.title}</h4>
                          <p className="text-sm text-slate-600">{trip.dates}</p>
                          <p className="text-xs text-slate-500">{trip.locations.join(" • ")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">
                          ${trip.budget?.total || 0}
                        </div>
                        <div className="text-xs text-slate-500">Budget</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Past Trips */}
            {pastTrips.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Past Adventures</h3>
                <div className="space-y-3">
                  {pastTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                      onClick={() => router.push(`/planner/${trip.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <Award size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{trip.title}</h4>
                          <p className="text-sm text-slate-600">{trip.dates}</p>
                          <p className="text-xs text-slate-500">{trip.locations.join(" • ")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">Completed</div>
                        <div className="text-xs text-slate-500">Trip finished</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {trips.length === 0 && (
              <Card className="p-6 text-center">
                <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No trips yet</h3>
                <p className="text-slate-600 mb-4">Start planning your first adventure!</p>
                <Button onClick={() => router.push('/')}>Create Your First Trip</Button>
              </Card>
            )}
          </div>
        )}

        {activeTab === "insights" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Travel Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Travel Patterns</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Average trip duration</span>
                    <span className="font-semibold">7 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Favorite season</span>
                    <span className="font-semibold">Summer</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Budget per trip</span>
                    <span className="font-semibold">${Math.round(tripStats.totalBudget / Math.max(tripStats.totalTrips, 1))}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Achievements</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award size={16} className="text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">First Trip</div>
                      <div className="text-xs text-slate-500">Welcome to the travel community!</div>
                    </div>
                  </div>
                  {tripStats.totalTrips >= 3 && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Star size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Seasoned Traveler</div>
                        <div className="text-xs text-slate-500">3+ trips completed</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "bookings" && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Bookings Overview</h3>
            <div className="space-y-4">
              <p className="text-slate-600">
                Your flight, hotel, and activity bookings from upcoming trips will appear here for easy access.
              </p>

              {/* Mock upcoming bookings */}
              {upcomingTrips.length > 0 && (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Plane size={20} className="text-blue-600" />
                      <span className="font-semibold text-slate-900">Next Flight</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      {upcomingTrips[0].locations[0]} → {upcomingTrips[0].locations[1] || upcomingTrips[0].locations[0]}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Booking reference: ABC123 • Economy</div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Hotel size={20} className="text-green-600" />
                      <span className="font-semibold text-slate-900">Hotel Reservation</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      Luxury Resort • {upcomingTrips[0].locations[0]}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Check-in: {upcomingTrips[0].dates.split(' - ')[0]} • 3 nights</div>
                  </div>
                </div>
              )}

              {upcomingTrips.length === 0 && (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600">No upcoming bookings</p>
                  <p className="text-sm text-slate-500">Plan a trip to see your bookings here</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
