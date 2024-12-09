import React, { useState, useEffect } from 'react';
import './VolunteerSignup.css';
import { signupVolunteer, getOpportunities, getParks } from '../services/api';
import { useNavigate } from 'react-router-dom';

const VolunteerSignup: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
  const [opportunityId, setOpportunityId] = useState('');
  const [info, setInfo] = useState('');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const opportunitiesData = await getOpportunities();
        const parksData = await getParks();

        const opportunitiesWithParks = opportunitiesData.map((opp: any) => {
          const park = parksData.find((p: any) => p.id === opp.park_id);
          return {
            ...opp,
            parkName: park ? park.name : 'Unknown Park',
          };
        });

        setOpportunities(opportunitiesWithParks);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();

    
  }, []);

  const handleVolunteerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    

    try {
      const response: any = await signupVolunteer(name, email, opportunityId, info);
      if (response.error) {
        setMessage(response.error); // Display backend error
      } else {
        setMessage(response.message || 'Signup successful!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An error occurred while signing up. Please ensure you are registered.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="unauthenticated-page">
        <div className="unauthenticated-container">
          <h1 className="unauthenticated-header">Join Our Volunteer Community</h1>
          <p className="unauthenticated-text">
            Register or log in to explore opportunities and contribute to preserving our national parks.
          </p>
          <div className="unauthenticated-buttons">
            <button onClick={() => navigate('/signup')} className="btn primary-btn">
              Register
            </button>
            <button onClick={() => navigate('/login')} className="btn secondary-btn">
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <h1>Volunteer Signup</h1>
      {message && <div className="message">{message}</div>}
      <form className="signup-form" onSubmit={handleVolunteerSignup}>
        
        <label>
          Select Opportunity:
          <select
            value={opportunityId}
            onChange={(e) => setOpportunityId(e.target.value)}
            required
          >
            <option value="">Select an opportunity</option>
            {opportunities.map((opportunity: any) => (
              <option key={opportunity.id} value={opportunity.id}>
                {`${opportunity.name}, ${opportunity.parkName}, ${opportunity.date || 'No Date'}`}
              </option>
            ))}
          </select>
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
