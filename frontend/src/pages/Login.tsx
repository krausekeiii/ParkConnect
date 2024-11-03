import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC<{ setIsAuthenticated: (value: boolean) => void; setUserName: (name: string) => void; setUserRole: (role: string) => void }> = ({ setIsAuthenticated, setUserName, setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'admin@parkconnect.com' && password === 'admin123') {
      setIsAuthenticated(true);
      setUserName('Admin');
      setUserRole('admin');
      navigate('/admin-dashboard');
    } else {
      setIsAuthenticated(true);
      setUserName('User');
      setUserRole('user');
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
