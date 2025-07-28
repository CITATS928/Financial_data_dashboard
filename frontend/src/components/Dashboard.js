// Dashboard.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import TableView from "./TableView";
import ChartsView from "./ChartsView";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import AggregateReport from './AggregateReport';
import EntityBarChart from './EntityBarChart';
import PrintReport from "./PrintReport";
axios.defaults.withCredentials = true;

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");
  const [excludeQuery, setExcludeQuery] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const [showTotal, setShowTotal] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [entity, setEntity] = useState('');
  const [entities, setEntities] = useState([]);
  const [viewMode] = useState('yearly');
  const [selectedEntity, setSelectedEntity] = useState("All");

  useEffect(() => {
    document.body.setAttribute("style", "background-color: #ffffff !important");
    return () => {
      document.body.removeAttribute("style");
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/entities/')
      .then((res) => {
        setEntities(res.data);
        if (res.data.length > 0) {
          setEntity(res.data[0]); // Set first entity as default
        }
      })
      .catch((err) => {
        console.error('Error fetching entities:', err);
      });
  }, []);

  const handleReset = () => {
    setSearchQuery("");
    setExcludeQuery("");
    setSearchColumn("all");
    setSelectedEntity("All");
  };

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
    if (!files || files.length === 0) {
      if (!files.length) return toast.error("Please select at least one file.");
    }

    const csrfToken = await getCsrfToken();
    if (!csrfToken) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // backend expects "files"
    });

    try {
      const response = await axios.post("http://localhost:8000/api/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      toast.success("Upload successful");

      if (response.data?.results?.length > 0) {
        response.data.results.forEach((result) => {
          if (result.error) {
            toast.error(`${result.filename}: ${result.error}`);
          } else {
            toast.success(
              `${result.filename} uploaded to ${result.table} (${result.rows_uploaded} rows)`
            );
          }
        });
      }

      fetchData();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 500);
    } catch (err) {
      console.error("Upload error:", err);

      // Check if the error response contains a specific error message
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Upload failed: ${err.response.data.error}`);
      }else {
        toast.error("Upload failed. Check console for details.");
      }
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/dashboard/financial-line-items/");
      const enhancedData = res.data.map((item) => {
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

  const filteredData = data.filter((row) => {
    const query = searchQuery.toLowerCase();
    const exclude = excludeQuery.toLowerCase();

    const matchesSearch = !searchQuery
      ? true
      : searchColumn === "all"
      ? Object.values(row).some(
          (val) => val && val.toString().toLowerCase().includes(query)
        )
      : row[searchColumn] &&
        row[searchColumn].toString().toLowerCase().includes(query);

    const matchesExclude = !excludeQuery
      ? true
      : searchColumn === "all"
      ? !Object.values(row).some(
          (val) => val && val.toString().toLowerCase().includes(exclude)
        )
      : !(row[searchColumn] && row[searchColumn].toString().toLowerCase().includes(exclude));

    const matchesEntity =
      selectedEntity === "All" || row.entity_name === selectedEntity;

    return matchesSearch && matchesExclude && matchesEntity;
  });

  return (
    <div className="py-4" style={{ minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Logout Button */}
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
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              multiple
            />
            <button
              onClick={handleUpload}
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

      {/* Search & Filters Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Search & Filter</h5>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex gap-2 flex-grow-1">
              {/* Column Selector */}
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

              {/* Include Input */}
              <input
                type="text"
                ref={searchInputRef}
                className="form-control"
                placeholder={`Include ${
                  searchColumn === "all" ? "any field" : searchColumn
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Exclude Input */}
              <input
                type="text"
                className="form-control"
                placeholder={`Exclude ${
                  searchColumn === "all" ? "any field" : searchColumn
                }`}
                value={excludeQuery}
                onChange={(e) => setExcludeQuery(e.target.value)}
              />

              {(searchQuery || excludeQuery) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline-secondary btn-sm text-danger"
                  style={{
                    height: "38px",
                    width: "200px",
                    padding: 0,
                    color: "red",
                    borderColor: "#ced4da",
                    backgroundColor: "#fff",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table & Charts */}
      <div className="mb-5">
        <TableView
          data={filteredData}
          searchQuery={searchQuery}
          searchColumn={searchColumn}
          selectedEntity={selectedEntity}
          setSelectedEntity={setSelectedEntity}
          handleReset={handleReset}
        />
      </div>

      <ChartsView data={filteredData} />



      {/* Aggregate Button */}
    <div className="mb-10" style={{ paddingTop: '35px' }}>

      <button onClick={() => setShowTotal(prev => !prev)}
        style={{
                  padding: '8px 16px',
                  fontSize: '15px',
                  borderRadius: '12px',
                  backgroundColor: showTotal ? '#4CAF50' : '#4c84ff',
                  color: showTotal ? 'white' : 'white',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  width: 'fit-content',     
                  minWidth: 'auto',         
                  display: 'inline-block', 
                  marginBottom: '20px',
                   
    
                }} 
>
        {showTotal ? 'Hide Aggregate Chart' : 'Show Aggregate Chart'}
      </button>

      {showTotal && <AggregateReport data={filteredData} />}
    </div>


<div className="mb-10" style={{ paddingTop: '35px' }}>
<button onClick={() => setShowChart(!showChart)}
         style={{
                  padding: '8px 16px',
                  fontSize: '15px',
                  borderRadius: '12px',
                  backgroundColor: showChart ? '#4CAF50' : '#4c84ff',
                  color: showChart ? 'white' : 'white',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                  width: 'fit-content',     
                  minWidth: 'auto',         
                  display: 'inline-block',
    
                }} 
>
      
        {showChart ? 'Hide Chart' : 'Yearly/Quarterly Chart'}
      </button>
<select
  onChange={(e) => setEntity(e.target.value)}
  className="ml-4 px-2 py-1 border rounded-md"
  
>
  <option value="">Select an Entity</option>
  {entities.map((name, idx) => (
    <option key={idx} value={name}>{name}</option>
  ))}
</select>
      {showChart && (
  <div className="mt-4">
    <div className="mb-4 flex items-center gap-4">
    </div>

    <EntityBarChart entityName={entity} view={viewMode} />
  </div>
)}
 <PrintReport data={filteredData} selectedEntity={selectedEntity} />

</div>
  
    </div>

    
  );
}