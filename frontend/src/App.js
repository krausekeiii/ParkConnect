import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ImpactTracker from './pages/ImpactTracker';
import VolunteerSignup from './pages/VolunteerSignup';
import OpportunityDetails from './pages/OpportunityDetails';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/impact" element={<ImpactTracker />} />
          <Route path="/signup" element={<VolunteerSignup />} />
          <Route path="/opportunity-details" element={<OpportunityDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

