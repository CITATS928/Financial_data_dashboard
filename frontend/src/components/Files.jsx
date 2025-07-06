import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Files() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/dashboard/my-uploaded-files/", {
        withCredentials: true,
      })
      .then((res) => {
        setUploadedFiles(res.data);
      })
      .catch(() => {
        toast.error("Failed to load uploaded files.");
      });
  }, []);


  
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie;
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.slice(name.length));
          break;
        }
      }
    }
    return cookieValue;
  };
  
  const handleDelete = (uploadId) => {
    const csrfToken = getCookie("csrftoken");
  
    axios
      .delete(`http://localhost:8000/delete-file/${uploadId}/`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken,
        },
      })
      .then(() => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== uploadId));
        toast.success("File deleted successfully.");
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        toast.error("Failed to delete file.");
      });
  };

  return (
    <div style={{  width: "82vw", minHeight: "100vh", paddingTop: "20px" }}>
      <div className="container mt-5">
        <ToastContainer />
        <h2 className="mb-4">Uploaded Files</h2>

        {uploadedFiles.length === 0 ? (
          <p>You haven't uploaded any files yet.</p>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Filename</th>
                <th>Upload Time</th>
                <th>Rows</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{file.filename}</td>
                  <td>{new Date(file.upload_time).toLocaleString()}</td>
                  <td>{file.row_count}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(file.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
