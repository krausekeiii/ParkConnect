import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ImpactTracker from './pages/ImpactTracker';
import VolunteerSignup from './pages/VolunteerSignup';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import ManageUsers from './pages/ManageUsers';
import ManageOpportunities from './pages/ManageOpportunities';
import VolunteerStats from './pages/VolunteerStats';
import SendNotifications from './pages/SendNotifications';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state
  const [userName, setUserName] = useState(''); // Store user's name

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName(''); // Clear username on logout
  };

  return (
    <Router>
      <Header 
        isAuthenticated={isAuthenticated} 
        handleLogout={handleLogout} 
        userName={userName} // Pass userName to Header
      />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/impact-tracker" element={<ImpactTracker />} />
          <Route path="/volunteer-signup" element={<VolunteerSignup />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route 
            path="/signup" 
            element={<Signup setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />} // Pass setUserName to Signup
          />
          <Route path="/manage-users" element={<ManageUsers />} /> {/* New routes */}
          <Route path="/manage-opportunities" element={<ManageOpportunities />} />
          <Route path="/volunteer-stats" element={<VolunteerStats />} />
          <Route path="/send-notifications" element={<SendNotifications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
