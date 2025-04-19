import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const orderService = {
    // Handle payment callback
    async handlePaymentCallback(paymentId, token, sessionId) {
        try {
            const response = await axios.post(`${API_URL}/orders/payment/callback`, {
                payment_id: paymentId,
                token: token,
                session_id: sessionId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to process payment' };
        }
    },

    // Get order by order number
    async getOrderByNumber(orderNumber) {
        try {
            const response = await axios.get(`${API_URL}/orders/${orderNumber}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch order details' };
        }
    }
};

export default orderService; 