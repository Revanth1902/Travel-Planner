import React from "react";

export default function ItineraryCard({ itinerary, onSave }) {
  return (
    <div className="card">
      <h2>🗺️ Itinerary Preview</h2>
      <div className="itinerary-days">
        {itinerary.map((dayPlan, index) => (
          <div key={index} className="day-card">
            <h3>Day {dayPlan.day}</h3>
            <ul>
              {dayPlan.activities.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={onSave} className="btn save-btn">
        💾 Save
      </button>
    </div>
  );
}
