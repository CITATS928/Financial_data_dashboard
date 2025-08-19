import React, { useState } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";

export default function TableView({
  data,
  searchQuery,
  searchColumn,
  selectedEntity,
  setSelectedEntity,
  handleReset,
  setData,
  setFinancialData,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // ✅ Clears parent financial data state
  const clearAllData = () => {
    setFinancialData([]);
    setSelectedEntity("");
  };

  const uniqueEntities = Array.from(
    new Set(data.map((item) => item.entity_name))
  ).sort();

  const filteredData =
    selectedEntity === "All"
      ? data
      : data.filter((item) => item.entity_name === selectedEntity);

  const uniqueData = filteredData.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.account_code === value.account_code &&
          t.description === value.description
      )
  );

  const sortedData = [...uniqueData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === "number" && typeof valB === "number") {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }

    return sortConfig.direction === "asc"
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

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

  const formatCurrency = (value) =>
    isNaN(parseFloat(value)) ? "-" : `$${parseFloat(value).toFixed(2)}`;

  const columns = [
    { label: "Entity", key: "entity_name" },
    { label: "Category", key: "category" },
    { label: "Description", key: "description" },
    { label: "Type", key: "item_type" },
    { label: "Code", key: "account_code" },
    { label: "YTD Actual", key: "ytd_actual" },
    { label: "Annual Budget", key: "annual_budget" },
    { label: "% Used", key: "percent_used" },
  ];

  const advancedColumns = [
    { label: "Gross Profit", key: "gross_profit" },
    { label: "EBITDA", key: "ebitda" },
    { label: "EBIT", key: "ebit" },
    { label: "Profit Before Tax", key: "profit_before_tax" },
    { label: "Profit for Period", key: "profit_for_period" },
  ];

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div
          className="d-flex justify-content-between align-items-center flex-wrap gap-3"
          style={{ padding: "0.75rem 1rem" }}
        >
          <h5 className="mb-1" style={{ marginLeft: "-0.85rem" }}>
            Financial Line Items
          </h5>

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
            className="btn btn-sm btn-danger"
            style={{ width: "120px" }}
            onClick={handleReset}
          >
            Reset Filters
          </button>

          <button
            onClick={() => {
              setData([]);
              setFinancialData([]);
            }}
            className="btn btn-sm btn-danger"
            style={{ width: "120px" }}
          >
            Clear Data
          </button>

          <div className="form-check d-flex align-items-center m-0 ms-auto">
            <input
              type="checkbox"
              className="form-check-input m-0 me-2"
              checked={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
              id="showAdvancedToggle"
            />
            <label
              className="form-check-label m-0"
              htmlFor="showAdvancedToggle"
            >
              Show Advanced Columns
            </label>
          </div>
        </div>

        {/* ✅ Show message if no data */}
        {sortedData.length === 0 ? (
          <div className="alert alert-warning text-center mt-3">
            No table data available
          </div>
        ) : (
          <table className="table table-hover table-bordered align-middle mb-0">
            <thead className="text-center">
              <tr>
                {[...columns, ...(showAdvanced ? advancedColumns : [])].map(
                  ({ label, key }) => (
                    <th
                      key={key}
                      className="table-header cursor-pointer"
                      onClick={() => handleSort(key)}
                      style={{ userSelect: "none" }}
                    >
                      {label} {getSortIcon(key)}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => (
                <tr key={`${row.entity_name}-${row.account_code}`}>
                  <td>{highlightMatch(row.entity_name)}</td>
                  <td>{highlightMatch(row.category || "-")}</td>
                  <td>{highlightMatch(row.description)}</td>
                  <td>{highlightMatch(row.item_type)}</td>
                  <td>{highlightMatch(row.account_code || "-")}</td>
                  <td>{highlightMatch(formatCurrency(row.ytd_actual))}</td>
                  <td>{highlightMatch(formatCurrency(row.annual_budget))}</td>
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
                          : "inherit",
                    }}
                  >
                    {row.percent_used != null
                      ? `${row.percent_used.toFixed(2)}%`
                      : "-"}
                  </td>
                  {showAdvanced && (
                    <>
                      <td>{formatCurrency(row.gross_profit)}</td>
                      <td>{formatCurrency(row.ebitda)}</td>
                      <td>{formatCurrency(row.ebit)}</td>
                      <td>{formatCurrency(row.profit_before_tax)}</td>
                      <td>{formatCurrency(row.profit_for_period)}</td>
                    </>
                  )}
                </tr>
              ))}
              <tr className="table-footer-row">
                <td colSpan="5" className="text-end pe-3">
                  Totals:
                </td>
                <td>
                  {formatCurrency(
                    sortedData.reduce(
                      (sum, row) => sum + (parseFloat(row.ytd_actual) || 0),
                      0
                    )
                  )}
                </td>
                <td>
                  {formatCurrency(
                    sortedData.reduce(
                      (sum, row) => sum + (parseFloat(row.annual_budget) || 0),
                      0
                    )
                  )}
                </td>
                <td>-</td>
                {showAdvanced && (
                  <>
                    <td>
                      {formatCurrency(
                        sortedData.reduce(
                          (sum, row) =>
                            sum + (parseFloat(row.gross_profit) || 0),
                          0
                        )
                      )}
                    </td>
                    <td>
                      {formatCurrency(
                        sortedData.reduce(
                          (sum, row) => sum + (parseFloat(row.ebitda) || 0),
                          0
                        )
                      )}
                    </td>
                    <td>
                      {formatCurrency(
                        sortedData.reduce(
                          (sum, row) => sum + (parseFloat(row.ebit) || 0),
                          0
                        )
                      )}
                    </td>
                    <td>
                      {formatCurrency(
                        sortedData.reduce(
                          (sum, row) =>
                            sum + (parseFloat(row.profit_before_tax) || 0),
                          0
                        )
                      )}
                    </td>
                    <td>
                      {formatCurrency(
                        sortedData.reduce(
                          (sum, row) =>
                            sum + (parseFloat(row.profit_for_period) || 0),
                          0
                        )
                      )}
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
