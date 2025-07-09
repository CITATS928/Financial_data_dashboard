import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function EntityListPage() {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/entities/")
      .then((res) => res.json())
      .then((data) => setEntities(data))
      .catch((err) => console.error("Error fetching entities:", err));
  }, []);

  return (
   <div className="w-100 vh-100 p-4" style={{ overflowY: "auto" }}>

      <h3 className="text-center mb-4">Churches</h3>
      <ul className="list-group">
        {entities.map((name, index) => (
          <li key={index} className="list-group-item">
            <Link to={`/entities/${encodeURIComponent(name)}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
