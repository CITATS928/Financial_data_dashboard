import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';

function App() {
  return (
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="*" element={<Login />} /> {/* Redirect to Login for any other route */}
  </Routes>
);
}

export default App;

