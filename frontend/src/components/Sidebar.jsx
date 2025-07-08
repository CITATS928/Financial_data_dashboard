import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Sidebar.css";

export default function Sidebar({ collapsed, toggleSidebar }) {

  //theme
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // const [reportsOpen, setReportsOpen] = useState(false);


  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  //end of theme

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
          <NavLink to="/dashboard" className="nav-link">
            <i className="bi bi-speedometer2 me-2"></i>
            {!collapsed && "Dashboard"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className="nav-link">
            <i className="bi bi-person-circle me-2"></i>
            {!collapsed && "Profile"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/files" className="nav-link">
            <i className="bi bi-folder2-open me-2"></i>
            {!collapsed && "Files"}
          </NavLink>
        </li>
        
  {/* <div
    className="nav-link d-flex align-items-center justify-content-between"
    style={{ cursor: 'pointer' }}
    onClick={() => setReportsOpen(!reportsOpen)}
  >
    <span>
      <i className="bi bi bi-building me-2"></i>
      {!collapsed && "Churches"}
    </span>
    {!collapsed && (
      <i className={`bi ${reportsOpen ? "bi-chevron-up" : "bi-chevron-down"}`} />
    )}
  </div> */}

  {/* Submenu */}
  {/* {!collapsed && reportsOpen && (
    <ul className="list-unstyled ps-4">
      <li>
        <NavLink to="/report1" className="nav-link">Faith Community Center</NavLink>
      </li>
      <li>
        <NavLink to="/report2" className="nav-link">Saint Mark's Parish</NavLink>
      </li>
      <li>
        <NavLink to="/report3" className="nav-link">Trinity Outreach</NavLink>
      </li>
      <li>
        <NavLink to="/report4" className="nav-link">Grace Fellowship</NavLink>
      </li>
      <li>
        <NavLink to="/report5" className="nav-link">Hope Ministries</NavLink>
      </li>
    </ul>
  )}
</li> */}

        
      </ul>

      {/* Theme Toggle*/}
      <div className="theme-toggle-container">
      <div
        className={`theme-switch ${theme === "dark" ? "switch-on" : ""}`}
        onClick={toggleTheme}
        role="button"
        aria-label="Toggle Theme"
      >
        <div className="switch-knob"></div>
      </div>
      {!collapsed && (
        <span className="theme-label">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      )}
      </div>
      {/* end of Theme Toggle*/}

    </div>
  );
}
