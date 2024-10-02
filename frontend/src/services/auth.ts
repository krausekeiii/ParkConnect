import axios from 'axios';

const API_URL = 'https://your-api-url.com';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const register = async (username: string, password: string, email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password, email });
    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};
