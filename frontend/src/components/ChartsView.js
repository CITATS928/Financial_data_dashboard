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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#4c84ff", "#29cc97", "#ff5c5c", "#ffc107",
  "#9c27b0", "#00bcd4", "#e91e63", "#8bc34a"
];

export default function ChartsView({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="alert alert-secondary text-center">
        No chart data available
      </div>
    );
  }

  // Remove duplicates based on unique combination of 'entity_name', 'account_code', and 'description'
  const uniqueData = Array.from(
    new Map(
      data.map(item => [
        `${item.entity_name}-${item.account_code}-${item.description}`, item
      ])
    ).values()
  );

  const chartData = uniqueData
    .map((item) => {
      const value = parseFloat(item.ytd_actual);
      return {
        name: `${item.entity_name} - ${item.account_code} - ${item.description}`,
        value: isNaN(value) ? 0 : value,
      };
    })
    .filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        No valid YTD Actual values to display
      </div>
    );
  }

  return (
    <div className="card shadow-sm rounded-3 p-4 mt-4">
      <h5 className="text-primary mb-4 text-center">YTD Actual by Description</h5>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="value" name="YTD Actual" radius={[6, 6, 0, 0]} isAnimationActive={true} animationBegin={0} animationDuration={5000}>
            {chartData.map((_, index) => (
              <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart for YTD */}
      <h5 className="text-primary mt-5 mb-4 text-center">YTD Actual Distribution</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            dataKey="value" // corrected from ytd_actual
            nameKey="name"
            outerRadius={100}
            label
            animationDuration={5000}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Donut Chart */}
      <h5 className="text-primary mt-5 mb-4 text-center">Spending Distribution (Donut)</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            label
            animationDuration={5000}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-donut-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
