import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import "./Layout.css"; 


export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="d-flex">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}