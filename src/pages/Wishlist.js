import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';

const Wishlist = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await wishlistAPI.getWishlist();
            if (response.success) {
                setWishlistItems(response.data || response.wishlist || []);
            } else {
                setError('Failed to load wishlist');
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setError(err.message || 'Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (gemId) => {
        try {
            const response = await wishlistAPI.removeFromWishlist(gemId);
            if (response.success) {
                setWishlistItems(wishlistItems.filter(item => item.id !== gemId));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert('Failed to remove from wishlist');
        }
    };

    const handleAddToCart = (item) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            discount: item.discount,
            discountType: item.discountType,
            image: item.images?.[0] || null,
            category: item.category,
            sizeWeight: item.sizeWeight,
            sizeUnit: item.sizeUnit
        });
        alert(`${item.name} added to cart!`);
    };

    const handleClearWishlist = async () => {
        if (!window.confirm('Are you sure you want to clear your entire wishlist?')) {
            return;
        }

        try {
            const response = await wishlistAPI.clearWishlist();
            if (response.success) {
                setWishlistItems([]);
            }
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            alert('Failed to clear wishlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <FaHeart className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Wishlist</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchWishlist}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
                    >
                        <FaArrowLeft />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="text-center py-20">
                        <FaHeart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start adding gems you love to your wishlist and never lose track of them!
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl font-semibold"
                        >
                            Explore Gems
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
                                <FaHeart className="text-red-500 mr-3" />
                                My Wishlist
                            </h1>
                            <p className="text-gray-600">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                        {wishlistItems.length > 0 && (
                            <button
                                onClick={handleClearWishlist}
                                className="text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Wishlist Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {wishlistItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                    <img
                                        src={item.images?.[0] || '/placeholder-gem.jpg'}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                                        onClick={() => navigate(`/gem/${item.id}`)}
                                    />
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item.id)}
                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-colors"
                                        title="Remove from wishlist"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                    {item.discount > 0 && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            {item.discountType === 'percentage' ? `${item.discount}% OFF` : `₹${item.discount} OFF`}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3
                                        className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-emerald-600 transition-colors"
                                        onClick={() => navigate(`/gem/${item.id}`)}
                                    >
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-emerald-600 font-medium mb-2">{item.category}</p>

                                    {/* Price */}
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="text-xl font-bold text-gray-900">
                                            ₹{(item.discount > 0
                                                ? item.discountType === 'percentage'
                                                    ? item.price - (item.price * item.discount) / 100
                                                    : item.price - item.discount
                                                : item.price
                                            ).toLocaleString()}
                                        </span>
                                        {item.discount > 0 && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{item.price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Specifications */}
                                    {item.sizeWeight && (
                                        <p className="text-sm text-gray-600 mb-4">
                                            {item.sizeWeight} {item.sizeUnit}
                                        </p>
                                    )}

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                                    >
                                        <FaShoppingCart className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Wishlist;

