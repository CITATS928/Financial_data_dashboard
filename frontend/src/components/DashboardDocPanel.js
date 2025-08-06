import React from "react";

export default function DashboardDocPanel({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        right: "20px",
        width: "340px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 10000,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "14px",
        color: "#333",
      }}
    >
      <button
        onClick={onClose}
        style={{
          float: "right",
          border: "none",
          background: "none",
          fontSize: "20px",
          cursor: "pointer",
          fontWeight: "bold",
          lineHeight: "1",
          padding: 0,
          marginBottom: "10px",
        }}
        aria-label="Close documentation panel"
        title="Close"
      >
        ×
      </button>

      <h4 style={{ marginTop: 0, marginBottom: "10px", color: "#222" }}>
        Dashboard Help
      </h4>

      <p>Welcome to the Diocese of DE Dashboard! Here's how to get started:</p>

      <ul style={{ paddingLeft: "20px", lineHeight: "1.5" }}>
        <li>
          <strong>Upload CSV files:</strong> Click <em>Choose Files</em> to add new data and then click <em>Upload CSV</em> . Supported file format: CSV.
        </li>
        <li>
          <strong>Filter your data:</strong> Use the <em>Include</em> and <em>Exclude</em> search boxes to quickly find or omit records based on keywords.
        </li>
        <li>
          <strong>Choose columns:</strong> Select specific columns to search within from the dropdown.
        </li>
        <li>
          <strong>View charts:</strong> Toggle charts below the table to visualize data trends and summaries.
        </li>
        <li>
          <strong>Entities:</strong> Use the entity selector to focus on a particular entity’s data.
        </li>
      
      </ul>

      
    </div>
  );
}

