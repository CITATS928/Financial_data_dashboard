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


/* ========== [Archived from chore/merge_to_main branch — for reference only] ==========

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const [file, setFile] = useState(null);
//   const [tableData, setTableData] = useState([]);
//   const [chartData, setChartData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchColumn, setSearchColumn] = useState("all");
//   const searchInputRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("http://localhost:8000/api/csrf/", { withCredentials: true })
//       .then(() => {
//         axios.get("http://localhost:8000/api/dashboard/table/", { withCredentials: true })
//           .then(() => {
//             loadData();
//           })
//           .catch(() => {
//             toast.warning("You must be logged in!");
//             navigate("/");
//           });
//       })
//       .catch(() => {
//         toast.error("Failed to fetch CSRF token.");
//       });
//   }, [navigate]);

//   const handleLogout = () => {
//     toast.success("Logged out successfully!");
//     navigate("/");
//   };

//   const filteredTableData = tableData.filter((row) => {
//     if (!searchQuery) return true;
//     if (searchColumn === "all") {
//       return Object.values(row).some(
//         (value) =>
//           value &&
//           value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     } else {
//       const value = row[searchColumn];
//       return (
//         value &&
//         value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//   });

//   return (
//     <div className="container py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="mb-3">📊 Financial Dashboard</h2>

//       <div className="card mb-4 shadow-sm">
//         <div className="card-body">
//           <h5 className="card-title mb-3">Search Events</h5>
//           <div className="d-flex gap-3">
//             <select
//               className="form-select w-auto"
//               value={searchColumn}
//               onChange={(e) => setSearchColumn(e.target.value)}
//             >
//               <option value="all">All Fields</option>
//               <option value="date">Date</option>
//               <option value="category">Category</option>
//               <option value="amount">Amount</option>
//             </select>

//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="form-control"
//               placeholder={`Search by ${searchColumn === "all" ? "any field" : searchColumn}`}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mb-5">
//         <TableView data={filteredTableData} searchQuery={searchQuery} searchColumn={searchColumn} />
//       </div>

//       <div>
//         <ChartsView data={filteredTableData} />
//       </div>
//     </div>
//   );
// }

*/
