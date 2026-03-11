import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://ecommerce-7l2l.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for common error handling
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and redirect on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    // You can add global error handling here (e.g., toast, logout on 401)
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
