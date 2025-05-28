import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Files() {
  const [items, setItem] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/dashboard/my-files/", {
        withCredentials: true,
      })
      .then((res) => {
        setItem(res.data);
      })
      .catch(() => {
        toast.error("Failed to load files.");
      });
  }, []);

  




  return (
    
  );
}