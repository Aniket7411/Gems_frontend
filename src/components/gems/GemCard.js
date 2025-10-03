import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';

const GemCard = ({ gem, onAddToCart, onToggleWishlist, isWishlisted = false }) => {
    const calculatePrice = () => {
        if (gem.discount && gem.discount > 0) {
            const discountAmount = gem.discountType === 'percentage'
                ? (gem.price * gem.discount) / 100
                : gem.discount;
            return gem.price - discountAmount;
        }
        return gem.price;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getGemEmoji = (category) => {
        const emojiMap = {
            'Emerald': '💚',
            'Ruby': '🔴',
            'Sapphire': '💙',
            'Diamond': '💎',
            'Pearl': '🤍',
            'Coral': '🟥',
            'Gomed': '🤎',
            'Cat\'s Eye': '👁️',
            'Moonstone': '🌙',
            'Turquoise': '🩵',
            'Opal': '🌈',
            'Yellow Sapphire': '💛',
        };
        return emojiMap[category] || '💎';
    };

    const getGemGradient = (category) => {
        const gradientMap = {
            'Emerald': 'from-green-500 to-emerald-600',
            'Ruby': 'from-red-500 to-pink-600',
            'Sapphire': 'from-blue-500 to-indigo-600',
            'Diamond': 'from-gray-300 to-gray-500',
            'Pearl': 'from-gray-100 to-gray-300',
            'Coral': 'from-red-400 to-red-600',
            'Gomed': 'from-amber-500 to-orange-600',
            'Cat\'s Eye': 'from-yellow-400 to-gray-500',
            'Moonstone': 'from-blue-100 to-purple-200',
            'Turquoise': 'from-cyan-400 to-teal-500',
            'Opal': 'from-pink-200 to-purple-300',
            'Yellow Sapphire': 'from-yellow-400 to-amber-500',
        };
        return gradientMap[category] || 'from-gray-400 to-gray-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                {gem.images && gem.images.length > 0 ? (
                    <img
                        src={gem.images[0]}
                        alt={gem.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGemGradient(gem.category)} flex items-center justify-center`}>
                        <span className="text-6xl">{getGemEmoji(gem.category)}</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {gem.discount && gem.discount > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {gem.discountType === 'percentage' ? `${gem.discount}% OFF` : `₹${gem.discount} OFF`}
                        </span>
                    )}
                    {!gem.availability && (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => onToggleWishlist && onToggleWishlist(gem.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${isWishlisted
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                    >
                        <FaHeart className="w-4 h-4" />
                    </button>
                    <Link
                        to={`/gem/${gem.id}`}
                        className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-200"
                    >
                        <FaEye className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Category & Rating */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {gem.category}
                    </span>
                    <div className="flex items-center space-x-1">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600">4.8</span>
                    </div>
                </div>

                {/* Gem Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {gem.name}
                </h3>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(calculatePrice())}
                        </span>
                        {gem.discount && gem.discount > 0 && (
                            <span className="text-lg text-gray-500 line-through">
                                {formatPrice(gem.price)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => onAddToCart && onAddToCart(gem)}
                        disabled={!gem.availability}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${gem.availability
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <FaShoppingCart className="w-4 h-4" />
                        <span>{gem.availability ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>ID: {gem._id}</span>
                        <span className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${gem.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>{gem.availability ? 'Available' : 'Unavailable'}</span>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GemCard;
