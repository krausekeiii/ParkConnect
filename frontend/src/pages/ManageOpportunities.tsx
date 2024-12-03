import React, { useState, useEffect } from 'react';
import './ManageOpportunities.css';
import Modal from '../components/Modal';
import axios from 'axios';
import { getOpportunities, addOpportunity, deleteOpportunity, addPark, getParks } from '../services/api';

interface Opportunity {
  id: number;
  name: string;
  park_name: string;
  park_id: number; 
  date: string;
  description: string;
  volunteersNeeded: number;
}

interface Park {
  id: number;
  name: string;
}

const ManageOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [parks, setParks] = useState<Park[]>([]);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [isParkModalOpen, setIsParkModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity>({
    id: 0,
    name: '',
    park_name: '',
    park_id: 0,
    date: '',
    description: '',
    volunteersNeeded: 0,
  });

  const [newPark, setNewPark] = useState({
    name: '',
    state: '',
    address: '',
    latitude: '',
    longitude: '',
    phone_number: '',
    url: '',
  });

  const [adminParkId, setAdminParkId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const opportunitiesData = await getOpportunities();
        const parksData = await getParks();
        setOpportunities(opportunitiesData);
        setParks(parksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchAdminPark = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found in localStorage');
        return;
      }
    
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/adminpark`, {
          params: { email: userEmail },
        });
    
        if (response.data && response.data.park_id) {
          setAdminParkId(response.data.park_id); 
          console.log('Admin Park ID:', response.data.park_id); 
        } else {
          console.error('Admin park not found or no ID returned');
        }
      } catch (error) {
        console.error('Error fetching admin park:', error);
      }
    };
    

    fetchData();
    fetchAdminPark();
  }, []);

  const handleOpportunityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedOpportunity((prev) => ({ ...prev, [name]: name === 'volunteersNeeded' ? +value : value }));
  };

  const handleParkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPark((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveOpportunity = async () => {
    try {
      const park = parks.find((park) => park.name === selectedOpportunity.park_name);
      if (!park || !park.id) {
        alert('Please select a valid park.');
        return;
      }
  
      const payload: Opportunity = {
        ...selectedOpportunity,
        park_id: park.id, 
      };
  
      await addOpportunity(payload);
      setIsOpportunityModalOpen(false);
      setOpportunities((prev) => [...prev, payload]); 
    } catch (error) {
      console.error('Error saving opportunity:', error);
      alert('Failed to save opportunity. Please try again.');
    }
  };
  

  const handleSavePark = async () => {
    try {
      await addPark(newPark);
      setIsParkModalOpen(false);
      alert('Park added successfully!');
    } catch (error) {
      console.error('Error adding park:', error);
      alert('Failed to add park. Please try again.');
    }
  };

  const handleDeleteOpportunity = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await deleteOpportunity(id);
        setOpportunities(opportunities.filter((opp) => opp.id !== id));
        alert('Opportunity deleted successfully!');
      } catch (error) {
        console.error('Error deleting opportunity:', error);
      }
    }
  };

  return (
    <div className="manage-opportunities">
      <h1>Manage Opportunities</h1>
      <button onClick={() => setIsOpportunityModalOpen(true)} className="add-btn">
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
        {adminParkId === opp.park_id ? (
          <>
            <button
              onClick={() => {
                setSelectedOpportunity(opp);
                setIsOpportunityModalOpen(true);
              }}
            >
              Edit
            </button>
            <button onClick={() => handleDeleteOpportunity(opp.id)}>Delete</button>
          </>
        ) : (
          <span>Not Authorized</span>
        )}
      </td>
    </tr>
  ))}
</tbody>
      </table>
      <Modal
        isOpen={isOpportunityModalOpen}
        onClose={() => setIsOpportunityModalOpen(false)}
        title="Add Opportunity"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={selectedOpportunity.name}
              onChange={handleOpportunityChange}
            />
          </label>
          <label>
            Park:
            <select
              name="park_name"
              value={selectedOpportunity.park_name}
              onChange={handleOpportunityChange}
            >
              <option value="">Select a park</option>
              {parks.map((park) => (
                <option key={park.id} value={park.name}>
                  {park.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={selectedOpportunity.date}
              onChange={handleOpportunityChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={selectedOpportunity.description}
              onChange={handleOpportunityChange}
            />
          </label>
          <label>
            Volunteers Needed:
            <input
              type="number"
              name="volunteersNeeded"
              value={selectedOpportunity.volunteersNeeded}
              onChange={handleOpportunityChange}
            />
          </label>
          <div>
            <button onClick={handleSaveOpportunity}>Save</button>
            <button onClick={() => setIsOpportunityModalOpen(false)}>Cancel</button>
          </div>
          <button onClick={() => setIsParkModalOpen(true)} style={{ marginTop: '1em' }}>
            Add Park
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={isParkModalOpen}
        onClose={() => setIsParkModalOpen(false)}
        title="Add Park"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Park:
            <input type="text" name="name" value={newPark.name} onChange={handleParkChange} />
          </label>
          <label>
            State:
            <input type="text" name="state" value={newPark.state} onChange={handleParkChange} />
          </label>
          <label>
            Address:
            <input type="text" name="address" value={newPark.address} onChange={handleParkChange} />
          </label>
          <label>
            Latitude:
            <input
              type="text"
              name="latitude"
              value={newPark.latitude}
              onChange={handleParkChange}
            />
          </label>
          <label>
            Longitude:
            <input
              type="text"
              name="longitude"
              value={newPark.longitude}
              onChange={handleParkChange}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phone_number"
              value={newPark.phone_number}
              onChange={handleParkChange}
            />
          </label>
          <label>
            URL:
            <input type="text" name="url" value={newPark.url} onChange={handleParkChange} />
          </label>
          <div>
            <button onClick={handleSavePark}>Save</button>
            <button onClick={() => setIsParkModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageOpportunities;
