import React, { useState, useEffect } from 'react';
import './SendNotifications.css';
import { sendNotification, getVolunteerStats, getAllUsers } from '../services/api';

const SendNotifications: React.FC = () => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | undefined>('all'); // Default to 'all'
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const parkID = 1; // Replace with the actual parkID
        const stats = await getAllUsers(); // Convert parkID to string

        if (stats) {
          setVolunteers(stats); // Populate volunteers from top3Users
        } else {
          setVolunteers([]);
          setErrorMessage('No volunteers found.');
        }
      } catch (err) {
        console.error('Error fetching volunteers:', err);
        setErrorMessage('Failed to fetch volunteers.');
      }
    };

    fetchVolunteers();
  }, []); // Fetch volunteers on component mount

  const handleSendNotification = async () => {
    try {
      if (!message || !subject) {
        setErrorMessage('Subject and message cannot be empty.');
        return;
      }

      const parkID = 1; // Replace with the actual park ID
      const payload = {
        parkID,
        subject,
        message,
        to: selectedVolunteer === 'all' ? 'all' : selectedVolunteer, // 'all' or specific email
      };

      const response = await sendNotification(payload);
      if (response.status === 200) {
        setSuccessMessage('Notification sent successfully!');
        setMessage('');
        setSubject('');
        setSelectedVolunteer('all'); // Reset to 'all'
        setErrorMessage(null);
      } else {
        throw new Error(response.data?.error || 'Failed to send notification.');
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      setErrorMessage('Failed to send notification.');
    }
  };

  return (
    <div className="send-notifications-page">
      <h1>Send Notifications</h1>
      <p>Send updates, reminders, or congratulate volunteers on reaching milestones.</p>

      <h2>Select Volunteer</h2>
      {volunteers.length > 0 ? (
        <select
          className="volunteer-dropdown"
          value={selectedVolunteer}
          onChange={(e) => setSelectedVolunteer(e.target.value || 'all')}
        >
          <option value="all">All Volunteers</option>
          {volunteers.map((volunteer, index) => (
            <option key={index} value={volunteer.email}>
              {volunteer.name || volunteer.email}
            </option>
          ))}
        </select>
      ) : (
        <p>No volunteers available.</p>
      )}

      <h2>Custom Notification</h2>
      <input
        className="notification-subject"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        className="notification-input"
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="send-button" onClick={handleSendNotification}>
        Send Notification
      </button>
    </div>
  );
};

export default SendNotifications;
