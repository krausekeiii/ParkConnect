import React, { useState, useEffect } from 'react';
import './ManageOpportunities.css';
import Modal from '../components/Modal';
import { getOpportunities, addOpportunity, deleteOpportunity } from '../services/api';

interface Opportunity {
  id: number;
  name: string;
  park_name: string;
  date: string;
  description: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
}

interface Park {
  id: number;
  name: string;
}

const ManageOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [parks, setParks] = useState<Park[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddPark, setShowAddPark] = useState(false);
  const [newPark, setNewPark] = useState({ name: '', latitude: '', longitude: '' });
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity>({
    id: 0,
    name: '',
    park_name: '',
    date: '',
    description: '',
    volunteersNeeded: 0,
    volunteersSignedUp: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOpportunities();
      setOpportunities(data);
    };

    const fetchParks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/parks`);
        if (response.ok) {
          const parksData = await response.json();
          setParks(parksData);
        }
      } catch (error) {
        console.error("Error fetching parks:", error);
      }
    };

    fetchData();
    fetchParks();
  }, []);

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedOpportunity({ ...selectedOpportunity, [name]: name === "volunteersNeeded" ? +value : value });
  };

  const handleAddPark = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/parks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPark),
      });
      if (response.ok) {
        const addedPark = await response.json();
        setParks((prev) => [...prev, { id: addedPark.id, name: newPark.name }]);
        setShowAddPark(false);
        setNewPark({ name: '', latitude: '', longitude: '' });
      } else {
        alert("Failed to add park. Please try again.");
      }
    } catch (error) {
      console.error("Error adding park:", error);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const selectedPark = parks.find((park) => park.name === selectedOpportunity.park_name);
      if (!selectedPark) {
        alert("Invalid park selected. Please try again.");
        return;
      }
  
      const payload = {
        park_id: selectedPark.id,
        name: selectedOpportunity.name,
        date: selectedOpportunity.date,
        time: "09:00:00",
        description: selectedOpportunity.description || "",
        hours_req: 0,
        num_volunteers_needed: selectedOpportunity.volunteersNeeded,
      };
  
      if (selectedOpportunity.id === 0) {
        const addedOpportunity = await addOpportunity(payload);
        setOpportunities([...opportunities, addedOpportunity]);
      } else {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/opportunities/${selectedOpportunity.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setOpportunities((prev) =>
          prev.map((opp) =>
            opp.id === selectedOpportunity.id ? { ...opp, ...payload, park_name: selectedOpportunity.park_name } : opp
          )
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving opportunity:", error);
      alert("Failed to save opportunity. Please try again.");
    }
  };  

  return (
    <div className="manage-opportunities">
      <h1>Manage Opportunities</h1>
      <button onClick={() => setIsModalOpen(true)} className="add-btn">
        Add Opportunity
      </button>
      <table className="opportunity-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Park</th>
            <th>Date</th>
            <th>Volunteers Needed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.id}>
              <td>{opp.name}</td>
              <td>{opp.park_name}</td>
              <td>{opp.date}</td>
              <td>{opp.volunteersNeeded}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedOpportunity(opp);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteOpportunity(opp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedOpportunity.id === 0 ? "Add Opportunity" : "Edit Opportunity"}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Name:
            <input type="text" name="name" value={selectedOpportunity.name} onChange={handleModalChange} />
          </label>
          <label>
            Park:
            <select name="park_name" value={selectedOpportunity.park_name} onChange={handleModalChange}>
              {parks.map((park) => (
                <option key={park.id} value={park.name}>
                  {park.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setShowAddPark(true)}>
              Add Park
            </button>
          </label>
          {showAddPark && (
            <div>
              <input
                type="text"
                placeholder="Park Name"
                value={newPark.name}
                onChange={(e) => setNewPark({ ...newPark, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Latitude"
                value={newPark.latitude}
                onChange={(e) => setNewPark({ ...newPark, latitude: e.target.value })}
              />
              <input
                type="text"
                placeholder="Longitude"
                value={newPark.longitude}
                onChange={(e) => setNewPark({ ...newPark, longitude: e.target.value })}
              />
              <button onClick={handleAddPark}>Save Park</button>
            </div>
          )}
          <label>
            Date:
            <input type="date" name="date" value={selectedOpportunity.date} onChange={handleModalChange} />
          </label>
          <label>
            Description:
            <textarea name="description" value={selectedOpportunity.description} onChange={handleModalChange} />
          </label>
          <label>
            Volunteers Needed:
            <input
              type="number"
              name="volunteersNeeded"
              value={selectedOpportunity.volunteersNeeded}
              onChange={handleModalChange}
            />
          </label>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleModalSubmit}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageOpportunities;
