import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart
    const addToCart = (item) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                // Add new item to cart
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // Update item quantity
    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Get total items count
    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Get total price
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = item.discount && item.discount > 0
                ? item.discountType === 'percentage'
                    ? item.price - (item.price * item.discount) / 100
                    : item.price - item.discount
                : item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    // Get total discount
    const getTotalDiscount = () => {
        return cartItems.reduce((total, item) => {
            if (item.discount && item.discount > 0) {
                const discountAmount = item.discountType === 'percentage'
                    ? (item.price * item.discount) / 100
                    : item.discount;
                return total + (discountAmount * item.quantity);
            }
            return total;
        }, 0);
    };

    // Check if item is in cart
    const isInCart = (itemId) => {
        return cartItems.some(item => item.id === itemId);
    };

    // Get item quantity in cart
    const getItemQuantity = (itemId) => {
        const item = cartItems.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    };

    // Get cart summary with detailed calculations
    const getCartSummary = () => {
        const subtotal = getTotalPrice();
        const freeShippingThreshold = 50000; // ₹50,000 for free shipping
        const shipping = subtotal >= freeShippingThreshold ? 0 : 500; // ₹500 shipping
        const total = subtotal + shipping;
        const itemCount = getCartItemCount();
        const isEligibleForFreeShipping = subtotal >= freeShippingThreshold;

        return {
            itemCount,
            subtotal,
            shipping,
            total,
            freeShippingThreshold,
            isEligibleForFreeShipping,
            discount: getTotalDiscount()
        };
    };

    const value = {
        cartItems,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemCount,
        getTotalPrice,
        getTotalDiscount,
        isInCart,
        getItemQuantity,
        getCartSummary,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;