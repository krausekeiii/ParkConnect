import React from 'react';
import './ImpactTracker.css';

const ImpactTracker: React.FC = () => {
  return (
    <div className="impact-tracker-page">
      <div className="impact-header">
        <h1>Impact Tracker</h1>
      </div>
      <div className="impact-grid">
        <div className="impact-tile">
          <h2>Total Hours Volunteered</h2>
          <p>1,234 Hours</p>
        </div>
        <div className="impact-tile">
          <h2>Number of Volunteers</h2>
          <p>89 Active Volunteers</p>
        </div>
        <div className="impact-tile">
          <h2>Projects Completed</h2>
          <p>23 Projects</p>
        </div>
        <div className="impact-tile">
          <h2>Top Parks</h2>
          <p>Yellowstone National Park<br />
             Yosemite National Park<br />
             Grand Canyon National Park</p>
        </div>
        <div className="impact-tile">
          <h2>Environmental Impact</h2>
          <p>156 Trees Planted<br />
             45 Miles of Trails Maintained<br />
             2,300 lbs of Waste Collected</p>
        </div>
        <div className="impact-tile">
          <h2>Milestones</h2>
          <p>100+ Hours Club: 12 Members<br />
             Most Active Park: Yellowstone<br />
             Highest Growth: Trail Maintenance</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactTracker;