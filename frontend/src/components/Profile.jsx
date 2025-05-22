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

  };

  const handleUpdateEmail = async () => {

  };

  const handleUpdatePassword = async () => {

  };



  return (
    <div className="container mt-5" style={{ maxWidth:"600px" }}>
      <h2 className="mb-4">Profile Setting</h2>
      <div className="mb-4">
        <label className="form-label">Email</label>
        <input className="form-control" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
        <button className="btn btn-primary mt-2">Update Email</button>
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

      <button className="btn btn-warning">Update Password</button>

    </div>
  );
  }
  