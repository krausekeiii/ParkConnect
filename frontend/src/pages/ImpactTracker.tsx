import React from 'react';
import './ImpactTracker.css';

const ImpactTracker: React.FC = () => {
  return (
    <div className="impact-tracker">
      <h1>Impact Tracker</h1>
      <div className="metrics">
        <div className="metric">
          <h2>Total Hours Volunteered</h2>
          <p>Placeholder for total hours</p>
        </div>
        <div className="metric">
          <h2>Number of Volunteers</h2>
          <p>Placeholder for number of volunteers</p>
        </div>
        <div className="metric">
          <h2>Projects Completed</h2>
          <p>Placeholder for projects completed</p>
        </div>
        <div className="metric">
          <h2>Top Parks or Projects</h2>
          <p>Placeholder for top parks or projects</p>
        </div>
        <div className="metric">
          <h2>Environmental Impact</h2>
          <p>Placeholder for environmental impact metrics</p>
        </div>
        <div className="metric">
          <h2>Milestones</h2>
          <p>Placeholder for milestones</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;
