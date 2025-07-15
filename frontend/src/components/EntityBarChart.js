import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const EntityBarChart = ({ entityName }) => {
  const [view, setView] = useState('yearly');
  const [data, setData] = useState([]);

  useEffect(() => {
    const endpoint = view === 'yearly'
      ? `/api/entity-yearly-actual/${entityName}/`
      : `/api/entity-quarterly-actual/${entityName}/`;

    axios.get(endpoint)
      .then(res => {
        const formatted = res.data.map(d => ({
          ...d,
          label: view === 'yearly' ? `${d.year}` : `${d.year} Q${d.quarter}`
        }));
         console.log("Formatted data:", formatted);  // Log the data to check
        setData(formatted);
      })
      .catch(err => console.error('Error:', err));
  }, [view, entityName]);

  const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const tooltipStyle = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',       
    color: isDark ? '#f3f4f6' : '#1f2937',                 
    border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, 
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  const labelStyle = {
    fontWeight: 600,
    marginBottom: '4px',
  };

  const valueStyle = {
    color: isDark ? '#60a5fa' : '#3b82f6', 
  };
  

  return (
    <div style={tooltipStyle}>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>Total Actual: ${Number(payload[0].value).toFixed(2)}</p>
    </div>
  );
};


  return (
    //<div className="p-4 bg-white shadow rounded-lg max-w-4xl mx-auto">
    <div className="entity-chart-box card p-4 rounded-lg shadow max-w-4xl mx-auto">

      <div className="mb-4">
  <button
    onClick={() => setView(view === 'yearly' ? 'quarterly' : 'yearly')}
    className="btn-toggle-view px-0 py-0 text-sm bg-blue-600 text-black rounded-md hover:bg-blue-700 transition duration-200"
  >
    Click to {view === 'yearly' ? 'Quarterly' : 'Yearly'}
  </button>
</div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
          <Bar dataKey="total_actual" fill="#4F46E5" />
        </BarChart>
         {/* <h4>Current view: {view}</h4> */}
      </ResponsiveContainer>
    </div>
  );
};

export default EntityBarChart;