import React, { useState } from 'react';
import Map from '../components/Map';
import Modal from '../components/Modal';
import FilterBar from '../components/FilterBar';
import './Opportunities.css';

const Opportunities: React.FC = () => {
  const opportunities = [
    {
      id: 1,
      title: 'Trail Maintenance',
      location: [44.4280, -110.5885] as [number, number], // Yellowstone National Park
      parkName: 'Yellowstone National Park',
      state: 'Wyoming',
      description: 'Join us in maintaining the scenic trails of Yellowstone National Park. This rewarding opportunity allows you to work amidst breathtaking landscapes, ensuring that visitors can safely enjoy the park’s natural beauty. No prior experience is necessary, and all tools will be provided. You’ll also learn about the unique ecosystems you help to preserve!',
    },
    {
      id: 2,
      title: 'Wildlife Monitoring',
      location: [36.7783, -119.4179] as [number, number], // Yosemite National Park
      parkName: 'Yosemite National Park',
      state: 'California',
      description: 'Participate in critical wildlife monitoring at Yosemite National Park. Help our rangers and scientists track the health and behavior of the park’s diverse animal population. Your contributions will play a key role in conservation efforts, and you’ll gain hands-on experience in wildlife research. Perfect for nature enthusiasts and aspiring biologists!',
    },
  ];

  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [filteredOpportunities, setFilteredOpportunities] = useState(opportunities);

  const handleFilterChange = (filters: any) => {
    setFilteredOpportunities(
      opportunities.filter(opportunity =>
        opportunity.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
        (!filters.type || opportunity.title === filters.type)
      )
    );
  };

  const handleClick = (id: number) => {
    setSelectedOpportunity(id === selectedOpportunity ? null : id);
  };

  const closeModal = () => {
    setSelectedOpportunity(null);
  };

  return (
    <div className="opportunities-page">
      <h1>Volunteer Opportunities</h1>
      <FilterBar onFilterChange={handleFilterChange} />
      {filteredOpportunities.map((opportunity) => (
        <div key={opportunity.id} className="opportunity">
          <h2 onClick={() => handleClick(opportunity.id)}>
            {opportunity.title}
          </h2>
          <div className="map-container">
            <Map position={opportunity.location} />
          </div>
          <p className="park-info">
            <strong>{opportunity.parkName}</strong>, {opportunity.state}
          </p>
          {selectedOpportunity === opportunity.id && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              content={opportunity.description}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Opportunities;
