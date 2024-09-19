import React from 'react';
import './VolunteerSignup.css';

const VolunteerSignup: React.FC = () => {
  return (
    <div className="volunteer-signup">
      <h1>Volunteer Signup</h1>
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="opportunity">Opportunity:</label>
        <select id="opportunity" name="opportunity">
          <option value="cleanup">Park Cleanup</option>
          <option value="preservation">Historic Preservation</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default VolunteerSignup;
