import React from 'react';
import './Home.css';
import volunteersImage from '../assets/volunteers-homepage.jpg';
import { useLocation, Link } from 'react-router-dom';

const Home: React.FC = () => {
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  return (
    <div className="home-page">
      {/* Display the success message if it exists */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <img src={volunteersImage} alt="Volunteers" className="home-image" />
      <h1 className="home-header">Discover Volunteer Opportunities in National Parks</h1>
      <div className="home-text home-section">
        <p className="home-text">
          <span className="bold-text">
            There are endless ways you can contribute to preserving and enhancing our national parks. Volunteers participate in various activities, including:
          </span>
        </p>
        <ul>
          <li>Lead or support engaging educational programs for park visitors</li>
          <li>Preserve history by maintaining trails and restoring historic sites</li>
          <li>Conduct essential wildlife research and monitor projects to preserve our natural resources</li>
          <li>Become a welcoming campground host, guiding park guests</li>
          <li>Teach others about the park and swear in new Junior Rangers</li>
          <li>Assist in preserving cultural history by supporting museums and archives</li>
          <li>Produce art as an Artist-In-Residence</li>
          <li>Educate travelers on natural and cultural heritage</li>
        </ul>
      </div>

      {/* Divider line */}
      <div className="divider"></div>

      <h2 className="home-header">Join Our Mission</h2>
      <p className="home-text">
        Become part of the National Park Service's volunteer community, whether for a day or a year. Help protect America's treasured sites.
      </p>
      <Link className="home-button" to="/volunteer-signup">Get Involved</Link>
    </div>
  );
};

export default Home;
