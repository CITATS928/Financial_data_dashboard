import React, { useState } from "react";
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

// Theme helper
const getThemeStyles = () => {
  const theme = document.body.dataset.theme || "light";
  const isDark = theme === "dark";
  return {
    bgColor: isDark ? "#333" : "#fff",
    textColor: isDark ? "#fff" : "#000",
    borderColor: isDark ? "#555" : "#ccc"
  };
};

const COLORS = [
  "#4c84ff", "#29cc97", "#ff5c5c", "#ffc107",
  "#9c27b0", "#00bcd4", "#e91e63", "#8bc34a"
];

const chartTabs = ["Bar", "Pie", "Donut", "Utilization"];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { bgColor, textColor, borderColor } = getThemeStyles();
    const { name, value } = payload[0];
    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          padding: "8px",
          borderRadius: "6px",
          fontSize: "0.875rem"
        }}
      >
        <p className="mb-0 fw-bold">{name}</p>
        <p className="mb-0">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
};

const ThemedBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { bgColor, textColor, borderColor } = getThemeStyles();
    const { value } = payload[0];
    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          padding: "8px",
          borderRadius: "6px",
          fontSize: "0.875rem",
          maxWidth: "300px"
        }}
      >
        <strong>{label}</strong>
        <div>YTD Actual: ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
      </div>
    );
  }
  return null;
};

const ThemedUtilizationTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { bgColor, textColor, borderColor } = getThemeStyles();
    const { value } = payload[0];
    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          padding: "8px",
          borderRadius: "6px",
          fontSize: "0.875rem"
        }}
      >
        <div><strong>{label}</strong></div>
        <div>% Used: {value.toFixed(2)}%</div>
      </div>
    );
  }
  return null;
};

