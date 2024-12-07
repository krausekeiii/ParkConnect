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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  return (
    <Router>
      <Header 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
        setUserName={setUserName}
        userName={userName} 
        userRole={userRole} 
      />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/impact-tracker" element={<ImpactTracker />} />
          <Route 
            path="/volunteer-signup" 
            element={<VolunteerSignup isAuthenticated={isAuthenticated} />} // Pass isAuthenticated prop
          />
          <Route 
            path="/login" 
            element={<Login setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} setUserRole={setUserRole} />} 
          />
          <Route 
            path="/signup" 
            element={<Signup setIsAuthenticated={setIsAuthenticated} setUserName={setUserName} />} 
          />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/manage-opportunities" element={<ManageOpportunities />} />
          <Route path="/volunteer-stats" element={<VolunteerStats />} />
          <Route path="/send-notifications" element={<SendNotifications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
