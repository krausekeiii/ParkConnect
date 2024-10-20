import React from 'react';
import './ImpactTracker.css';

const ImpactTracker: React.FC = () => {
  return (
    <div className="impact-tracker-page">
      <h1>Impact Tracker</h1>
      <div className="impact-grid">
        <div className="impact-tile">
          <h2>Total Hours Volunteered</h2>
          <p>Placeholder for total hours</p>
        </div>
        <div className="impact-tile">
          <h2>Number of Volunteers</h2>
          <p>Placeholder for number of volunteers</p>
        </div>
        <div className="impact-tile">
          <h2>Projects Completed</h2>
          <p>Placeholder for completed projects</p>
        </div>
        <div className="impact-tile">
          <h2>Top Parks or Projects</h2>
          <p>Placeholder for top parks/projects</p>
        </div>
        <div className="impact-tile">
          <h2>Environmental Impact</h2>
          <p>Placeholder for environmental impact metrics</p>
        </div>
        <div className="impact-tile">
          <h2>Milestones</h2>
          <p>Placeholder for milestones</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;