export default function ChartsView({ data, selectedChurch }) {
  const [activeTab, setActiveTab] = useState("Bar");

  const filteredData =
    selectedChurch && selectedChurch !== "All Churches"
      ? data.filter(item => item.entity_name === selectedChurch)
      : data;

  if (!Array.isArray(filteredData) || filteredData.length === 0) {
    return <div className="alert alert-secondary text-center">No chart data available</div>;
  }

  const uniqueData = Array.from(
    new Map(filteredData.map(item => [
      `${item.entity_name}-${item.account_code}-${item.description}`, item
    ])).values()
  );

  const chartData = uniqueData
    .map(item => ({
      name: `${item.entity_name} - ${item.account_code} - ${item.description}`,
      value: parseFloat(item.ytd_actual) || 0
    }))
    .filter(item => item.value > 0);

  const MAX_PIE_SLICES = 12;
  const topChartData = chartData
    .sort((a, b) => b.value - a.value)
    .slice(0, MAX_PIE_SLICES);

  const utilizationData = uniqueData
    .filter(item =>
      item.item_type !== "revenue" &&
      item.expense_nature !== "depreciation" &&
      item.expense_nature !== "amortization" &&
      item.annual_budget > 0
    )
    .map(item => ({
      name: item.description,
      percent_used: (parseFloat(item.ytd_actual) / parseFloat(item.annual_budget)) * 100 || 0,
      type: item.item_type
    }))
    .sort((a, b) => b.percent_used - a.percent_used);

  const totalRevenue = uniqueData
    .filter(item => item.item_type === "revenue")
    .reduce((sum, item) => sum + parseFloat(item.ytd_actual || 0), 0);

  const totalExpenses = uniqueData
    .filter(item =>
      item.item_type === "expense" &&
      item.expense_nature !== "depreciation" &&
      item.expense_nature !== "amortization"
    )
    .reduce((sum, item) => sum + parseFloat(item.ytd_actual || 0), 0);

  const totalDepreciation = uniqueData
    .filter(item => item.expense_nature === "depreciation")
    .reduce((sum, item) => sum + parseFloat(item.ytd_actual || 0), 0);

  const totalAmortization = uniqueData
    .filter(item => item.expense_nature === "amortization")
    .reduce((sum, item) => sum + parseFloat(item.ytd_actual || 0), 0);

  const EBIT = totalRevenue - totalExpenses - totalDepreciation - totalAmortization;
  const EBITDA = EBIT + totalDepreciation + totalAmortization;

  return (
    <div className="card shadow-sm rounded-3 p-4 mt-4 entity-chart-box">
      <h5 className="text-primary mb-3 text-center">Charts</h5>

      {/* Tabs */}
      <div className="d-flex justify-content-center mb-4">
        {chartTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn mx-1 ${activeTab === tab ? "btn-primary" : "btn-outline-primary"}`}
          >
            {tab} Chart
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      {activeTab === "Bar" && (
        <>
          <h5 className="text-primary mb-4 text-center">YTD Actual by Description</h5>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<ThemedBarTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="value" name="YTD Actual" radius={[6, 6, 0, 0]} animationDuration={1500}>
                {chartData.map((_, i) => (
                  <Cell key={`bar-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Pie Chart */}
      {activeTab === "Pie" && (
        <>
          <h5 className="text-primary mt-4 mb-4 text-center">YTD Actual Distribution</h5>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={topChartData}
                cx="50%"
                cy="50%"
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label={({ value }) => `$${value.toLocaleString()}`}
                animationDuration={1500}
              >
                {topChartData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Donut Chart */}
      {activeTab === "Donut" && (
        <>
          <h5 className="text-primary mt-4 mb-4 text-center">Spending Distribution (Donut)</h5>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={topChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                dataKey="value"
                nameKey="name"
                label={({ value }) => `$${value.toLocaleString()}`}
                animationDuration={1500}
              >
                {topChartData.map((_, i) => (
                  <Cell key={`cell-donut-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Utilization Chart */}
      {activeTab === "Utilization" && (
        <>
          <h5 className="text-primary mt-4 mb-4 text-center">% of Budget Used by Line Item</h5>
          <ResponsiveContainer width="100%" height={700}>
            <BarChart data={utilizationData} layout="vertical" margin={{ top: 10, right: 30, left: 120, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax + 20']} tickFormatter={val => `${val}%`} ticks={[0, 25, 50, 75, 100, 125, 150, 200]} />
              <YAxis type="category" dataKey="name" width={215} />
              <Tooltip content={<ThemedUtilizationTooltip />} />
              <Legend />
              <Bar dataKey="percent_used" name="% Used" radius={[0, 6, 6, 0]} animationDuration={1500}>
                {utilizationData.map((item, i) => {
                  let color = "#2e7d32"; // green
                  if (item.type === "expense") {
                    if (item.percent_used >= 100) color = "red";
                    else if (item.percent_used > 89) color = "orange";
                  } else if (item.type === "revenue") {
                    color = "#00b894";
                  }
                  return <Cell key={`cell-${i}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="d-flex justify-content-center mb-3 flex-wrap gap-3">
            <span className="badge rounded-pill" style={{ backgroundColor: "red", color: "white" }}>Over Budget (≥ 100%)</span>
            <span className="badge rounded-pill" style={{ backgroundColor: "orange", color: "black" }}>Near Limit (90–99%)</span>
            <span className="badge rounded-pill" style={{ backgroundColor: "#2e7d32", color: "white" }}>Under Budget (≤ 89%)</span>
          </div>
        </>
      )}

      <div className="mt-0">
        <h5 className="text-primary mb-3 text-center">Calculations</h5>
        <div className="d-flex justify-content-center flex-column align-items-center">
          <p><strong>Total Revenue:</strong> ${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          <p><strong>Total Expenses (Cash Operating Only):</strong> ${totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          <p><strong>EBIT:</strong> ${EBIT.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          <p><strong>EBITDA:</strong> ${EBITDA.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      </div>
    </div>
  );
}
