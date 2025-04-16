import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('Current token:', token); // Debug token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request headers:', config.headers); // Debug headers
        } else {
            console.warn('No token found in localStorage'); // Debug missing token
        }
        return config;
    },
    (error) => {
        console.error('Interceptor error:', error); // Debug interceptor error
        return Promise.reject(error);
    }
);

const statusApi = {
    getStatuses: async () => {
        try {
            console.log('Making statuses request...'); // Debug request start
            const response = await axiosInstance.get('/statuses');
            console.log('Statuses response:', response); // Debug response
            return response;
        } catch (error) {
            console.error('Error fetching statuses:', error);
            if (error.response) {
                console.error('Error response:', {
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data
                });
            }
            throw error;
        }
    }
};

export default statusApi; 