import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Import Header CSS

const Header: React.FC<{ isAuthenticated: boolean, handleLogout: () => void, userName: string }> = ({ isAuthenticated, handleLogout, userName }) => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleLoginNav = () => {
    navigate('/login');
  };

  const handleSignupNav = () => {
    navigate('/signup');
  };

  return (
    <header>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/">Home</Link>
          <Link to="/opportunities">Opportunities</Link>
          <Link to="/volunteer-signup">Volunteer Signup</Link>
          <Link to="/impact-tracker">Impact Tracker</Link>
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <span className="welcome-message">Welcome, {userName}</span>
              <button onClick={handleProfile} className="btn profile-btn">Profile</button>
              <button onClick={handleLogout} className="btn logout-btn">Logout</button>
            </>
          ) : (
            <>
              <button onClick={handleLoginNav} className="btn login-btn">Login</button>
              <button onClick={handleSignupNav} className="btn signup-btn">Signup</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
