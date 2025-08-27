import React from "react";

export default function SavedPlans({ savedPlans, onClear, onDelete }) {
  return (
    <div className="card">
      <div className="saved-header">
        <h2>⭐ Saved Plans</h2>
        <button onClick={onClear} className="btn clear-btn">
          Clear All
        </button>
      </div>

      <div className="saved-grid">
        {savedPlans.map((plan, i) => (
          <div key={i} className="saved-plan">
            <div className="plan-header">
              <h3>Plan {i + 1}</h3>
              <button
                className="btn delete-btn"
                onClick={() => onDelete(i)}
                aria-label={`Delete Plan ${i + 1}`}
              >
                ❌
              </button>
            </div>

            <div className="day-grid">
              {plan.map((day, j) => (
                <div key={j} className="day-card">
                  <h4>Day {day.day}</h4>
                  <ul>
                    {day.activities.map((act, k) => (
                      <li key={k}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
