import React from "react";

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
