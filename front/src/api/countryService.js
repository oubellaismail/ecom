import axiosInstance from './axiosInstance';

const countryService = {
    // Get all countries
    getCountries: async () => {
        try {
            const response = await axiosInstance.get('/countries');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default countryService; 