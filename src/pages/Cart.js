import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCartSummary } = useCart();
    const { isAuthenticated } = useAuth();

    const [showOTPModal, setShowOTPModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const cartSummary = getCartSummary();

    const handleQuantityChange = (gemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(gemId);
        } else {
            updateQuantity(gemId, newQuantity);
        }
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
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

            setShowOTPModal(false);
            setPhoneNumber('');
            setOtp('');
            setOtpSent(false);
            navigate('/checkout');
        } catch (error) {
            alert('Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added any gems to your cart yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">{cartSummary.itemCount} item(s) in your cart</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Image */}
                                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.images && item.images[0] ? item.images[0] : '/placeholder-gem.jpg'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.sizeWeight} {item.sizeUnit}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remove from cart"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Price and Quantity */}
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-lg font-semibold text-gray-900">
                                                    ₹{item.price.toLocaleString()}
                                                </span>
                                                {item.discount > 0 && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ₹{item.price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-2 border-x min-w-[3rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                                    disabled={item.stock && item.quantity >= item.stock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="mt-2 text-right">
                                            <span className="text-lg font-semibold text-gray-900">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={clearCart}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{cartSummary.subtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {cartSummary.shipping === 0 ? 'Free' : `₹${cartSummary.shipping}`}
                                    </span>
                                </div>

                                {!cartSummary.isEligibleForFreeShipping && (
                                    <div className="text-sm text-emerald-600">
                                        Add ₹{(cartSummary.freeShippingThreshold - cartSummary.subtotal).toLocaleString()} more for free shipping
                                    </div>
                                )}

                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>₹{cartSummary.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                            >
                                {isAuthenticated ? 'Proceed to Checkout' : 'Checkout with OTP'}
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </button>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                        className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                        className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {otpLoading ? 'Verifying...' : 'Verify & Checkout'}
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

export default Cart;

