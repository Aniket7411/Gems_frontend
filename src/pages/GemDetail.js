import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gemAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const GemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [gem, setGem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const fetchGemDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await gemAPI.getGemById(id);
            if (response.success) {
                setGem(response.data);
            } else {
                setError('Gem not found');
            }
        } catch (error) {
            console.error('Error fetching gem:', error);
            setError('Failed to load gem details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchGemDetails();
    }, [fetchGemDetails]);

    const handleAddToCart = () => {
        if (isAuthenticated) {
            addToCart(gem, quantity);
            // Show success message or notification
            alert('Added to cart successfully!');
        } else {
            setShowOTPModal(true);
        }
    };

    const handleSendOTP = async () => {
        if (!phoneNumber.trim()) {
            alert('Please enter a valid phone number');
            return;
        }

        setOtpLoading(true);
        try {
            // Simulate OTP sending - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOtpSent(true);
            alert('OTP sent to your phone number');
        } catch (error) {
            alert('Failed to send OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp.trim()) {
            alert('Please enter the OTP');
            return;
        }

        setOtpLoading(true);
        try {
            // Simulate OTP verification - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Add to cart after successful OTP verification
            addToCart(gem, quantity);
            setShowOTPModal(false);
            setPhoneNumber('');
            setOtp('');
            setOtpSent(false);
            alert('Added to cart successfully!');
        } catch (error) {
            alert('Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const calculateDiscountedPrice = () => {
        if (!gem) return 0;

        let discountedPrice = gem.price;
        if (gem.discount && gem.discount > 0) {
            if (gem.discountType === 'percentage') {
                discountedPrice = gem.price - (gem.price * gem.discount / 100);
            } else {
                discountedPrice = gem.price - gem.discount;
            }
        }
        return Math.max(0, discountedPrice);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading gem details...</p>
                </div>
            </div>
        );
    }

    if (error || !gem) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Gem Not Found</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const discountedPrice = calculateDiscountedPrice();
    const discountAmount = gem.price - discountedPrice;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li><button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button></li>
                        <li>/</li>
                        <li><button onClick={() => navigate('/shop')} className="hover:text-blue-600">Shop</button></li>
                        <li>/</li>
                        <li><span className="text-gray-900">{gem.name}</span></li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                            <img
                                src={gem.allImages && gem.allImages[selectedImageIndex] ? gem.allImages[selectedImageIndex] : '/placeholder-gem.jpg'}
                                alt={gem.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {gem.allImages && gem.allImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {gem.allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
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
                        {/* Basic Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{gem.name}</h1>
                            <p className="text-lg text-gray-600 mb-4">{gem.category}</p>

                            {/* Price */}
                            <div className="flex items-center space-x-4 mb-4">
                                <span className="text-3xl font-bold text-gray-900">₹{discountedPrice.toLocaleString()}</span>
                                {discountAmount > 0 && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">₹{gem.price.toLocaleString()}</span>
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                                            {gem.discountType === 'percentage' ? `${gem.discount}% OFF` : `₹${gem.discount} OFF`}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Rating & Reviews */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">(4.8) • 24 reviews</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{gem.description}</p>
                        </div>

                        {/* Physical Properties */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-1">Size/Weight</h4>
                                <p className="text-gray-600">{gem.sizeWeight} {gem.sizeUnit}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-1">Origin</h4>
                                <p className="text-gray-600">{gem.origin}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-1">Certification</h4>
                                <p className="text-gray-600">{gem.certification}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-1">Availability</h4>
                                <p className={`${gem.availability ? 'text-green-600' : 'text-red-600'}`}>
                                    {gem.availability ? 'In Stock' : 'Out of Stock'}
                                </p>
                            </div>
                        </div>

                        {/* Astrological Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Astrological Information</h3>

                            {/* Zodiac Signs */}
                            <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Suitable for Zodiac Signs:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {gem.whomToUse.map((sign, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {sign}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Benefits */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {gem.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="border-t pt-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <label className="text-sm font-medium text-gray-900">Quantity:</label>
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 border-x">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                        disabled={!gem.availability || (gem.stock && quantity >= gem.stock)}
                                    >
                                        +
                                    </button>
                                </div>
                                {gem.stock && (
                                    <span className="text-sm text-gray-500">
                                        {gem.stock} available
                                    </span>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!gem.availability}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${gem.availability
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {gem.availability ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    View Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {otpSent ? 'Verify OTP' : 'Enter Phone Number'}
                        </h3>

                        {!otpSent ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowOTPModal(false)}
                                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendOTP}
                                        disabled={otpLoading}
                                        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {otpLoading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtp('');
                                        }}
                                        className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={otpLoading}
                                        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {otpLoading ? 'Verifying...' : 'Verify & Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GemDetail;
