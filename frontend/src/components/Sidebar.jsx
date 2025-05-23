import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Sidebar.css";

export default function Sidebar({ collapsed, toggleSidebar }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="d-flex align-items-center mb-3" style={{ gap: "0.5rem" }}>
        <button
          className="sidebar-toggle"
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
      </ul>
    </div>
  );
}
