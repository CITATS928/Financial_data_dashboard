import React, { useState } from "react";


export default function TableView({ data, searchQuery, searchColumn, handleReset }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("All");

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        No table data available
      </div>
    );
  }

  const uniqueEntities = Array.from(new Set(data.map(item => item.entity_name))).sort();

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
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3"
          style={{ padding: "0.75rem 1rem" }}>
            <h5 className="mb-1" style={{ marginLeft: "-0.85rem" }}>Financial Line Items</h5>
            <select
              className="form-select form-select-sm"
              style={{ width: "180px" }}
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
            >
              <option value="All">All Churches</option>
              {uniqueEntities.map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </select>

            <button
              className="btn btn-outline-danger btn-sm me-auto"
              style={{ width: "60px" }}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          <div className="form-check d-flex align-items-center m-0 ms-auto" style={{ transform: "translate(820px, -38px)" }}>
            <input
              type="checkbox"
              className="form-check-input m-0 me-2"
              checked={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
              id="showAdvancedToggle"
              style={{ transform: "translateY(1px)" }}
            />
            <label
              className="form-check-label m-0"
              htmlFor="showAdvancedToggle"
              style={{ lineHeight: "1.2" }}
            >
              Show Advanced Columns
            </label>
          </div>
        </div>
      {/* </div> */}

      <table className="table table-hover table-bordered align-middle mb-0">
        <thead className="text-center">
          <tr>
            {["Entity", "Category", "Description", "Type", "Code", "YTD Actual", "Annual Budget", "% Used"]
              .map(label => (
                <th key={label} className="table-header">{label}</th>
              ))}
            {showAdvanced && ["Gross Profit", "EBITDA", "EBIT", "Profit Before Tax", "Profit for Period"]
              .map(label => (
                <th key={label} className="table-header">{label}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {uniqueData.map((row) => (
            <tr key={`${row.entity_name}-${row.account_code}`}>
              <td>{searchColumn === "entity_name" || searchColumn === "all" ? highlightMatch(row.entity_name) : row.entity_name}</td>
              <td>{searchColumn === "category" || searchColumn === "all" ? highlightMatch(row.category || "-") : row.category || "-"}</td>
              <td>{searchColumn === "description" || searchColumn === "all" ? highlightMatch(row.description) : row.description}</td>
              <td>{searchColumn === "item_type" || searchColumn === "all" ? highlightMatch(row.item_type) : row.item_type}</td>
              <td>{searchColumn === "account_code" || searchColumn === "all" ? highlightMatch(row.account_code || "-") : row.account_code || "-"}</td>
              <td>{searchColumn === "ytd_actual" || searchColumn === "all" ? highlightMatch(`$${parseFloat(row.ytd_actual).toFixed(2)}`) : `$${parseFloat(row.ytd_actual).toFixed(2)}`}</td>
              <td>{searchColumn === "annual_budget" || searchColumn === "all" ? highlightMatch(`$${parseFloat(row.annual_budget).toFixed(2)}`) : `$${parseFloat(row.annual_budget).toFixed(2)}`}</td>
              <td style={{
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
              }}>
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
          <tr className="table-footer-row">
            <td colSpan="5" className="text-end pe-3">Totals:</td>
            <td>${uniqueData.reduce((sum, row) => sum + (parseFloat(row.ytd_actual) || 0), 0).toFixed(2)}</td>
            <td>${uniqueData.reduce((sum, row) => sum + (parseFloat(row.annual_budget) || 0), 0).toFixed(2)}</td>
            <td>-</td>
            {showAdvanced && (
              <>
                <td>${uniqueData.reduce((sum, row) => sum + (parseFloat(row.gross_profit) || 0), 0).toFixed(2)}</td>
                <td>${uniqueData.reduce((sum, row) => sum + (parseFloat(row.ebitda) || 0), 0).toFixed(2)}</td>
                <td>${uniqueData.reduce((sum, row) => sum + (parseFloat(row.ebit) || 0), 0).toFixed(2)}</td>
                <td>${uniqueData.reduce((sum, row) => sum + (parseFloat(row.profit_before_tax) || 0), 0).toFixed(2)}</td>
                <td>${uniqueData.reduce((sum, row) => sum + (parseFloat(row.profit_for_period) || 0), 0).toFixed(2)}</td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}