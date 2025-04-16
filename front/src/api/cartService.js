import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const cartService = {
    // Get cart from localStorage
    getCart: () => {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error getting cart:', error);
            return [];
        }
    },

    // Add item to cart
    addToCart: (item) => {
        try {
            const cart = cartService.getCart();

            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += item.quantity;
            } else {
                // Add new item
                cart.push(item);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            return { success: true, cart };
        } catch (error) {
            console.error('Error adding to cart:', error);
            return { success: false, error: error.message };
        }
    },

    // Remove item from cart
    removeFromCart: (itemId) => {
        try {
            const cart = cartService.getCart();
            const updatedCart = cart.filter(item => item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return { success: true, cart: updatedCart };
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { success: false, error: error.message };
        }
    },

    // Update item quantity
    updateQuantity: (itemId, quantity) => {
        try {
            if (quantity < 1) {
                return { success: false, error: 'Quantity must be at least 1' };
            }

            const cart = cartService.getCart();
            const updatedCart = cart.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return { success: true, cart: updatedCart };
        } catch (error) {
            console.error('Error updating quantity:', error);
            return { success: false, error: error.message };
        }
    },

    // Clear cart
    clearCart: () => {
        try {
            localStorage.removeItem('cart');
            return { success: true };
        } catch (error) {
            console.error('Error clearing cart:', error);
            return { success: false, error: error.message };
        }
    },

    validateCoupon: async (code) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                return {
                    success: false,
                    error: 'Please log in to apply coupons'
                };
            }

            const response = await axios.get(`${API_URL}/discounts/${code}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success && response.data.data) {
                return {
                    success: true,
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Invalid coupon code'
                };
            }
        } catch (error) {
            console.error('Error validating coupon:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid coupon code'
            };
        }
    }
};

export default cartService; 