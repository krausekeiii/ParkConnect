import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import Modal from '../components/Modal';
import FilterBar from '../components/FilterBar';
import './Opportunities.css';
import { getOpportunities } from '../services/api';

const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);
  const [filteredOpportunities, setFilteredOpportunities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOpportunities();
      console.log("Opportunities API response:", data); // Debugging log (Step 3)
      setOpportunities(data);
      setFilteredOpportunities(data);
    };

    fetchData();
  }, []);

  const handleFilterChange = (filters: any) => {
    setFilteredOpportunities(
      opportunities.filter(opportunity =>
        opportunity.name.toLowerCase().includes(filters.keyword.toLowerCase()) &&
        (!filters.type || opportunity.name === filters.type)
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
            {opportunity.name}
          </h2>
          <div className="map-container">
            {/* Step 2: Handle missing latitude and longitude */}
            <Map
              position={
                opportunity.latitude && opportunity.longitude
                  ? [opportunity.latitude, opportunity.longitude]
                  : [39.8283, -98.5795] // Default to the geographic center of the USA
              }
            />
          </div>
          <p className="park-info">
            <strong>{opportunity.park_name || 'Unknown Park'}</strong>, {opportunity.state || 'Unknown State'}
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
