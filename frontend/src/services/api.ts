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

// Mock impact tracker API
export const getImpactData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalHours: 120,
        numberOfVolunteers: 50,
        projectsCompleted: 10,
        topParks: ["Yellowstone", "Yosemite"],
      });
    }, 500);
  });
};

// Mock API for tracking user interest in getting involved
export const trackGetInvolved = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "Thank you for your interest in getting involved!" });
    }, 500); // Simulate network delay
  });
};

// Volunteer signup
export const signupVolunteer = async (name: string, email: string, opp_ID: string, info: string) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/volunteer/signup`, {
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
