import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const TotalActualByEntityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/total-actual-by-entity/') // ✅ Adjust to your Django URL
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

 return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-4xl mx-auto">
      <h5 className="text-lg font-semibold mb-4">Total Actual by Entity</h5>
      <div className="h-[400px]">
        <ResponsiveContainer width="90%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="entity_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_actual" fill="#4c84ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalActualByEntityChart;
