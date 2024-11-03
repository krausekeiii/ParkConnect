import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your Flask backend URL

// Sign up new user
export const signupUser = async (userName: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      userName,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.error || 'An error occurred' };
  }
};

// Log in user
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    return { error: error?.response?.data?.error || 'An error occurred' };
  }
};

// Mock opportunities API
export const getOpportunities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "Trail Maintenance",
          parkName: "Yellowstone National Park",
          state: "Wyoming",
          description: "Help maintain trails at Yellowstone.",
        },
        {
          id: 2,
          title: "Wildlife Monitoring",
          parkName: "Yosemite National Park",
          state: "California",
          description: "Assist in monitoring wildlife in Yosemite.",
        },
      ]);
    }, 500);
  });
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

// Mock volunteer signup API
export const signupVolunteer = async (name: string, email: string, interest: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: `Thank you, ${name}, for signing up!` });
    }, 500); // Simulate network delay
  });
};

