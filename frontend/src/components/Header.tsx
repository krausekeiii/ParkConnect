import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  isAuthenticated: boolean;
  handleLogout: () => void;
  userName: string;
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, handleLogout, userName, userRole }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/'); // Redirect to Home after logout
  };

  const handleProfile = () => navigate('/profile');
  const handleLoginNav = () => navigate('/login');
  const handleSignupNav = () => navigate('/signup');

  return (
    <header>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/">Home</Link>
          <Link to="/opportunities">Opportunities</Link>
          <Link to="/volunteer-signup">Volunteer Signup</Link>
          <Link to="/impact-tracker">Impact Tracker</Link>
          {isAuthenticated && userRole === 'admin' && (
            <Link to="/admin-dashboard" className="btn admin-btn">Admin Dashboard</Link>
          )}
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <span className="welcome-message">Welcome, {userName}</span>
              <button onClick={handleProfile} className="btn profile-btn">Profile</button>
              <button onClick={handleLogoutClick} className="btn logout-btn">Logout</button>
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
