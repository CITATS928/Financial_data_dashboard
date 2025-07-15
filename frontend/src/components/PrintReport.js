import React from "react";
import './PrintReport.css';

const formatCurrency = (val) =>
  isNaN(parseFloat(val)) ? "-" : `$${parseFloat(val).toFixed(2)}`;

export default function PrintReport({ data, selectedEntity }) {
  const seen = new Set();
  const filtered = data.filter((row) => {
    const key = `${row.entity_name}-${row.account_code}-${row.description}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Group rows by category
  const groupedByCategory = filtered.reduce((acc, row) => {
    const category = row.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(row);
    return acc;
  }, {});

  const totalYTD = filtered.reduce((sum, r) => sum + (parseFloat(r.ytd_actual) || 0), 0);
  const totalBudget = filtered.reduce((sum, r) => sum + (parseFloat(r.annual_budget) || 0), 0);

  return (
    <div className="print-only">
      <div className="header">Diocese of Delaware Financial Report</div>
      <div className="subheader">
        {selectedEntity === "All" ? "All Churches" : selectedEntity}
      </div>

      {Object.entries(groupedByCategory).map(([category, rows], idx) => (
        <div key={idx} className="category-block">
          <div className="category-title">{category}</div>
          <div className="horizontal-row-container">
            {rows.map((row, i) => (
              <div key={i} className="side-block">
                <div><span className="label">Description:</span> {row.description}</div>
                <div><span className="label">Account Code:</span> {row.account_code}</div>
                <div><span className="label">Type:</span> {row.item_type}</div>
                <div><span className="label">YTD Actual:</span> {formatCurrency(row.ytd_actual)}</div>
                <div><span className="label">Annual Budget:</span> {formatCurrency(row.annual_budget)}</div>
                <div><span className="label">% Used:</span> {row.percent_used != null ? `${row.percent_used.toFixed(2)}%` : "-"}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="totals">
        <strong>YTD Actual:</strong> {formatCurrency(totalYTD)} &nbsp;&nbsp;
        <strong>Annual Budget:</strong> {formatCurrency(totalBudget)}
      </div>
    </div>
  );
}