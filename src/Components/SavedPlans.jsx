import React from "react";

const usdToInr = 15; // Example conversion rate

export default function SavedPlans({ savedPlans, onClear, onDelete }) {
  return (
    <div>
      <div className="saved-header">
        <h2>Saved Plans</h2>
        <button className="clear-btn" onClick={onClear}>
          Clear All
        </button>
      </div>
      <div className="saved-grid">
        {savedPlans.map((plan, index) => (
          <div key={index} className="saved-plan">
            <div className="plan-header">
              <h3>Plan #{index + 1}</h3>
              <button
                className="btn delete-btn"
                onClick={() => onDelete(index)}
              >
                &times;
              </button>
            </div>
            <div className="day-grid">
              {plan.map((day) => {
                const mapQuery = encodeURIComponent(day.location);

                return (
                  <div key={day.day} className="day-card">
                    <h4>Day {day.day}</h4>
                    <p>
                      <strong>Location:</strong> {day.location}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn maps-btn"
                    >
                      🗺️ View on Maps
                    </a>

                    {/* Embedded Mini Google Map Preview */}
                    <div
                      style={{
                        margin: "10px 0",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <iframe
                        title={`map-${day.day}`}
                        width="100%"
                        height="200"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>

                    <p>
                      <strong>Expected Expense:</strong> ₹
                      {(day.expectedExpense * usdToInr).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                    </p>
                    <ul>
                      {day.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
