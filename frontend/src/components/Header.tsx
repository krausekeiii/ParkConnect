import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/opportunities">Opportunities</Link>
        <Link to="/opportunity-details">Opportunity Details</Link>
        <Link to="/volunteer-signup">Volunteer Signup</Link>
        <Link to="/admin-dashboard">Admin Dashboard</Link>
        <Link to="/impact-tracker">Impact Tracker</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  );
};

export default Header;

