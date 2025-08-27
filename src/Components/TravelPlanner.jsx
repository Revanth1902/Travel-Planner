import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { handleVoiceInput } from "../utils/speech";
import ItineraryCard from "./ItineraryCard";
import SavedPlans from "./SavedPlans";

export default function TravelPlanner() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [interests, setInterests] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedPlans, setSavedPlans] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("plans")) || [];
    setSavedPlans(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("plans", JSON.stringify(savedPlans));
  }, [savedPlans]);

  const handleGenerate = () => {
    if (!destination || !days) {
      setError("Please fill all details");
      return;
    }
    setLoading(true);
    setError("");

    const generated = Array.from({ length: parseInt(days) }, (_, i) => ({
      day: i + 1,
      activities: [
        `Explore ${interests} spots in ${destination}`,
        "Try local cuisine",
        "Visit hidden gems",
      ],
    }));

    setTimeout(() => {
      setItinerary(generated);
      setShowConfetti(true);
      setLoading(false);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 1500);
  };

  const handleSave = () => {
    if (itinerary.length > 0) {
      setSavedPlans([...savedPlans, itinerary]);
    }
  };

  const clearSaved = () => setSavedPlans([]);
  const handleDeletePlan = (index) => {
    setSavedPlans((prevPlans) => prevPlans.filter((_, i) => i !== index));
  };

  return (
    <div className="main-container">
      {showConfetti && <Confetti />}

      <h1 className="title">✈ AI Travel Planner</h1>

      {/* Top Section: Form + Itinerary */}
      <div className="top-section">
        {/* Left: Form */}
        <div className="form-section">
          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <input
            type="number"
            placeholder="Days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
          <textarea
            placeholder="Interests (beach, food, adventure...)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
          <button
            className="btn mic-btn"
            onClick={() => handleVoiceInput(setInterests)}
          >
            🎤 Speak Interests
          </button>
          <button className="btn primary-btn" onClick={handleGenerate}>
            ✨ Generate Plan
          </button>
        </div>

        {/* Right: Itinerary Preview */}
        <div className="preview-section">
          {loading && <p className="loading">Crafting your adventure...</p>}
          {error && <p className="error">{error}</p>}
          {itinerary.length > 0 && (
            <ItineraryCard itinerary={itinerary} onSave={handleSave} />
          )}
        </div>
      </div>

      {/* Bottom: Saved Plans */}
      {savedPlans.length > 0 && (
        <div className="saved-section">
          <SavedPlans
            savedPlans={savedPlans}
            onClear={clearSaved}
            onDelete={handleDeletePlan}
          />
        </div>
      )}

      <footer className="footer">
        Built with 💻 + ✈ by Revanth | Powered by AI
      </footer>
    </div>
  );
}
