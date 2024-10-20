import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Add a console.log to confirm rendering
  console.log('Admin Dashboard rendered');

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Manage users and opportunities here.</p>
      <div className="admin-controls">
        <button onClick={() => navigate('/manage-users')}>Manage Users</button>
        <button onClick={() => navigate('/manage-opportunities')}>Manage Opportunities</button>
        <button onClick={() => navigate('/volunteer-stats')}>Volunteer Stats</button>
        <button onClick={() => navigate('/send-notifications')}>Send Notifications</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
