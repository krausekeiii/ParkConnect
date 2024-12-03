import React, { useState, useEffect } from 'react';
import './ImpactTracker.css';
import axios from 'axios';

interface ImpactData {
  total_hours: { total_hours: number };
  total_vols: { total_vols: number };
  total_projects: { total_projects: number };
  top_parks: { top_parks: { name: string; hours: number }[] };
  milestones: { [key: string]: string | null }[];
}

const formatMilestoneKey = (key: string): string => {
  // Convert keys to a more readable format
  const formattedKey = key
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  return formattedKey;
};

const formatMilestoneValue = (value: string | null): string => {
  return value || 'Not Yet Achieved';
};

const ImpactTracker: React.FC = () => {
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/vol/impact`);
        setImpactData(response.data); // Save the data
        setError(null);
      } catch (err) {
        console.error('Error fetching impact tracker data:', err);
        setError('Failed to fetch impact tracker data.');
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  if (loading) return <p>Loading impact data...</p>;
  if (error) return <p className="error">{error}</p>;

  const totalHours = impactData?.total_hours?.total_hours || 0;
  const totalVolunteers = impactData?.total_vols?.total_vols || 0;
  const totalProjects = impactData?.total_projects?.total_projects || 0;

  return (
    <div className="impact-tracker-page">
      <div className="impact-header">
        <h1>Impact Tracker</h1>
      </div>
      <div className="impact-grid">
        <div className="impact-tile">
          <h2>Total Hours Volunteered</h2>
          <p>{totalHours} Hours</p>
        </div>
        <div className="impact-tile">
          <h2>Number of Volunteers</h2>
          <p>{totalVolunteers} Active Volunteers</p>
        </div>
        <div className="impact-tile">
          <h2>Projects Completed</h2>
          <p>{totalProjects || 'Data not provided'}</p>
        </div>
        <div className="impact-tile">
          <h2>Top Parks</h2>
          <ul>
            {impactData?.top_parks?.top_parks.map((park, index) => (
              <li key={index}>
                <strong>{park.name}</strong>: {park.hours} Hours
              </li>
            ))}
          </ul>
        </div>
        <div className="impact-tile">
          <h2>Milestones</h2>
          <ul>
            {impactData?.milestones.map((milestone, index) => {
              const [key, value] = Object.entries(milestone)[0]; // Extract the key-value pair
              return (
                <li key={index}>
                  <strong>{formatMilestoneKey(key)}</strong>: {formatMilestoneValue(value)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;
