import React, { useState } from 'react';
import './ManageOpportunities.css';

interface Opportunity {
  id: number;
  name: string;
  park: string;
  date: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
}

const ManageOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      name: 'Trail Cleanup',
      park: 'Yellowstone National Park',
      date: '2024-11-05',
      volunteersNeeded: 10,
      volunteersSignedUp: 6,
    },
    {
      id: 2,
      name: 'Wildlife Monitoring',
      park: 'Yosemite National Park',
      date: '2024-12-01',
      volunteersNeeded: 5,
      volunteersSignedUp: 3,
    },
  ]);

  const handleDelete = (opportunityId: number) => {
    const updatedOpportunities = opportunities.filter(opp => opp.id !== opportunityId);
    setOpportunities(updatedOpportunities);
  };

  const handleEdit = (opportunityId: number) => {
    alert(`Edit opportunity with ID: ${opportunityId}`);
  };

  const handleAddOpportunity = () => {
    alert('Add new opportunity');
  };

  return (
    <div className="manage-opportunities">
      <h1>Manage Opportunities</h1>
      <button onClick={handleAddOpportunity} className="add-btn">Add Opportunity</button>
      <table className="opportunity-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Park</th>
            <th>Date</th>
            <th>Volunteers Needed</th>
            <th>Signed Up</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map(opportunity => (
            <tr key={opportunity.id}>
              <td>{opportunity.name}</td>
              <td>{opportunity.park}</td>
              <td>{opportunity.date}</td>
              <td>{opportunity.volunteersNeeded}</td>
              <td>{opportunity.volunteersSignedUp}</td>
              <td>
                <button onClick={() => handleEdit(opportunity.id)}>Edit</button>
                <button onClick={() => handleDelete(opportunity.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOpportunities;
