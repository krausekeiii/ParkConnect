import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import './FilterBar.css';

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [keyword, setKeyword] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortType, setSortType] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
    onFilterChange({ keyword: event.target.value, filterType, sortType });
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
    onFilterChange({ keyword, filterType: event.target.value, sortType });
    setIsFilterDropdownOpen(false);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value);
    onFilterChange({ keyword, filterType, sortType: event.target.value });
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
        placeholder="Search opportunities..."
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
              <optgroup label="Opportunity Type">
                <option value="Trail Maintenance">Trail Maintenance</option>
                <option value="Wildlife Monitoring">Wildlife Monitoring</option>
                <option value="Education/Interpretation">Education/Interpretation</option>
                <option value="Visitor Services">Visitor Services</option>
                <option value="Resource Management">Resource Management</option>
              </optgroup>
              <optgroup label="Location">
                <option value="National Park Name">National Park Name</option>
                <option value="State">State</option>
              </optgroup>
              <optgroup label="Date Range">
                <option value="Upcoming Week">Upcoming Week</option>
                <option value="Upcoming Month">Upcoming Month</option>
                <option value="Custom Date Range">Custom Date Range</option>
              </optgroup>
              <optgroup label="Difficulty Level">
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </optgroup>
              <optgroup label="Duration">
                <option value="One-day">One-day</option>
                <option value="Weekend">Weekend</option>
                <option value="Week-long">Week-long</option>
              </optgroup>
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
              <option value="">Select a sort option</option>
              <optgroup label="Alphabetical">
                <option value="A to Z">A to Z</option>
                <option value="Z to A">Z to A</option>
              </optgroup>
              <optgroup label="Date">
                <option value="Closest First">Closest First</option>
                <option value="Farthest First">Farthest First</option>
              </optgroup>
              <optgroup label="Popularity">
                <option value="Most Popular">Most Popular</option>
                <option value="Least Popular">Least Popular</option>
              </optgroup>
              <optgroup label="Difficulty Level">
                <option value="Easiest First">Easiest First</option>
                <option value="Hardest First">Hardest First</option>
              </optgroup>
              <optgroup label="Location">
                <option value="Nearest First">Nearest First</option>
                <option value="Farthest First">Farthest First</option>
              </optgroup>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;