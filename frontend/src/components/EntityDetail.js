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

 const [isDark, setIsDark] = useState(
  window.matchMedia('(prefers-color-scheme: dark)').matches
);
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e) => setIsDark(e.matches);

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);



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
    border: `1px solid ${isDark ? "#4b5563" : "#ccc"}`,
    borderRadius: "6px",
    backgroundColor: isDark ? "#374151" : "#fff", // dark gray-700
    color: isDark ? "#f9fafb" : "#000",
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
              backgroundColor: isDark ? "#1f2937" : "#ffffff", // dark gray-800 or white
    color: isDark ? "#f3f4f6" : "#1f2937",            // light text in dark, dark text in light
    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
    padding: "15px",
    borderRadius: "12px",
    boxShadow: isDark
      ? "0 2px 6px rgba(0,0,0,0.3)"
      : "0 2px 6px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s, color 0.3s",
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
