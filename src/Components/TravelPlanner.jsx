import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { handleVoiceInput } from "../utils/speech";
import ItineraryCard from "./ItineraryCard";
import SavedPlans from "./SavedPlans";

// Fetch places using Overpass API (OpenStreetMap)
const fetchDynamicPlaces = async (city) => {
  const query = `
    [out:json][timeout:25];
    area["name"="${city}"]->.searchArea;
    (
      node["tourism"](area.searchArea);
      node["historic"](area.searchArea);
      node["natural"](area.searchArea);
      node["amenity"="marketplace"](area.searchArea);
    );
    out body 50;
  `;

  const url =
    "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.elements.map((el) => el.tags && el.tags.name).filter(Boolean);
  } catch (error) {
    console.error("OSM Fetch Error:", error);
    return [];
  }
};

// Dynamic activity generation based on place type
const generateActivitiesFor = (placeName) => {
  const map = {
    Waterfall: ["Watch the falls", "Picnic nearby", "Nature walk"],
    Fort: ["Explore the fort", "Photography", "Learn history"],
    Temple: ["Cultural visit", "Admire architecture", "Spiritual time"],
    Beach: ["Relax on sand", "Swim or surf", "Enjoy sunset"],
    Market: ["Shop local crafts", "Try street food", "Meet locals"],
    "View Point": ["Take panoramic photos", "Scenic ride", "Short hike"],
    Museum: ["Discover exhibits", "Join a guided tour", "Learn something new"],
    Park: ["Jog or walk", "Play outdoor games", "Birdwatching"],
    Lake: ["Boating", "Fishing", "Picnic by the water"],
    Hill: ["Trekking", "Enjoy misty views", "Watch sunrise"],
    Forest: ["Wildlife spotting", "Nature trails", "Camping"],
    Dam: ["Watch water release", "Enjoy cool breeze", "Take photos"],
    Desert: ["Camel ride", "Sandboarding", "Watch stars"],
    Cave: ["Explore inside", "Learn geology", "Take torch-lit tour"],
    AmusementPark: ["Ride roller coasters", "Eat fun snacks", "Enjoy shows"],
    Zoo: ["See exotic animals", "Feed birds", "Kids' zone"],
    Garden: ["Walk among flowers", "Photography", "Relax on a bench"],
    River: ["Rafting", "Nature walk by banks", "Watch sunset on river"],
    WildlifeSanctuary: ["Jeep safari", "Birdwatching", "Nature study"],
    Island: ["Snorkel or dive", "Boat tour", "Sunbathe on beach"],
    Monastery: ["Meditate", "Learn about monks’ lives", "Quiet time"],
    Winery: ["Wine tasting", "Tour the vineyard", "Learn wine-making process"],
  };

  for (const key in map) {
    if (placeName.toLowerCase().includes(key.toLowerCase())) {
      return map[key];
    }
  }

  // Default suggestions if no match found
  return ["Explore surroundings", "Try local food", "Discover hidden gems"];
};

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

  const handleGenerate = async () => {
    if (!destination || !days) {
      setError("Please fill all details");
      return;
    }

    setLoading(true);
    setError("");

    const places = await fetchDynamicPlaces(destination);
    const count = parseInt(days);

    const generated = Array.from({ length: count }, (_, i) => {
      const location =
        places[i % places.length] || `${destination} - Area ${i + 1}`;
      const activities = generateActivitiesFor(location);
      const baseExpense = 8000 + i * 1600;
      return {
        day: i + 1,
        location,
        activities,
        expectedExpense: baseExpense,
      };
    });

    setTimeout(() => {
      setItinerary(generated);
      setShowConfetti(true);
      setLoading(false);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 1000);
  };

  const handleSave = () => {
    if (itinerary.length > 0) {
      setSavedPlans([...savedPlans, itinerary]);
    }
  };

  const clearSaved = () => setSavedPlans([]);
  const handleDeletePlan = (index) => {
    setSavedPlans((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="main-container">
      {showConfetti && <Confetti />}
      <h1 className="title">✈ AI Travel Planner</h1>

      <div className="top-section">
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
            placeholder="Interests (e.g. beaches, temples)"
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

        <div className="preview-section">
          {loading && <p className="loading">Crafting your itinerary...</p>}
          {error && <p className="error">{error}</p>}
          {itinerary.length > 0 && (
            <ItineraryCard itinerary={itinerary} onSave={handleSave} />
          )}
        </div>
      </div>

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
        Built with 💻 by Revanth | Powered by OpenStreetMap
      </footer>
    </div>
  );
}
