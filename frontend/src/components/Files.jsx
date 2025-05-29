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
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "60px", width: "1000px" }}>
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4">My Files Records</h2>

      {items.length === 0 ? (
       <p>You haven't uploaded any file.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Entity</th>
              <th>Account Code</th>
              <th>Description</th>
              <th>YTD Actual</th>
              <th>Annual Budget</th>
              <th>Category</th>
              <th>Item Type</th>
              <th>Expense Nature</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.entity_name}</td>
                <td>{item.account_code}</td>
                <td>{item.description}</td>
                <td>{item.ytd_actual}</td>
                <td>{item.annual_budget}</td>
                <td>{item.category}</td>
                <td>{item.item_type}</td>
                <td>{item.expense_nature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
    </div>
  );
}