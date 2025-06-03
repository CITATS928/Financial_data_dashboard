// Dashboard.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import TableView from "./TableView";
import ChartsView from "./ChartsView";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import TotalActualByEntityChart from './TotalActualByEntityChart';
import AggregateReport from './AggregateReport';

axios.defaults.withCredentials = true;

export default function Dashboard() {
  const [files, setFiles] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const [showTotal, setShowTotal] = useState(false);

  useEffect(() => {
    document.body.setAttribute("style", "background-color: #ffffff !important");
    return () => {
      document.body.removeAttribute("style");
    };
  }, []);

  const getCsrfToken = async () => {
    try {
      await axios.get("http://localhost:8000/api/csrf/", {
        withCredentials: true,
      });
      return Cookies.get("csrftoken");
    } catch (error) {
      toast.error("Failed to fetch CSRF token");
      return null;
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!files.length) return toast.error("Please select at least one file.");

    const csrfToken = await getCsrfToken();
    if (!csrfToken) return;

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("files", file); // Same key name for multiple files
    });

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
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 500);
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/dashboard/financial-line-items/");
      const enhancedData = res.data.map(item => {
        const actual = parseFloat(item.ytd_actual) || 0;
        const budget = parseFloat(item.annual_budget) || 0;
        const percentUsed = budget !== 0 ? (actual / budget) * 100 : null;
        return {
          ...item,
          percent_used: percentUsed,
        };
      });
      setData(enhancedData);
      console.log("Fetched and enhanced data:", enhancedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    }
  };
  

  // const fetchData = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:8000/api/dashboard/financial-line-items/");
  //     setData(res.data);
  //     console.log("Fetched data:", res.data);
  //   } catch {
  //     toast.error("Failed to load data");
  //   }
  // };

  const handleLogout = async () => {
    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) return;
  
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
  
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out.");
      console.error("Logout error:", error);
    }
  };
  
    useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((row) => 
    {
    if (!searchQuery) return true;

    if (searchColumn === "all") {
      return Object.values(row).some(
        (val) => val && val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      const val = row[searchColumn];
      return val && val.toString().toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  return (
    <div className="py-4" style={{minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={3000} />
  
      {/* Logout Button — Fixed Top Right */}
      <button
        onClick={handleLogout}
        className="btn btn-sm btn-danger"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "auto",
          display: "inline-block",
          padding: "5px 10px",
          fontSize: "0.85rem",
          zIndex: 9999,
        }}
      >
        Logout
      </button>
  
      <div className="mb-4">
        <h2 className="text-primary">📊 Diocese of DE Dashboard</h2>
      </div>
  
      {/* Upload Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Upload Financial CSV</h5>
          <div className="d-flex gap-3 align-items-center">
            <input type="file" className="form-control" onChange={handleFileChange} multiple />
            <button onClick={handleUpload}
            className="btn btn-primary"
            style={{
              padding: "5px 10px",
              fontSize: "0.85rem",
              width: "auto",
              display: "inline-block",
            }}
            >
              Upload CSV
              </button>
          </div>
        </div>
      </div>
  
      {/* Search Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Search Records</h5>
          <div className="d-flex gap-3">
            <select
              className="form-select w-auto"
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
            >
              <option value="all">All Fields</option>
              <option value="entity_name">Entity Name</option>
              <option value="account_code">Account Code</option>
              <option value="description">Description</option>
              <option value="ytd_actual">YTD Actual</option>
              <option value="annual_budget">Annual Budget</option>
              <option value="category">Category</option>
              <option value="item_type">Item Type</option>
            </select>
            {/* Input + Close Button Container */}
            <div className="d-flex align-items-center w-100 gap-2">
              <input
                type="text"
                ref={searchInputRef}
                className="form-control"
                placeholder={`Search by ${searchColumn === "all" ? "any field" : searchColumn}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                className="btn btn-outline-secondary btn-sm text-danger"
                  style={{
                   height: "38px",
                   width: "80px",
                   padding: "0",
                    color: "red", 
                  //  whiteSpace: "nowrap",
                   borderColor: "#ced4da",
                   backgroundColor: "#fff"
                  }}
                                  >
                  Clear
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
    

      {/* Table and Charts */}
      <div className="mb-5">
        <TableView data={filteredData} searchQuery={searchQuery} searchColumn={searchColumn} />
      </div>
  
      <ChartsView data={filteredData} />

      {/* Aggregate Button */}
    <div className="mb-5">
      <button onClick={() => setShowTotal(prev => !prev)}
        style={{
                  padding: '20px 8px',
                  fontSize: '15px',
                  borderRadius: '12px',
                  backgroundColor: showTotal ? '#4CAF50' : '#4c84ff',
                  color: showTotal ? 'white' : '#333',
                  border: '2px solid #ccc',
                  cursor: 'pointer',
    
                }} 
>
        {showTotal ? 'Hide Aggregate' : 'Show Aggregate'}
      </button>

      {showTotal && <AggregateReport />}
    </div>

    </div>

    
  );
}