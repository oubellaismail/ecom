import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../api/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useAuth();

    // Load cart from localStorage on initial render and when user changes
    useEffect(() => {
        const savedCart = cartService.getCart();
        setCart(savedCart);
    }, [user?.username]); // Reload cart when username changes

    const addToCart = (item) => {
        const result = cartService.addToCart(item);
        if (result.success) {
            setCart(result.cart);
        }
        return result;
    };

    const removeFromCart = (itemId) => {
        const result = cartService.removeFromCart(itemId);
        if (result.success) {
            setCart(result.cart);
        }
        return result;
    };

    const updateQuantity = (itemId, quantity) => {
        const result = cartService.updateQuantity(itemId, quantity);
        if (result.success) {
            setCart(result.cart);
        }
        return result;
    };

    const clearCart = () => {
        const result = cartService.clearCart();
        if (result.success) {
            setCart([]);
        }
        return result;
    };

    const getCartCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 