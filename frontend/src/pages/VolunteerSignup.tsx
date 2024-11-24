import React, { useState } from 'react';
import './VolunteerSignup.css';
import { signupVolunteer } from '../services/api';

const VolunteerSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [opportunityId, setOpportunityId] = useState('');
  const [info, setInfo] = useState('');
  const [message, setMessage] = useState('');

  const handleVolunteerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: any = await signupVolunteer(name, email, opportunityId, info); // Add correct type
      setMessage(response.message || 'Signup successful!');
    } catch (error) {
      setMessage('An error occurred while signing up.');
    }
  };

  return (
    <div className="signup-page">
      <h1>Volunteer Signup</h1>
      {message && <div className="message">{message}</div>}
      <form className="signup-form" onSubmit={handleVolunteerSignup}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Volunteer Opportunity ID:
          <input
            type="text"
            value={opportunityId}
            onChange={(e) => setOpportunityId(e.target.value)}
            required
          />
        </label>
        <label>
          Additional Information:
          <textarea value={info} onChange={(e) => setInfo(e.target.value)} />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default VolunteerSignup;
