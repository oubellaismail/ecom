import axiosInstance from './axiosInstance';

const orderService = {
    // Place a new order
    placeOrder: async (orderData) => {
        try {
            const response = await axiosInstance.post('/orders', orderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Add item to cart
    addToCart: async (cartItem) => {
        try {
            console.log('Sending cart item:', cartItem);
            const response = await axiosInstance.post('/cart', cartItem);
            console.log('Cart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Cart error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            throw error.response?.data || error;
        }
    },

    // Get cart items
    getCart: async () => {
        try {
            const response = await axiosInstance.get('/cart');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Remove item from cart
    removeFromCart: async (itemId) => {
        try {
            const response = await axiosInstance.delete(`/cart/${itemId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update cart item quantity
    updateCartItem: async (itemId, data) => {
        try {
            const response = await axiosInstance.patch(`/cart/${itemId}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update order status
    updateOrderStatus: async (orderId, statusData) => {
        try {
            const response = await axiosInstance.patch(`/orders/${orderId}/status`, statusData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Initiate payment
    initiatePayment: async (paymentData) => {
        try {
            const response = await axiosInstance.post('/payments/initiate', paymentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Handle payment callback
    handlePaymentCallback: async (paymentId, token, sessionId) => {
        try {
            const response = await axiosInstance.get('/payments/success', {
                params: {
                    payment_id: paymentId,
                    token: token,
                    session_id: sessionId
                }
            });
            console.log('Payment callback response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Payment callback error:', error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Handle PayPal success callback
    handlePayPalSuccess: async (paymentId, payerId) => {
        try {
            const response = await axiosInstance.get('/payments/success', {
                params: {
                    payment_id: paymentId,
                    payer_id: payerId
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Handle PayPal cancel callback
    handlePayPalCancel: async () => {
        try {
            const response = await axiosInstance.get('/payments/cancel');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export const orderApi = {
    // Get user's orders
    getMyOrders: async () => {
        try {
            const response = await axiosInstance.get('/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    // Get all orders for the orders page
    getAllOrders: async () => {
        try {
            const response = await axiosInstance.get('/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching all orders:', error);
            throw error;
        }
    }
};

export default orderService; 