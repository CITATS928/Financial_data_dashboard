import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Sidebar({ collapsed, toggleSidebar }) {
  return (
    <div
      className="d-flex flex-column bg-dark text-white p-3"
      style={{
        width: collapsed ? "80px" : "240px",
        minHeight: "100vh",
        position: "fixed",
        transition: "width 0.3s ease",
      }}
    >
      {/* Toggle Button + Admin Tools Title */}
      <div className="d-flex align-items-center mb-3" style={{ gap: "0.5rem" }}>
        <button
          className="btn btn-light btn-sm p-1"
          style={{
            backgroundColor: "transparent",
            color: "white",
            border: "none",
            width: "32px",
            height: "32px",
            fontSize: "18px",
            lineHeight: "1",
            cursor: "pointer"
          }}          
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? "☰" : "☰"}
        </button>
        {!collapsed && (
          <h5 className="mb-0" style={{ lineHeight: "32px" }}>
            Admin Tools
          </h5>
        )}
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link text-white">
            <i className="bi bi-speedometer2 me-2"></i>
            {!collapsed && "Dashboard"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className="nav-link text-white">
            <i className="bi bi-person-circle me-2"></i>
            {!collapsed && "Profile"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/files" className="nav-link text-white">
            <i className="bi bi-folder2-open me-2"></i>
            {!collapsed && "Files"}
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/settings" className="nav-link text-white">
            <i className="bi bi-gear me-2"></i>
            {!collapsed && "Settings"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className="nav-link text-white">
            <i className="bi bi-box-arrow-right me-2"></i>
            {!collapsed && "Logout"}
          </NavLink>
        </li> */}
      </ul>
    </div>
  );
}
