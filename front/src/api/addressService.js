import axiosInstance from './axiosInstance';

const addressService = {
    // Create a new address
    createAddress: async (addressData) => {
        try {
            const response = await axiosInstance.post('/addresses', addressData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get a specific address
    getAddress: async (addressId) => {
        try {
            const response = await axiosInstance.get(`/addresses/${addressId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update an existing address
    updateAddress: async (addressId, addressData) => {
        try {
            const response = await axiosInstance.put(`/addresses/${addressId}`, addressData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default addressService; 