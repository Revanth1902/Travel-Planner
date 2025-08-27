import React, { useState, useEffect } from "react";
import TravelPlanner from "./Components/TravelPlanner";

export default function App() {
  const [user, setUser] = useState(null); // Logged in user
  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [formData, setFormData] = useState({ username: "", password: "" });

  // Dummy user database in state (no backend)
  const [users, setUsers] = useState([{ username: "test", password: "123" }]);

  // Inline styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5",
      fontFamily: "Arial, sans-serif",
    },
    form: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      width: "300px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "16px",
    },
    button: {
      padding: "10px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
    },
    toggleText: {
      color: "#007bff",
      cursor: "pointer",
      textAlign: "center",
    },
    heading: {
      fontSize: "2rem",
      marginBottom: "20px",
      color: "#333",
      textAlign: "center",
      fontWeight: "bold",
    },
    logoutButton: {
      position: "fixed",
      top: 20,
      right: 20,
      padding: "10px 15px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
  };

  // Cookie helpers
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      "; expires=" +
      expires +
      "; path=/";
  }

  function getCookie(name) {
    return document.cookie.split("; ").reduce((r, v) => {
      const parts = v.split("=");
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, "");
  }

  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }

  // On mount, check if user cookie exists and log in automatically
  useEffect(() => {
    const cookieUser = getCookie("travelPlannerUser");
    if (cookieUser) {
      // Check if user exists in dummy DB (optional)
      const foundUser = users.find((u) => u.username === cookieUser);
      if (foundUser) {
        setUser(foundUser);
      } else {
        // If user not found in DB, clear cookie
        deleteCookie("travelPlannerUser");
      }
    }
  }, [users]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const foundUser = users.find(
      (u) =>
        u.username === formData.username && u.password === formData.password
    );
    if (foundUser) {
      setUser(foundUser);
      setCookie("travelPlannerUser", foundUser.username, 30); // Set cookie for 30 days
    } else {
      alert("Invalid username or password!");
    }
  };

  const handleSignup = () => {
    const userExists = users.find((u) => u.username === formData.username);
    if (userExists) {
      alert("Username already exists!");
      return;
    }
    if (!formData.username || !formData.password) {
      alert("Please fill out both fields");
      return;
    }
    const newUser = {
      username: formData.username,
      password: formData.password,
    };
    setUsers([...users, newUser]);
    setUser(newUser);
    setCookie("travelPlannerUser", newUser.username, 30); // Set cookie for 30 days
  };

  const handleLogout = () => {
    setUser(null);
    deleteCookie("travelPlannerUser");
  };

  if (user) {
    // Show TravelPlanner with a heading and logout button
    return (
      <div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
        <h1 style={styles.heading}>AI Traveling App</h1>
        <TravelPlanner />
      </div>
    );
  }

  // Show login/signup form with heading if not logged in
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>AI Traveling App</h1>
      <form
        style={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          isLogin ? handleLogin() : handleSignup();
        }}
      >
        <h2 style={{ textAlign: "center" }}>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          style={styles.input}
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button style={styles.button} type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <p
          style={styles.toggleText}
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({ username: "", password: "" });
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}
