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
        setData(formatted);
      })
      .catch(err => console.error('Error:', err));
  }, [view, entityName]);

  return (
    //<div className="p-4 bg-white shadow rounded-lg max-w-4xl mx-auto">
    <div className="entity-chart-box card p-4 rounded-lg shadow max-w-4xl mx-auto">
     <h5 className="text-xl font-bold text-gray-700 mb-4">Quarterly/Yearly Report</h5>
      <div className="mb-4">
  {/* <button
    onClick={() => setView(view === 'yearly' ? 'quarterly' : 'yearly')}
    className="btn-toggle-view px-0 py-0 text-sm bg-blue-600rounded-md hover:bg-blue-700 transition duration-200"
  >
    Click to {view === 'yearly' ? 'Quarterly view' : 'Yearly view'}
  </button> */}
</div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip 
    formatter={(value, name, props) => {
    const formattedValue = Number(value);
    return !isNaN(formattedValue) ? formattedValue.toFixed(2) : value;
  }}
/>
          <Legend />
          <Bar dataKey="total_actual" fill="#4F46E5" />
        </BarChart>
         {/* <h4>Current view: {view}</h4> */}
      </ResponsiveContainer>
    </div>
  );
};

export default EntityBarChart;
