import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wisataku_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wisataku_token');
      localStorage.removeItem('wisataku_user');
      // Redirect to login if not already there
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    let message = error.response?.data?.message || error.message || 'Terjadi kesalahan';
    
    // Append detailed validation errors if they exist
    const validationData = error.response?.data?.data;
    if (validationData && typeof validationData === 'object' && Object.keys(validationData).length > 0) {
      const details = Object.entries(validationData)
        .map(([field, err]) => `${field}: ${err}`)
        .join(', ');
      message = `${message} (${details})`;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
