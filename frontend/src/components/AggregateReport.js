import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// const TotalActualByEntityChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:8000/api/total-actual-by-entity/') 
//       .then(response => response.json())
//       .then(json => setData(json))
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);

//  return (
//     <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-4xl mx-auto">
//       <h5 className="text-lg font-semibold mb-4">Total Actual by Entity</h5>
//       <div className="h-[400px]">
//         <ResponsiveContainer width="90%" height={400}>
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="entity_name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="total_actual" fill="#4c84ff" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default TotalActualByEntityChart;
const AggregateReport = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/aggregate-report/')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto mt-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Aggregate Report</h2>
      
      {/* Total Actual Across All Entities */}
      <div className="text-lg font-semibold text-gray-800 mb-4">
        Total Actual Across All Entities: <span className="text-blue-500">{data?.total_actual_all_entities}</span>
      </div>
      
      {/* Display sum for each entity */}
      {/* <div>
        <h3 className="font-medium text-gray-700">Sum by Entity:</h3>
        <ul>
          {data?.entities.map((entity_name, index) => (
            <li key={index} className="mb-2">
              {entity_name.entity_name}: <span className="font-semibold text-blue-500">{entity_name.total_actual}</span>
            </li>
          ))}
        </ul>
      </div> */}
      <ResponsiveContainer width="100%" height={300}>
  <BarChart data={data?.entities}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="entity_name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="total_actual" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>

    </div>
  );
};

export default AggregateReport;


