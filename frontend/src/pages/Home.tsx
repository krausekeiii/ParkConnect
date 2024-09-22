import React from 'react';
import './Home.css';
import volunteersImage from '../assets/volunteers-homepage.jpg';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <img src={volunteersImage} alt="Volunteers" className="home-image" />
      <h1 className="home-header">Discover Volunteer Opportunities in National Parks</h1>
      <div className="home-text home-section">
      <p className="home-text">
        <span className="bold-text">There are endless ways you can contribute to preserving and enhancing our national parks. Volunteers participate in various activities, including:</span>
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
      <h2 className="home-header">Join Our Mission</h2>
      <p className="home-text">
        Become part of the National Park Service's volunteer community, whether for a day or a year. Help protect America's treasured sites.
      </p>
      <a className="home-button" href="/volunteer-signup">Get Involved</a>
    </div>
  );
};

export default Home;
