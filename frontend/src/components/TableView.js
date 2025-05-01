import React, { useState } from "react";

export default function TableView({ data }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        No table data available
      </div>
    );
  }

  // Reserved for future use if highlighting is added
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
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
      <div className="d-flex justify-content-between align-items-center mb-2">
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
            <th>Entity</th>
            <th>Code</th>
            <th>Description</th>
            <th>YTD Actual</th>
            <th>Annual Budget</th>
            <th>% Used</th>
            <th>Type</th>
            <th>Category</th>
            {showAdvanced && (
              <>
                <th>Gross Profit</th>
                <th>EBITDA</th>
                <th>EBIT</th>
                <th>Profit Before Tax</th>
                <th>Profit for Period</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.entity_name}</td>
              <td>{row.account_code || "-"}</td>
              <td>{row.description}</td>
              <td>${parseFloat(row.ytd_actual).toFixed(2)}</td>
              <td>${parseFloat(row.annual_budget).toFixed(2)}</td>
              <td>{row.percent_used != null ? `${row.percent_used.toFixed(2)}%` : "-"}</td>
              <td>{row.item_type}</td>
              <td>{row.category || "-"}</td>
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


/*
================= Archived version from chore/merge_to_main (for reference) =================

import React, { useState } from "react";

export default function TableView({ data, searchQuery, searchColumn }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        No table data available
      </div>
    );
  }

  const highlightMatch = (text) => {
    if (!searchQuery) return text;
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
      <table className="table table-hover table-bordered align-middle mb-0">
        <thead className="table-primary text-center">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{searchColumn === "date" || searchColumn === "all" ? highlightMatch(row.date) : row.date}</td>
              <td>{searchColumn === "category" || searchColumn === "all" ? highlightMatch(row.category) : row.category}</td>
              <td>
                {searchColumn === "amount" || searchColumn === "all"
                  ? highlightMatch(`$${parseFloat(row.amount).toFixed(2)}`)
                  : `$${parseFloat(row.amount).toFixed(2)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

==========================================================================================
*/
