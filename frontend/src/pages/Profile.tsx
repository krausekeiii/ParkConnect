import React, { useState } from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  // Ex
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('jdoe@gmail.com');
  const [isEditing, setIsEditing] = useState(false); 

  // Ex
  const [volunteerActivities] = useState([
    { id: 1, task: 'Trail Cleanup', date: 'August 15, 2024', hours: 5 },
    { id: 2, task: 'Visitor Center Assistance', date: 'September 7, 2024', hours: 3 },
  ]);

  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false); 
  };

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>

      <div className="profile-section">
        <h2>Personal Information</h2>

        {isEditing ? (
          <form onSubmit={handleSave} className="edit-profile-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <button type="submit" className="btn save-btn">Save</button>
            <button type="button" className="btn cancel-btn" onClick={handleEditToggle}>
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <button className="btn edit-btn" onClick={handleEditToggle}>Edit Information</button>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>Volunteer Activities</h2>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Date</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {volunteerActivities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.task}</td>
                <td>{activity.date}</td>
                <td>{activity.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
