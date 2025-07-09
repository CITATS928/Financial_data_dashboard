import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EntityDetail() {
  const { id } = useParams();
  const [lineItems, setLineItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/api/entities/${id}/details/`)
      .then((res) => res.json())
      .then((data) => setLineItems(data));
  }, [id]);

  const filteredItems = lineItems.filter((item) =>
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}> {id}</h2>

     
      <input
        type="text"
        placeholder="Search by description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "0.3s",
            }}
          >
            <h5>{item.description}</h5>
            <p><strong>Account Code:</strong> {item.account_code}</p>
            <p><strong>YTD Actual:</strong> ${item.ytd_actual}</p>
            <p><strong>Annual Budget:</strong> ${item.annual_budget}</p>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Type:</strong> {item.item_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
