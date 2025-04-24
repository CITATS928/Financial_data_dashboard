import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const getCSRFToken = () => {
    const matches = document.cookie.match(/csrftoken=([^;]+)/);
    return matches ? matches[1] : null;
  };
  
  useEffect(() => {
    axios.get("http://localhost:8000/api/csrf/", { withCredentials: true })
      .then(() => {
        console.log("CSRF cookie fetched");
      })
      .catch(() => {
        toast.error("Failed to get CSRF token");
      });
  }, []);

  const handleLogin = async () => {
    const csrfToken = getCSRFToken();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/dashboard/session-login/",
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
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <input onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
