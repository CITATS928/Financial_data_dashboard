import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TableView from "./TableView";
import ChartsView from "./ChartsView";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const searchInputRef = useRef(null);

  const navigate = useNavigate();

  function getCSRFToken() {
    const matches = document.cookie.match(/csrftoken=([^;]+)/);
    return matches ? matches[1] : null;
  }

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

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const csrfToken = getCSRFToken();

    try {
      await axios.post("http://localhost:8000/api/dashboard/upload/", formData, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });
      toast.success("File uploaded successfully!");
      loadData();
      setTimeout(() => {
        searchInputRef.current?.focus();  // 👈 Auto-focus the search bar
      }, 500);
    } catch (err) {
      toast.error("File upload failed. Please try again.");
      setError("File upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const tableRes = await axios.get("http://localhost:8000/api/dashboard/table/", {
        withCredentials: true,
      });
      const chartRes = await axios.get("http://localhost:8000/api/dashboard/chart/", {
        withCredentials: true,
      });
      setTableData(tableRes.data);
      setChartData(chartRes.data);
    } catch (err) {
      toast.error("Failed to load data. Please try again.");
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
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

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📊 Diocese of DE Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-outline-danger">
          Logout
        </button>
      </div>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Upload Event CSV</h5>
          <div className="d-flex gap-3 align-items-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-control"
            />
            <button
              onClick={uploadFile}
              disabled={loading}
              className="btn btn-success"
            >
              {loading ? "Uploading..." : "Upload CSV"}
            </button>
          </div>
        </div>
      </div>

      {/* Search section */}
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
