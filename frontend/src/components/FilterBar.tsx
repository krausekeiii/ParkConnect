import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import './FilterBar.css';

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
  availableStates: string[];
  availableParks: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, availableStates, availableParks }) => {
  const [keyword, setKeyword] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortType, setSortType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [opportunityType, setOpportunityType] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
    onFilterChange({ keyword: event.target.value, filterType, sortType, dateRange, opportunityType });
  };

  const handleFilterClick = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    setIsSortDropdownOpen(false);
  };

  const handleSortClick = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsFilterDropdownOpen(false);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
    onFilterChange({ keyword, filterType: event.target.value, sortType, dateRange, opportunityType });
    setIsFilterDropdownOpen(false);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>, field: 'start' | 'end') => {
    const updatedDateRange = { ...dateRange, [field]: event.target.value };
    setDateRange(updatedDateRange);
    onFilterChange({ keyword, filterType, sortType, dateRange: updatedDateRange, opportunityType });
  };

  const handleOpportunityTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOpportunityType(event.target.value);
    onFilterChange({ keyword, filterType, sortType, dateRange, opportunityType: event.target.value });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value);
    onFilterChange({ keyword, filterType, sortType: event.target.value, dateRange, opportunityType });
    setIsSortDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      filterRef.current && !filterRef.current.contains(event.target as Node) &&
      sortRef.current && !sortRef.current.contains(event.target as Node)
    ) {
      setIsFilterDropdownOpen(false);
      setIsSortDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search opportunities, states, or parks..."
        value={keyword}
        onChange={handleSearchChange}
      />
      <div className="dropdown-wrapper" ref={filterRef}>
        <button onClick={handleFilterClick} className="dropdown-trigger">
          <FontAwesomeIcon icon={faFilter} /> Filter <FontAwesomeIcon icon={faChevronDown} />
        </button>
        {isFilterDropdownOpen && (
          <div className="dropdown-menu">
            <select onChange={handleFilterChange} value={filterType}>
              <option value="">Select a filter</option>
              <optgroup label="State">
                {availableStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </optgroup>
              <optgroup label="National Park">
                {availableParks.map((park) => (
                  <option key={park} value={park}>{park}</option>
                ))}
              </optgroup>
            </select>
            <label>
              Start Date:
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateChange(e, 'start')}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateChange(e, 'end')}
              />
            </label>
            <select onChange={handleOpportunityTypeChange} value={opportunityType}>
              <option value="">Select Opportunity Type</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Wildlife Management">Wildlife Management</option>
              <option value="Education/Interpretation">Education/Interpretation</option>
              <option value="Visitor Services">Visitor Services</option>
              <option value="Resource Management">Resource Management</option>
            </select>
          </div>
        )}
      </div>
      <div className="dropdown-wrapper" ref={sortRef}>
        <button onClick={handleSortClick} className="dropdown-trigger">
          <FontAwesomeIcon icon={faSort} /> Sort <FontAwesomeIcon icon={faChevronDown} />
        </button>
        {isSortDropdownOpen && (
          <div className="dropdown-menu">
            <select onChange={handleSortChange} value={sortType}>
              <option value="">Sort by...</option>
              <option value="A to Z">A to Z</option>
              <option value="Z to A">Z to A</option>
              <option value="Closest First">Date (Closest First)</option>
              <option value="Furthest First">Date (Furthest First)</option>
              <option value="Most Volunteers">Most Volunteers</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
