import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
const COLORS = [
  "#4c84ff", "#29cc97", "#ff5c5c", "#ffc107",
  "#9c27b0", "#00bcd4", "#e91e63", "#8bc34a"
];

 const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const rawValue = Number(payload[0].value);
    const value = rawValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const tooltipStyle = {
      backgroundColor: isDark ? '#1f2937' : '#ffffff', 
      color: isDark ? '#f9fafb' : '#1f2937',           
      border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, 
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    };

    const labelStyle = {
      fontWeight: '600',
      marginBottom: '4px',
    };

    const valueStyle = {
      color: isDark ? '#60a5fa' : '#3b82f6', 
      marginTop: '4px',
    };

    return (
      <div style={tooltipStyle}>
        <p style={labelStyle}>{label}</p>
        <p style={valueStyle}>Total Actual: ${value}</p>
      </div>
    );
  }
  return null;
};
const AggregateReport = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/aggregate-report/')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
const roundedEntities = data?.entities?.map((entry) => ({
    ...entry,
    total_actual: parseFloat(parseFloat(entry.total_actual).toFixed(2))
  }));
 

  return (
    <div className="aggregate-box  p-4 bg-white rounded-1g shadow max-w-4xl mx-auto">
      <div className="mb-4">
      <h5 className="text-xl font-bold text-gray-700 mb-4">Aggregate Report</h5>
      
      
      <div className="text-lg font-bold text-gray-800 mb-4 mt-4">
       <span className="mr-2">Total Actual Across All Entities:</span>
       <span className="text-blue-500">
         {parseFloat(data?.total_actual_all_entities)?.toFixed(2)}
       </span>
     </div>
</div>
      
      <ResponsiveContainer width="90%" height={300}>
      <BarChart data={roundedEntities}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="entity_name" />
      <YAxis  tickFormatter={(value) => Math.round(value)} />
      <Tooltip content={<CustomTooltip />} />

      <Legend />
      <Bar dataKey="total_actual" name="Total Actual" barSize={50} radius={[4, 4, 0, 0]}  > {roundedEntities?.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
      ))}
        </Bar>
      </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default AggregateReport;

