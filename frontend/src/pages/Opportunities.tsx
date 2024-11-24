import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import Modal from '../components/Modal';
import FilterBar from '../components/FilterBar';
import './Opportunities.css';
import { getOpportunities } from '../services/api';

interface Opportunity {
  id: number;
  name: string;
  date: string;
  latitude: number | null;
  longitude: number | null;
  park_name: string;
  state: string;
  description: string;
  num_volunteers: number;
  [key: string]: any; // Allow additional properties
}

const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableParks, setAvailableParks] = useState<string[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: Opportunity[] = await getOpportunities();
      setOpportunities(data);
      setFilteredOpportunities(data);

      // Extract unique states and parks for filtering
      const uniqueStates = Array.from(new Set(data.map((item) => item.state))).filter(
        (state): state is string => Boolean(state)
      );
      const uniqueParks = Array.from(new Set(data.map((item) => item.park_name))).filter(
        (park): park is string => Boolean(park)
      );

      setAvailableStates(uniqueStates);
      setAvailableParks(uniqueParks);
    };

    fetchData();
  }, []);

  const handleFilterChange = (filters: any) => {
    const typeMapping: { [key: string]: string[] } = {
      Maintenance: ['Trail Maintenance', 'Trail Cleanup', 'Campground Maintenance', 'Wetland Restoration'],
      'Wildlife Management': ['Wildlife Survey'],
      'Education/Interpretation': ['Guided Tour Support', 'Ranger Program Setup'],
      'Visitor Services': ['Visitor Assistance', 'Trailhead Ambassador'],
      'Resource Management': ['Canyon Cleanup', 'Geothermal Study Support'],
    };
  
    const filtered = opportunities.filter((opportunity) => {
      const matchesKeyword = [
        opportunity.name.toLowerCase(),
        opportunity.state?.toLowerCase(),
        opportunity.park_name?.toLowerCase(),
      ].some((field) => field?.includes(filters.keyword.toLowerCase()));
  
      const matchesFilter = !filters.filterType ||
        opportunity.state === filters.filterType ||
        opportunity.park_name === filters.filterType;
  
      const matchesDate = (!filters.dateRange.start || new Date(opportunity.date) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end || new Date(opportunity.date) <= new Date(filters.dateRange.end));
  
      const matchesOpportunityType = !filters.opportunityType ||
        typeMapping[filters.opportunityType]?.includes(opportunity.name);
  
      return matchesKeyword && matchesFilter && matchesDate && matchesOpportunityType;
    });
  
    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortType) {
        case 'A to Z':
          return a.name.localeCompare(b.name);
        case 'Z to A':
          return b.name.localeCompare(a.name);
        case 'Closest First':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'Furthest First':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'Most Volunteers':
          return b.num_volunteers - a.num_volunteers;
        default:
          return 0;
      }
    });
  
    setFilteredOpportunities(sorted);
  };
  
  const handleOpportunityClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const closeModal = () => {
    setSelectedOpportunity(null);
  };

  return (
    <div className="opportunities-page">
      <h1>Volunteer Opportunities</h1>
      <FilterBar
        onFilterChange={handleFilterChange}
        availableStates={availableStates}
        availableParks={availableParks}
      />
      {filteredOpportunities.map((opportunity) => (
        <div key={opportunity.id} className="opportunity">
          <h2 onClick={() => handleOpportunityClick(opportunity)}>
            {opportunity.name}
          </h2>
          <div className="map-container">
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
        </div>
      ))}
      {selectedOpportunity && (
        <Modal
          isOpen={!!selectedOpportunity}
          onClose={closeModal}
          content={selectedOpportunity.description}
        />
      )}
    </div>
  );
};

export default Opportunities;
