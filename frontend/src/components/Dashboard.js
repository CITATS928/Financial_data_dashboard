// Dashboard.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import TableView from "./TableView";
import ChartsView from "./ChartsView";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

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
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");

    const csrfToken = await getCsrfToken();
    if (!csrfToken) return;

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
      setData(res.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

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
  
  // const handleLogout = async () => {
  //   console.log("Logout clicked");
  //   try {
  //     await axios.post("http://localhost:8000/api/logout/", {}, { withCredentials: true });
  //     toast.success("Logged out successfully!");
  //     navigate("/");
  //   } catch (error) {
  //     toast.error("Failed to log out.");
  //     console.error("Logout error:", error);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((row) => {
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
    <div className="container py-4" style={{ position: "relative", minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={3000} />
  
      {/* Logout Button — Fixed Top Right */}
      <button
        onClick={handleLogout}
        className="btn btn-sm btn-primary"
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
          <h5 className="card-title mb-3">Upload Financial CSV</h5>
          <div className="d-flex gap-3 align-items-center">
            <input type="file" onChange={handleFileChange} className="form-control" />
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
            <div style={{ position: "relative", flexGrow: 1 }}>
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
                  className="btn btn-outline-secondary btn-sm"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-500px",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    fontSize: "18px",
                    lineHeight: "1",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    color: "red", 
                  }}
                  aria-label="Clear search"
                >
                  Clear
                  {/* &times; */}
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
    </div>
  );
}


 /* ========== [Archived from chore/merge_to_main branch — for reference only] ==========

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/csrf/", { withCredentials: true })
      .then(() => {
        axios.get("http://localhost:8000/api/dashboard/table/", { withCredentials: true })
          .then(() => {
            loadData();
          })
          .catch(() => {
            toast.warning("You must be logged in!");
            navigate("/");
          });
      })
      .catch(() => {
        toast.error("Failed to fetch CSRF token.");
      });
  }, [navigate]);

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const filteredTableData = tableData.filter((row) => {
    if (!searchQuery) return true;
    if (searchColumn === "all") {
      return Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      const value = row[searchColumn];
      return (
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-3">📊 Financial Dashboard</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Search Events</h5>
          <div className="d-flex gap-3">
            <select
              className="form-select w-auto"
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
            >
              <option value="all">All Fields</option>
              <option value="date">Date</option>
              <option value="category">Category</option>
              <option value="amount">Amount</option>
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              placeholder={`Search by ${searchColumn === "all" ? "any field" : searchColumn}`}
            />
          </div>
        </div>
      </div>

      <div className="mb-5">
        <TableView data={filteredTableData} searchQuery={searchQuery} searchColumn={searchColumn} />
      </div>

      <div>
        <ChartsView data={filteredTableData} />
      </div>
    </div>
  );
}

 */
