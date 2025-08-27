import React from "react";

const usdToInr = 15; // USD to INR conversion rate (you can update it as needed)

export default function ItineraryCard({ itinerary, onSave }) {
  return (
    <div className="card">
      <h2>Your Generated Itinerary</h2>
      <div className="itinerary-days">
        {itinerary.map((day) => (
          <div key={day.day} className="day-card">
            <h4>Day {day.day}</h4>
            <p>
              <strong>Location:</strong> {day.location}
            </p>
            <p>
              <strong>Expected Expense:</strong> ₹
              {(day.expectedExpense * usdToInr).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
            <ul>
              {day.activities.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button className="btn save-btn" onClick={onSave}>
        Save Plan
      </button>
    </div>
  );
}
