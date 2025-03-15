import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User API
export const createUser = async (name: string) => {
  const response = await api.post('/users', { name });
  return response.data;
};

export const getUserByUniqueId = async (uniqueId: string) => {
  const response = await api.get(`/users/${uniqueId}`);
  return response.data;
};

export const authenticateUser = async (uniqueId: string, password: string) => {
  const response = await api.post('/users/auth', { uniqueId, password });
  return response.data;
};

// Feedback API
export const submitFeedback = async (uniqueId: string, ratings: any, comment: string) => {
  const response = await api.post('/feedback', { uniqueId, ratings, comment });
  return response.data;
};

export const getFeedback = async (userId: string) => {
  const response = await api.get(`/feedback/${userId}`);
  return response.data;
};

export default api; 