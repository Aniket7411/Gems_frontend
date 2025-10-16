import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gemAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaHeart, FaShoppingCart, FaStar, FaArrowLeft, FaShare, FaCheck, FaTruck, FaCertificate } from 'react-icons/fa';

const GemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [gem, setGem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        fetchGemDetails();
        if (isAuthenticated) {
            checkWishlistStatus();
        }
    }, [id, isAuthenticated]);

    const fetchGemDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await gemAPI.getGemById(id);

            if (response.success) {
                setGem(response.data || response.gem);
            } else {
                setError('Gem not found');
            }
        } catch (err) {
            console.error('Error fetching gem details:', err);
            setError(err.message || 'Failed to fetch gem details');
        } finally {
            setLoading(false);
        }
    };

    const checkWishlistStatus = async () => {
        try {
            const response = await wishlistAPI.isInWishlist(id);
            if (response.success) {
                setIsWishlisted(response.isInWishlist || false);
            }
        } catch (err) {
            console.error('Error checking wishlist:', err);
        }
    };

    const calculatePrice = () => {
        if (!gem) return 0;
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

    const handleAddToCart = async () => {
        if (!gem) return;

        setAddingToCart(true);
        try {
            // Add to local cart context with the specified quantity
            addToCart({
                id: gem._id || gem.id, // Use _id from MongoDB or id
                name: gem.name,
                price: gem.price,
                discount: gem.discount,
                discountType: gem.discountType,
                image: gem.allImages?.[0] || gem.images?.[0] || null,
                category: gem.category,
                sizeWeight: gem.sizeWeight,
                sizeUnit: gem.sizeUnit,
                quantity: quantity // Pass the quantity directly
            });

            // Show success feedback
            alert(`Added ${quantity} ${gem.name} to cart!`);

            // Reset quantity to 1
            setQuantity(1);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            alert('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        try {
            if (isWishlisted) {
                const response = await wishlistAPI.removeFromWishlist(id);
                if (response.success) {
                    setIsWishlisted(false);
                }
            } else {
                const response = await wishlistAPI.addToWishlist(id);
                if (response.success) {
                    setIsWishlisted(true);
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            alert(error.message || 'Failed to update wishlist');
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => {
            navigate('/checkout');
        }, 500);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= (gem?.stock || 10)) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading gem details...</p>
                </div>
            </div>
        );
    }

    if (error || !gem) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">💎</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gem Not Found</h2>
                    <p className="text-gray-600 mb-8">{error || 'The gem you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{gem.name}</h1>
                            <p className="text-gray-600">{gem.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                <FaShare className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleToggleWishlist}
                                className={`p-2 transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                                    }`}
                                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <FaHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                            {gem.allImages && gem.allImages.length > 0 ? (
                                <img
                                    src={gem.allImages[selectedImage]}
                                    alt={gem.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${getGemGradient(gem.category)} flex items-center justify-center`}>
                                    <span className="text-8xl">{getGemEmoji(gem.category)}</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {gem.allImages && gem.allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {gem.allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-emerald-500 ring-2 ring-emerald-200'
                                            : 'border-gray-200 hover:border-emerald-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${gem.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Title and Rating */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{gem.name}</h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-1">
                                    <FaStar className="w-5 h-5 text-yellow-400" />
                                    <span className="text-lg font-semibold">4.8</span>
                                    <span className="text-gray-500">(127 reviews)</span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {gem.category}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-gray-900">
                                    {formatPrice(calculatePrice())}
                                </span>
                                {gem.discount && gem.discount > 0 && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">
                                            {formatPrice(gem.price)}
                                        </span>
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                                            {gem.discountType === 'percentage' ? `${gem.discount}% OFF` : `₹${gem.discount} OFF`}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {gem.description && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{gem.description}</p>
                            </div>
                        )}

                        {/* Specifications */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-1">Weight</h4>
                                <p className="text-gray-600">{gem.sizeWeight} {gem.sizeUnit}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-1">Stock</h4>
                                <p className="text-gray-600">{gem.stock || 'Available'} pieces</p>
                            </div>
                            {gem.origin && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-1">Origin</h4>
                                    <p className="text-gray-600">{gem.origin}</p>
                                </div>
                            )}
                            {gem.certification && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-1">Certification</h4>
                                    <p className="text-gray-600">{gem.certification}</p>
                                </div>
                            )}
                        </div>

                        {/* Astrological Information */}
                        {gem.whomToUse && gem.whomToUse.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Suitable For</h3>
                                <div className="flex flex-wrap gap-2">
                                    {gem.whomToUse.map((zodiac, index) => (
                                        <span
                                            key={index}
                                            className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {zodiac}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Benefits */}
                        {gem.benefits && gem.benefits.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                                <ul className="space-y-2">
                                    {gem.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-center space-x-2">
                                            <FaCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            <span className="text-gray-600">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Quantity and Add to Cart */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="font-semibold text-gray-900">Quantity:</span>
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 border-x min-w-[3rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                        disabled={gem.stock && quantity >= gem.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!gem.availability || addingToCart}
                                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${gem.availability && !addingToCart
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 transform hover:scale-105'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <FaShoppingCart className="w-5 h-5" />
                                    <span>
                                        {addingToCart ? 'Adding...' : gem.availability ? 'Add to Cart' : 'Out of Stock'}
                                    </span>
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={!gem.availability || addingToCart}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${gem.availability && !addingToCart
                                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                            <div className="flex items-center space-x-3">
                                <FaTruck className="w-6 h-6 text-emerald-600" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                                    <p className="text-sm text-gray-600">On orders over ₹50,000</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaTruck className="w-6 h-6 text-emerald-600" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                                    <p className="text-sm text-gray-600">100% secure checkout</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaCertificate className="w-6 h-6 text-emerald-600" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Authentic</h4>
                                    <p className="text-sm text-gray-600">Certified gemstones</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GemDetail;