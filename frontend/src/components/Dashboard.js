import React, { useState, useEffect } from "react";
import axios from "axios";
import TableView from "./TableView";
import ChartsView from "./ChartsView";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  function getCSRFToken() {
    const matches = document.cookie.match(/csrftoken=([^;]+)/);
    return matches ? matches[1] : null;
  }

  useEffect(() => {
    // 获取 CSRF cookie
    axios.get("http://localhost:8000/api/csrf/", { withCredentials: true })
      .then(() => {
        // 然后尝试访问受保护接口判断是否登录
        axios.get("http://localhost:8000/api/dashboard/table/", { withCredentials: true })
          .then(() => {
            loadData(); // 登录了再加载数据
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

      <div className="mb-5">
        <TableView data={tableData} />
      </div>

      <div>
        <ChartsView data={tableData} />
      </div>
    </div>
  );
}