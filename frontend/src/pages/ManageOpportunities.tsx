import React, { useState, useEffect } from 'react';
import './ManageOpportunities.css';
import { getOpportunities, addOpportunity, deleteOpportunity } from '../services/api';

interface Opportunity {
  id: number;
  name: string;
  park: string;
  date: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
}

const ManageOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<Opportunity>({
    id: 0,
    name: '',
    park: '',
    date: '',
    volunteersNeeded: 0,
    volunteersSignedUp: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOpportunities();
      setOpportunities(data);
    };

    fetchData();
  }, []);

  const handleDelete = async (opportunityId: number) => {
    await deleteOpportunity(opportunityId);
    setOpportunities(opportunities.filter((opp) => opp.id !== opportunityId));
  };

  const handleAddOpportunity = () => {
    setIsModalOpen(true);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOpportunity({ ...newOpportunity, [name]: value });
  };

  const handleModalSubmit = async () => {
    try {
      const opportunityPayload = {
        name: newOpportunity.name,
        park: newOpportunity.park,
        date: newOpportunity.date,
        time: "00:00:00", // Default time if not provided
        description: "", // Optional description
        hoursReq: 0, // Default hours required
        volunteersNeeded: newOpportunity.volunteersNeeded,
      };
      const addedOpportunity = await addOpportunity(opportunityPayload);
      setOpportunities([...opportunities, addedOpportunity]);
      setIsModalOpen(false);
      setNewOpportunity({
        id: 0,
        name: "",
        park: "",
        date: "",
        volunteersNeeded: 0,
        volunteersSignedUp: 0,
      });
    } catch (error) {
      console.error("Error adding opportunity:", error);
      alert("Failed to add opportunity. Please check your input and try again.");
    }
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
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id}>
                <td>{opportunity.name}</td>
                <td>{opportunity.park}</td>
                <td>{opportunity.date}</td>
                <td>{opportunity.volunteersNeeded}</td>
                <td>{opportunity.volunteersSignedUp}</td>
                <td>
                  <button>Edit</button>
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
