import axiosInstance from './axiosInstance';

const discountService = {
    // Get all discounts
    getDiscounts: async () => {
        try {
            const response = await axiosInstance.get('/discounts');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get a specific discount
    getDiscount: async (discountId) => {
        try {
            const response = await axiosInstance.get(`/discounts/${discountId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create a new discount
    createDiscount: async (discountData) => {
        try {
            const response = await axiosInstance.post('/discounts', discountData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default discountService; 