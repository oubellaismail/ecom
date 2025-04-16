import axiosInstance from './axiosInstance';

const paypalService = {
    // Create a PayPal payment
    createPayment: async (paymentData) => {
        try {
            const response = await axiosInstance.post('/api/paypal/create', paymentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Capture a PayPal payment
    capturePayment: async (paymentId, payerId) => {
        try {
            const response = await axiosInstance.post('/api/paypal/capture', {
                paymentId,
                payerId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Check payment status
    checkPaymentStatus: async (paymentId) => {
        try {
            const response = await axiosInstance.get('/api/paypal/check-status', {
                params: { paymentId }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default paypalService; 