import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function Profile() {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/dashboard/current-user/", {
        withCredentials: true,
      })
      .then((res) => {
        setEmail(res.data.email);
        setNewEmail(res.data.email);
      })
      .catch(() => {
        toast.error("Failed to load user data");
      });
  },[]);


  const getCSRFToken = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  };

  const handleEmailUpdate = async () => {
    const csrfToken = getCSRFToken();
    try {
      await axios.post(
        "http://localhost:8000/api/dashboard/update-profile/",
        { new_email: newEmail },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Email updated. Please log in again.");
      navigate("/");
    } catch {
      toast.error("Email update failed");
    }
  };

  const handlePasswordUpdate = async () => {
    const csrfToken = getCSRFToken();
    try {
      await axios.post(
        "http://localhost:8000/api/dashboard/update-profile/",
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Password updated. Please log in again.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Password update failed");
    }
  };



  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", width: "100vw",justifyContent: "center", 
  alignItems: "center", 
  padding: "60px 20px" ,  }}>
    <div style={{  maxWidth: "800px", width: "100%", padding: "50px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)"}}>
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="mb-4">Profile Setting</h2>
      <div className="mb-4">
        <label className="form-label">Email</label>
        <input className="form-control" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
        <button className="btn btn-primary mt-2" onClick={handleEmailUpdate}>Update Email</button>
      </div>

      <hr />

      <div className="mb-3">
        <label className="form-label">Current Password</label>
        <input className="form-control" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
      </div>

      <div className="mb-3">
        <label className="form-label">New Password</label>
        <input className="form-control" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
      </div>

      <div className="mb-3">
        <label className="form-label">Confirm New Password</label>
        <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
      </div>

      <button className="btn btn-warning" onClick={handlePasswordUpdate}>Update Password</button>
      
    </div>
    </div>
  );
  }
  