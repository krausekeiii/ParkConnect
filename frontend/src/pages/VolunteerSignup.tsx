import React from 'react';
import './VolunteerSignup.css';

const VolunteerSignup: React.FC = () => {
  return (
    <div className="signup-page">
      <h1>Volunteer Signup</h1>
      <form className="signup-form">
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Volunteer Opportunity:
          <input type="text" name="opportunity" required />
        </label>
        <label>
          Additional Information:
          <textarea name="info"></textarea>
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};



export default VolunteerSignup;
