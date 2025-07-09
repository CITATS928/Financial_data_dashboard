import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Files from "./components/Files";
import Layout from "./components/Layout";
import EntityListPage from "./components/EntityListPage";
import EntityDetail from "./components/EntityDetail";

function App() {
  return (
    <Routes>
    <Route path="/" element={<Login />} />
    {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    <Route path="/signup" element={<Signup />} />
    
    {/* Sidebar layout wrapper */}
    <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/files" element={<Files />} />

         <Route path="/entities" element={<EntityListPage />} />
        <Route path="/entities/:id" element={<EntityDetail />} />
      </Route>

    <Route path="*" element={<Login />} /> {/* Redirect to Login for any other route */}
  </Routes>
);
}

export default App;

