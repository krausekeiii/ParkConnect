import axios from 'axios';

const API_URL = 'https://whatever-backend-url.com/api';

export const getVolunteerOpportunities = async () => {
  const response = await axios.get(`${API_URL}/opportunities`);
  return response.data;
};
