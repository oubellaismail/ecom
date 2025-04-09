import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const accessToken = localStorage.getItem('access_token');

    // If token exists, add it to the request headers
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 errors (Unauthorized) - could add token refresh logic here
    if (error.response && error.response.status === 401) {
      // Optional: Try to refresh the token or redirect to login
      // For now, just log the user out if they're unauthorized
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('is_admin');
      window.location.href = '/signin'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;