import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="d-flex">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div className="container-fluid" style={{ marginLeft: collapsed ? "80px" : "240px", padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}