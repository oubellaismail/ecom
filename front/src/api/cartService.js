import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const cartService = {
    // Get cart from localStorage
    getCart: () => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const username = user?.username;
            const cartKey = username ? `cart_${username}` : 'cart_guest';
            console.log('Loading cart for user:', username, 'with key:', cartKey); // Debug log
            const cart = localStorage.getItem(cartKey);
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error getting cart:', error);
            return [];
        }
    },

    // Add item to cart
    addToCart: (item) => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const username = user?.username;
            const cartKey = username ? `cart_${username}` : 'cart_guest';
            console.log('Adding to cart for user:', username, 'with key:', cartKey); // Debug log
            const cart = cartService.getCart();
            const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += item.quantity;
            } else {
                cart.push(item);
            }

            localStorage.setItem(cartKey, JSON.stringify(cart));
            return { success: true, cart };
        } catch (error) {
            console.error('Error adding to cart:', error);
            return { success: false, error: error.message };
        }
    },

    // Remove item from cart
    removeFromCart: (itemId) => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const username = user?.username;
            const cartKey = username ? `cart_${username}` : 'cart_guest';
            console.log('Removing from cart for user:', username, 'with key:', cartKey); // Debug log
            const cart = cartService.getCart();
            const updatedCart = cart.filter(item => item.id !== itemId);
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
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

            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const username = user?.username;
            const cartKey = username ? `cart_${username}` : 'cart_guest';
            console.log('Updating quantity for user:', username, 'with key:', cartKey); // Debug log
            const cart = cartService.getCart();
            const updatedCart = cart.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity };
                }
                return item;
            });
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            return { success: true, cart: updatedCart };
        } catch (error) {
            console.error('Error updating quantity:', error);
            return { success: false, error: error.message };
        }
    },

    // Clear cart
    clearCart: () => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const username = user?.username;
            const cartKey = username ? `cart_${username}` : 'cart_guest';
            console.log('Clearing cart for user:', username, 'with key:', cartKey); // Debug log
            localStorage.removeItem(cartKey);
            return { success: true };
        } catch (error) {
            console.error('Error clearing cart:', error);
            return { success: false, error: error.message };
        }
    },

    validateCoupon: async (code) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/discounts/${code}`);
            return response.data;
        } catch (error) {
            console.error('Error validating coupon:', error);
            return { success: false, error: error.message };
        }
    }
};

export default cartService; 