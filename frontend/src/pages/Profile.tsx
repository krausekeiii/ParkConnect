import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';

const Profile: React.FC = () => {
  const [volunteerActivities, setVolunteerActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVolunteerHistory = async () => {
      try {
        // Retrieve the logged-in user's email dynamically
        const email = localStorage.getItem('userEmail');

        if (!email) {
          throw new Error('User email not found. Please log in again.');
        }

        const response = await axios.get(
          `http://localhost:5000/api/user/opps?email=${email}`
        );
        setVolunteerActivities(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching volunteer activities:', err);
        setError(err.message || 'Failed to load volunteer activities.');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerHistory();
  }, []);

  if (loading) return <p>Loading volunteer activities...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <div className="profile-section">
        <h2>Volunteer Activities</h2>
        {volunteerActivities.length === 0 ? (
          <p>No volunteer activities found.</p>
        ) : (
          <table className="activity-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Park</th>
              </tr>
            </thead>
            <tbody>
              {volunteerActivities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.name}</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                  <td>{activity.hours_req}</td>
                  <td>{activity.park}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Profile;
