import React, { useState} from 'react';
import '../signup.css'; 
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePassword = (fieldId) => {
    const input = document.getElementById(fieldId);
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password1, password2 } = formData;

    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password: password1 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setSuccess('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="background">
      <div className="shape"></div>
      <div className="shape"></div>

      <form onSubmit={handleSubmit}>
        <h3>Signup Here</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password1">Password</label>
        <div className="password-container">
          <input
            type="password"
            placeholder="Password"
            id="password1"
            name="password1"
            value={formData.password1}
            onChange={handleChange}
            required
          />
          <span className="toggle-password" onClick={() => togglePassword('password1')}>
            <i className="fas fa-eye"></i>
          </span>
        </div>

        <label htmlFor="password2">Confirm Password</label>
        <div className="password-container" style={{ marginBottom: "20px" }}>
          <input
            type="password"
            placeholder="Confirm Password"
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            required
          />
          <span className="toggle-password" onClick={() => togglePassword('password2')}>
            <i className="fas fa-eye"></i>
          </span>
        </div>

        <button type="submit">Signup</button>
        <a href="/login">I already have an account</a>
      </form>
    </div>
  );
};

export default Signup;
