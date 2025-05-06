// src/components/Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🔐 Extract CSRF token from cookie
  const getCSRFToken = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  };

  // 🌐 Fetch CSRF token cookie when page loads
  useEffect(() => {
    axios.get("https://financial-data-dashboard.onrender.com/api/csrf/", {
      withCredentials: true,
    })
    .then(() => {
      console.log("CSRF cookie fetched");
    })
    .catch(() => {
      toast.error("Failed to get CSRF token");
    });
  }, []);

  // 🚀 Handles login request
  const handleLogin = async () => {
    const csrfToken = getCSRFToken();

    try {
      // Unused variable 'res' removed
      await axios.post(
        "https://financial-data-dashboard.onrender.com/api/dashboard/session-login/",
        { username, password },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="background">
      {/* <div className="shape"></div>
      <div className="shape"></div> */}

      <form
        onSubmit={(e) => {
          e.preventDefault();  // ⛔ Prevent default HTML form behavior
          handleLogin();       // ✅ Call login logic
        }}
      >
        <h3>Login Here</h3>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Enter Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-container" style={{ marginBottom: "20px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>

        <button type="submit">Log In</button>
        <a href="/signup">Create an account</a>
      </form>
    </div>
  );
}
