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
            const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);

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
    removeFromCart: (itemName) => {
        try {
            const cart = cartService.getCart();
            const updatedCart = cart.filter(item => item.name !== itemName);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return { success: true, cart: updatedCart };
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { success: false, error: error.message };
        }
    },

    // Update item quantity
    updateQuantity: (itemName, quantity) => {
        try {
            const cart = cartService.getCart();
            const updatedCart = cart.map(item => {
                if (item.name === itemName) {
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
    }
};

export default cartService; 