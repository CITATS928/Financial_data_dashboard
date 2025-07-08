// // pages/EntityDetail.js
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// function EntityDetail() {
//   const { id } = useParams();
//   const [entity, setEntity] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`/api/entities/${id}/`)
//       .then((res) => res.json())
//       .then((data) => {
//         setEntity(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching entity:", err);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!entity) return <p>Entity not found.</p>;

//   return (
//     <div style={{ maxWidth: "700px", margin: "auto", padding: "20px" }}>
//       <h2 className="mb-4 text-primary">{entity.entity_name}</h2>
//       <ul className="list-group">
//         <li className="list-group-item"><strong>Account Code:</strong> {entity.account_code}</li>
//         <li className="list-group-item"><strong>Description:</strong> {entity.description}</li>
//         <li className="list-group-item"><strong>YTD Actual:</strong> ${entity.ytd_actual}</li>
//         <li className="list-group-item"><strong>Annual Budget:</strong> ${entity.annual_budget}</li>
//         <li className="list-group-item"><strong>Date:</strong> {entity.date}</li>
//         <li className="list-group-item"><strong>Category:</strong> {entity.category || "N/A"}</li>
//         <li className="list-group-item"><strong>Item Type:</strong> {entity.item_type}</li>
//         <li className="list-group-item"><strong>Expense Nature:</strong> {entity.expense_nature || "N/A"}</li>
//       </ul>
//     </div>
//   );
// }

// export default EntityDetail;
