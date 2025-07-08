// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// function EntityListPage() {
//   const [entities, setEntities] = useState([]);

//   useEffect(() => {
//     // Fetch the list of entities from the backend
//     fetch('/api/entities/')
//       .then((response) => response.json())
//       .then((data) => setEntities(data));
//   }, []);

//   return (
//     <div>
//       <h1>Entities</h1>
//       <ul>
//         {entities.map((entity) => (
//           <li key={entity.id}>
//             <Link to={`/entities/${entity.id}`}>{entity.entity_name}</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default EntityListPage;
