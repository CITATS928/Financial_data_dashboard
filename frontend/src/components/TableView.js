import React, { useState } from "react";

export default function TableView({ data, searchQuery, searchColumn }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        No table data available
      </div>
    );
  }

  // Ensure no duplicates in data based on unique fields like account_code and description
  const uniqueData = data.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.account_code === value.account_code && t.description === value.description
    ))
  );

  const highlightMatch = (text) => {
    if (!searchQuery || !text) return text;
    const parts = text.toString().split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="table-responsive shadow rounded-3 overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-2"
      style={{ padding: "0.75rem 1rem" }}
      >
        <h5 className="mb-0">Financial Line Items</h5>
        <div>
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={showAdvanced}
            onChange={() => setShowAdvanced(!showAdvanced)}
            id="showAdvancedToggle"
          />
          <label className="form-check-label" htmlFor="showAdvancedToggle">
            Show Advanced Columns
          </label>
        </div>
      </div>

      <table className="table table-hover table-bordered align-middle mb-0">
        <thead className="table-primary text-center">
          <tr>
            <th style={{ padding: "12px 16px" }}>Entity</th>
            <th style={{ padding: "12px 16px" }}>Category</th>
            <th style={{ padding: "12px 16px" }}>Description</th>
            <th style={{ padding: "12px 16px" }}>Type</th>
            <th style={{ padding: "12px 16px" }}>Code</th>
            <th style={{ padding: "12px 16px" }}>YTD Actual</th>
            <th style={{ padding: "12px 16px" }}>Annual Budget</th>
            <th style={{ padding: "12px 16px" }}>% Used</th>
            {showAdvanced && (
              <>
                <th style={{ padding: "12px 16px" }}>Gross Profit</th>
                <th style={{ padding: "12px 16px" }}>EBITDA</th>
                <th style={{ padding: "12px 16px" }}>EBIT</th>
                <th style={{ padding: "12px 16px" }}>Profit Before Tax</th>
                <th style={{ padding: "12px 16px" }}>Profit for Period</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {uniqueData.map((row) => (
            <tr key={`${row.entity_name}-${row.account_code}`}>
              <td>
                {(searchColumn === "entity_name" || searchColumn === "all")
                  ? highlightMatch(row.entity_name)
                  : row.entity_name}
              </td>
              <td>
                {(searchColumn === "category" || searchColumn === "all")
                  ? highlightMatch(row.category || "-")
                  : row.category || "-"}
              </td>
              <td>
                {(searchColumn === "description" || searchColumn === "all")
                  ? highlightMatch(row.description)
                  : row.description}
              </td>
              <td>
                {(searchColumn === "item_type" || searchColumn === "all")
                  ? highlightMatch(row.item_type)
                  : row.item_type}
              </td>
              <td>
                {(searchColumn === "account_code" || searchColumn === "all")
                  ? highlightMatch(row.account_code || "-")
                  : row.account_code || "-"}
              </td>
              <td>
                {(searchColumn === "ytd_actual" || searchColumn === "all")
                  ? highlightMatch(`$${parseFloat(row.ytd_actual).toFixed(2)}`)
                  : `$${parseFloat(row.ytd_actual).toFixed(2)}`}
              </td>
              <td>
                {(searchColumn === "annual_budget" || searchColumn === "all")
                  ? highlightMatch(`$${parseFloat(row.annual_budget).toFixed(2)}`)
                  : `$${parseFloat(row.annual_budget).toFixed(2)}`}
              </td>
              <td
                style={{
                  color:
                    row.item_type === "expense"
                      ? row.percent_used >= 100
                        ? "red"
                        : row.percent_used > 89
                        ? "orange"
                        : "#2e7d32"
                      : row.item_type === "revenue"
                      ? "#00b894"
                      : "inherit"

                }}
              >
                {row.percent_used != null ? `${row.percent_used.toFixed(2)}%` : "-"}
              </td>
            
            
              {showAdvanced && (
                <>
                  <td>{row.gross_profit != null ? `$${row.gross_profit.toFixed(2)}` : "-"}</td>
                  <td>{row.ebitda != null ? `$${row.ebitda.toFixed(2)}` : "-"}</td>
                  <td>{row.ebit != null ? `$${row.ebit.toFixed(2)}` : "-"}</td>
                  <td>{row.profit_before_tax != null ? `$${row.profit_before_tax.toFixed(2)}` : "-"}</td>
                  <td>{row.profit_for_period != null ? `$${row.profit_for_period.toFixed(2)}` : "-"}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
