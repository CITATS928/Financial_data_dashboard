// ChartsView.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartsView({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        No chart data available
      </div>
    );
  }

  // Sum ytd_actual by category
  const grouped = data.reduce((acc, item) => {
    const group = item.category || item.description || "Uncategorized";
    const value = parseFloat(item.ytd_actual);
    if (!isNaN(value)) {
      acc[group] = (acc[group] || 0) + value;
    }
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([label, value]) => ({
    name: label,
    value: Number(value.toFixed(2)),
  }));

  return (
    <div className="card shadow-sm rounded-3 p-4 mt-4">
      <h5 className="text-primary mb-4 text-center">YTD Actuals by Category</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="value" fill="#4c84ff" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
