import axios from 'axios';

// Sign up new user
export const signupUser = async (userName: string, email: string, password: string, name: string, description: string) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
      userName,
      email,
      password,
      name,
      description, // Add the description field
    });
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.error || 'An error occurred' };
  }
};

// Log in user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.error || 'An error occurred' };
  }
};

export const getOpportunities = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/opp/opportunities`);
    if (response.ok) {
      const data = await response.json();
      // Map the backend response to include the volunteersNeeded field
      return data.map((opp: any) => ({
        ...opp,
        volunteersNeeded: opp.volunteers_needed, // Map the backend field
      }));
    } else {
      throw new Error("Failed to fetch opportunities");
    }
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return [];
  }
};


export const addOpportunity = async (opportunity: any) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/opp/create`, {
      park_id: opportunity.park_id, // Ensure the field name matches backend
      name: opportunity.name,
      date: opportunity.date,
      time: opportunity.time || "00:00:00", // Provide default time
      description: opportunity.description || "",
      hours_req: opportunity.hoursReq || 0,
      num_volunteers_needed: opportunity.volunteersNeeded || 0,
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to add opportunity:", error);
    throw error;
  }
};

export const deleteOpportunity = async (id: number) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/opp/delete/${id}`
  );
  return response.data;
};

export const getImpactData = async (parkID: string) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/stats/${parkID}`);
    return response.data; // Assuming the backend returns the stats in the expected format
  } catch (error: any) {
    console.error('Failed to fetch impact tracker data:', error);
    throw error;
  }
};

// Mock API for tracking user interest in getting involved
export const trackGetInvolved = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "Thank you for your interest in getting involved!" });
    }, 500); // Simulate network delay
  });
};

export const signupVolunteer = async (name: string, email: string, opp_ID: string, info: string) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/vol/signup`, {
      name, // Add the name field
      email,
      opp_ID,
      info, // Add the additional information field
    });
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.error || 'An error occurred' };
  }
};

export const addPark = async (park: any) => {
  try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/opp/parks/add`, park);
      return response.data;
  } catch (error: any) {
      console.error("Failed to add park:", error);
      throw error;
  }
};

export const getParks = async () => {
  try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/opp/parks`);
      return response.data;
  } catch (error: any) {
      console.error("Failed to fetch parks:", error);
      throw error;
  }
};

export const getVolunteerStats = async (parkID: string) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/stats/${parkID}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch volunteer stats:", error);
    return { error: "Failed to fetch volunteer stats" };
  }
};

export const sendNotification = async (payload: {
  parkID: number;
  subject: string;
  message: string;
  to?: string; // Optional field for sending to a specific user
}) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/admin/notify`,
      payload
    );
    return response;
  } catch (err) {
    console.error('API Error - sendNotification:', err);
    throw err;
  }
};

export const getParkVolunteers = async (parkID: number) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/volunteers/${parkID}`);
    return response.data; // Backend should return an array of volunteer objects
  } catch (error) {
    console.error('Failed to fetch park volunteers:', error);
    throw error; // Let the frontend handle errors gracefully
  }
};

// Fetch total number of volunteers
export const getTotalVolunteers = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/vol`);
    return response.data; // Assuming the backend returns the count of volunteers
  } catch (error: any) {
    console.error('Failed to fetch total volunteers:', error);
    throw error;
  }
};

// Fetch top parks (based on volunteer needs or other criteria)
export const getTopParks = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/opportunities`);
    const opportunities = response.data;

    // Aggregate park data based on volunteer needs or counts
    const parkCounts: Record<string, number> = {};
    opportunities.forEach((opportunity: any) => {
      const parkName = opportunity.parkName || 'Unknown Park';
      parkCounts[parkName] = (parkCounts[parkName] || 0) + opportunity.volunteersNeeded;
    });

    // Sort parks by volunteer needs and return the top 3
    const sortedParks = Object.entries(parkCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([parkName]) => parkName);

    return sortedParks;
  } catch (error: any) {
    console.error('Failed to fetch top parks:', error);
    throw error;
  }
};

// Mock API for milestones and environmental impact
export const getMilestonesAndImpact = async () => {
  // Replace this with real backend data when available
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        milestones: [
          { name: '100+ Hours Club', value: 12 },
          { name: 'Most Active Park', value: 'Yellowstone' },
          { name: 'Highest Growth', value: 'Trail Maintenance' },
        ],
        environmentalImpact: [
          { name: 'Trees Planted', value: 156 },
          { name: 'Trails Maintained', value: '45 Miles' },
          { name: 'Waste Collected', value: '2,300 lbs' },
        ],
      });
    }, 500);
  });
};

// Fetch all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/list`);
    return response.data; // Assuming the backend returns a list of users
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

export const getUserProfile = async (email: string) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/stats/${email}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error; // Rethrow to let the frontend handle it
  }
};

