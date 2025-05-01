// Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import TableView from "./TableView";
import ChartsView from "./ChartsView";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



axios.defaults.withCredentials = true;

export default function Dashboard() {

  useEffect(() => {
    document.body.setAttribute("style", "background-color: #ffffff !important");
  
    return () => {
      document.body.removeAttribute("style");
    };
  }, []);
  
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getCsrfToken = async () => {
    try {
      await axios.get("http://localhost:8000/api/csrf/", {
        withCredentials: true,
      });
      return Cookies.get("csrftoken");
    } catch (error) {
      console.error("Failed to fetch CSRF token", error);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");

    const csrfToken = await getCsrfToken();
    if (!csrfToken) return toast.error("Failed to get CSRF token");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/dashboard/upload-financial-line-items/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });
      toast.success("Upload successful");
      fetchData();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/dashboard/financial-line-items/");
      setData(res.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <ToastContainer />
      <h2 className="mb-3">📊 Financial Dashboard</h2>

      <div className="mb-4">
        <input type="file" className="form-control mb-2" onChange={handleFileChange} />
        <button onClick={handleUpload} className="btn btn-primary">Upload CSV</button>
      </div>

      <TableView data={data} />
      <ChartsView data={data} />
    </div>
  );
}
