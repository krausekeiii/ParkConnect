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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<Opportunity>({
    id: Date.now(),
    name: '',
    park: '',
    date: '',
    volunteersNeeded: 0,
    volunteersSignedUp: 0,
  });

  const handleDelete = (opportunityId: number) => {
    const updatedOpportunities = opportunities.filter(opp => opp.id !== opportunityId);
    setOpportunities(updatedOpportunities);
  };

  const handleEdit = (opportunityId: number) => {
    alert(`Edit opportunity with ID: ${opportunityId}`);
  };

  const handleAddOpportunity = () => {
    setIsModalOpen(true);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOpportunity({ ...newOpportunity, [name]: value });
  };

  const handleModalSubmit = () => {
    setOpportunities([...opportunities, newOpportunity]);
    setIsModalOpen(false);
    setNewOpportunity({ id: Date.now(), name: '', park: '', date: '', volunteersNeeded: 0, volunteersSignedUp: 0 });
  };

  return (
    <div className="manage-opportunities">
      <h1>Manage Opportunities</h1>
      <button onClick={handleAddOpportunity} className="add-btn">Add Opportunity</button>

      {isModalOpen && (
  <div className="modal">
    <div className="modal-content">
      <h2>Add New Opportunity</h2>
      <label>
        Name:
        <input type="text" name="name" value={newOpportunity.name} onChange={handleModalChange} />
      </label>
      <label>
        Park:
        <input type="text" name="park" value={newOpportunity.park} onChange={handleModalChange} />
      </label>
      <label>
        Date:
        <input type="date" name="date" value={newOpportunity.date} onChange={handleModalChange} />
      </label>
      <label>
        Volunteers Needed:
        <input type="number" name="volunteersNeeded" value={newOpportunity.volunteersNeeded} onChange={handleModalChange} />
      </label>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={handleModalSubmit} className="submit-btn">Add Opportunity</button>
        <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
)}


      <div className="opportunity-table-wrapper">
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
    </div>
  );
};

export default ManageOpportunities;
