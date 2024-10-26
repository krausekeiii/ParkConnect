import React, { useState } from 'react';
import './SendNotifications.css';

const SendNotifications: React.FC = () => {
  const [message, setMessage] = useState('');
  const [milestoneVolunteers, setMilestoneVolunteers] = useState([
    { name: 'Alice', milestone: '100 Hours Volunteered' },
    { name: 'Bob', milestone: '5 Projects Completed' },
  ]);

  const handleSendNotification = () => {
    console.log('Sending notification:', message);
    setMessage(''); // Clear the message after sending
  };

  return (
    <div className="send-notifications-page">
      <h1>Send Notifications</h1>
      <p>Send updates, reminders, or congratulate volunteers on reaching milestones.</p>

      <h2>Volunteers Reaching Milestones</h2>
      <ul className="milestone-list">
        {milestoneVolunteers.map((volunteer, index) => (
          <li key={index}>
            <span className="milestone-icon">⭐</span>
            {volunteer.name} - {volunteer.milestone}
          </li>
        ))}
      </ul>

      <h2>Custom Message</h2>
      <textarea
        className="notification-input"
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button className="send-button" onClick={handleSendNotification}>
        Send Notification
      </button>
    </div>
  );
};

export default SendNotifications;
