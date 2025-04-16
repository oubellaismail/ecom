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
            console.log('Creating discount with data:', discountData);
            const response = await axiosInstance.post('/discounts', discountData);
            console.log('Discount creation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Discount creation error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }
};

export default discountService; 