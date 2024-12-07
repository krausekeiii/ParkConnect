import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { signupUser } from '../services/api';

const Signup: React.FC<{ setIsAuthenticated: (value: boolean) => void, setUserName: (name: string) => void }> = ({ setIsAuthenticated, setUserName }) => {
  const [name, setName] = useState('');
  const [userName, setUserNameField] = useState(''); // Camel case
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState(''); // New description field
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
  
    try {
      const response = await signupUser(userName, email, password, name, description);
      if (response.error) {
        setError(response.error);
      } else {
        setIsAuthenticated(true);
        setUserName(name);
  
        // Store user email in localStorage for session consistency
        localStorage.setItem('userEmail', email);
  
        navigate('/', { state: { successMessage: 'Signup was successful!' } });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };  

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserNameField(e.target.value)} // Camel case handling
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Short Bio (Description):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
