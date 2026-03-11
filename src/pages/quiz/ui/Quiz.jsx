// src/pages/Quiz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../shared/ui/Card";
import Button from "../../../shared/ui/Button";
import { useUser } from "../../../app/providers/UserProvider";
import { analyzePersonality } from "../../../features/ml-predictions/api/mlService";
import { updateUserPreferences } from "../../../features/auth/api/authService";

const quizQuestions = [
  {
    id: "spend_time",
    question: "How do you like to spend your time?",
    options: [
      { value: "city_culture", label: "City culture & landmarks" },
      { value: "scenic_relax", label: "Scenic views & relaxation" },
      { value: "adventure", label: "Adventure & thrill" }
    ]
  },
  {
    id: "curiosity",
    question: "What sparks your curiosity?",
    options: [
      { value: "landmarks", label: "Famous landmarks" },
      { value: "hidden_gems", label: "Hidden gems & local spots" },
      { value: "mix", label: "Mix of both" }
    ]
  },
  {
    id: "recharge",
    question: "How do you recharge?",
    options: [
      { value: "lake_scenic", label: "By a lake or scenic spot" },
      { value: "hike_adventure", label: "Hiking or adventure" },
      { value: "cafe_social", label: "Cafes & social spaces" }
    ]
  },
  {
    id: "travel_pref",
    question: "How do you prefer to travel?",
    options: [
      { value: "solo", label: "Solo" },
      { value: "group_new", label: "Group of new friends" },
      { value: "friends_family", label: "Friends or family" }
    ]
  }
];

const Quiz = () => {
  const navigate = useNavigate();
  const { setPersonality, updatePreferences } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentQ = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleSelectAnswer = (value) => {
    setAnswers({
      ...answers,
      [currentQ.id]: value
    });
  };

  const handleNext = async () => {
    if (!answers[currentQ.id]) {
      setError("Please select an option");
      return;
    }

    if (isLastQuestion) {
      // All questions answered - call ML API
      await submitQuiz();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setError(null);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call backend ML API via centralized service
      const data = await analyzePersonality(answers);

      if (data.success) {
        // Store personality data
        const personalityType = determinePersonalityType(data.personality_scores);
        
        setPersonality(personalityType);
        updatePreferences({
          vibe: personalityType,
          personality_scores: data.personality_scores,
          categories: data.categories,
          quiz_answers: answers
        });

        // Update user preferences in backend
        try {
          await updateUserPreferences({
            travelPreferences: {
              adventure: data.personality_scores.adventure_score,
              relaxation: data.personality_scores.relaxation_score,
              culture: data.personality_scores.spiritual_score,
              food: 0, // Default value, could be enhanced
              budget: 'medium' // Default value, could be enhanced
            },
            quizAnswers: answers
          });
        } catch (updateError) {
          console.warn('Failed to update user preferences in backend:', updateError);
          // Continue anyway since frontend state is updated
        }

        setLoading(false);
        // Navigate to home
        navigate("/home");
      } else {
        throw new Error(data.error || "Failed to analyze personality");
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const determinePersonalityType = (scores) => {
    const { adventure_score, spiritual_score, bonding_score, relaxation_score } = scores;
    
    if (adventure_score > 0.7) return "The Explorer";
    if (relaxation_score > 0.7) return "The Soft Landing";
    if (spiritual_score > 0.7) return "The Cultural Enthusiast";
    if (bonding_score > 0.7) return "The Social Butterfly";
    return "The Balanced Traveler";
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50 to-sky-100 flex flex-col">
      <div className="flex-1 px-6 pt-10 pb-6 max-w-md mx-auto flex flex-col w-full">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-sky-500 tracking-[0.18em] font-semibold">
              QUESTION {currentQuestion + 1} OF {quizQuestions.length}
            </p>
            <p className="text-xs text-slate-500">{Math.round(progress)}%</p>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">
            {currentQ.question}
          </h2>
          <p className="text-sm text-slate-500">
            Choose the option that resonates most with you
          </p>
        </div>

        {/* Options */}
        <Card className="p-4 mb-6 flex-1">
          <div className="flex flex-col gap-3">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectAnswer(option.value)}
                className={`w-full text-left rounded-2xl px-4 py-3 border text-sm transition-all ${
                  answers[currentQ.id] === option.value
                    ? "bg-sky-50 border-sky-200 text-sky-700 ring-2 ring-sky-300"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{option.label}</span>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id] === option.value
                        ? "border-sky-500 bg-sky-500"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {answers[currentQ.id] === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || loading}
          >
            Back
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleNext}
            disabled={!answers[currentQ.id] || loading}
          >
            {loading ? "Analyzing..." : isLastQuestion ? "Get My Vibe" : "Next"}
          </Button>
        </div>

        {/* Step indicator */}
        <div className="mt-4 flex justify-center gap-1">
          {quizQuestions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx <= currentQuestion ? "bg-sky-500 w-6" : "bg-slate-200 w-1.5"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
