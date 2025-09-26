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

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('gemCart');
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
        localStorage.setItem('gemCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (gem, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === gem.id);

            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(item =>
                    item.id === gem.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item to cart
                return [...prevItems, {
                    id: gem.id,
                    name: gem.name,
                    category: gem.category,
                    price: gem.price,
                    discount: gem.discount || 0,
                    discountType: gem.discountType || 'percentage',
                    sizeWeight: gem.sizeWeight,
                    sizeUnit: gem.sizeUnit,
                    images: gem.allImages || [],
                    quantity: quantity,
                    availability: gem.availability,
                    stock: gem.stock
                }];
            }
        });
    };

    const removeFromCart = (gemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== gemId));
    };

    const updateQuantity = (gemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(gemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === gemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const itemPrice = calculateItemPrice(item);
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    const calculateItemPrice = (item) => {
        let price = item.price;
        if (item.discount && item.discount > 0) {
            if (item.discountType === 'percentage') {
                price = item.price - (item.price * item.discount / 100);
            } else {
                price = item.price - item.discount;
            }
        }
        return Math.max(0, price);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartSummary = () => {
        const subtotal = getCartTotal();
        const itemCount = getCartItemCount();
        const shipping = subtotal > 5000 ? 0 : 200; // Free shipping over ₹5000
        const total = subtotal + shipping;

        return {
            itemCount,
            subtotal,
            shipping,
            total,
            freeShippingThreshold: 5000,
            isEligibleForFreeShipping: subtotal >= 5000
        };
    };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    calculateItemPrice,
    getCartItemCount,
    getCartSummary
  };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
