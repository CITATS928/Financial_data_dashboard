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

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "60px" }}>
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
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{file.filename}</td>
                  <td>{new Date(file.upload_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
