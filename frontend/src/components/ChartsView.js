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

  // Sum ytd_actual by category
  // const grouped = data.reduce((acc, item) => {
  //   const group = item.category || item.description || "Uncategorized";
  //   const value = parseFloat(item.ytd_actual);
  //   if (!isNaN(value)) {
  //     acc[group] = (acc[group] || 0) + value;
  //   }
  //   return acc;
  // }, {});

  // const chartData = Object.entries(grouped).map(([label, value]) => ({
  //   name: label,
  //   value: Number(value.toFixed(2)),
  // }));

  // return (
  //   <div className="card shadow-sm rounded-3 p-4 mt-4">
  //     <h5 className="text-primary mb-4 text-center">YTD Actuals by Category</h5>
      
  //     {/* Bar Chart */}
  //     <ResponsiveContainer width="100%" height={300}>
  //       <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
  //         <CartesianGrid strokeDasharray="3 3" />
  //         <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
  //         <YAxis tick={{ fontSize: 12 }} />
  //         <Tooltip formatter={(value) => `$${value}`} />
  //         <Legend wrapperStyle={{ fontSize: "12px" }} />
  //         <Bar dataKey="value" radius={[6, 6, 0, 0]}>
  //           {chartData.map((entry, index) => (
  //             <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
  //           ))}
  //         </Bar>
  //       </BarChart>
  //     </ResponsiveContainer>

  const chartData = data.map((item) => {
    const ytd_actual = parseFloat(item.ytd_actual);
    // const annual_budget = parseFloat(item.annual_budget);

    return {
      name: item.description || "Unnamed",
      value: isNaN(ytd_actual) ? 0 : ytd_actual,
    };
  });

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
          <Bar dataKey="value" name="YTD Actual" radius={[6, 6, 0, 0]}>
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
            dataKey="ytd_actual"
            nameKey="name"
            outerRadius={100}
            label
            animationDuration={1000}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
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
            fill="#8884d8"
            label
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/*
  // Original Version (Commented out for reference)

  <h5 className="text-primary mb-4 text-center">Spending by Category</h5>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="name"
        angle={-45}
        textAnchor="end"
        height={80}
        tick={{ fontSize: 12 }}
      />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip formatter={(value) => `$${value}`} />
      <Legend wrapperStyle={{ fontSize: "12px" }} />
      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
        {chartData.map((entry, index) => (
          <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
*/
