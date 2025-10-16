import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI } from '../services/api';
import { FaCreditCard, FaTruck, FaCheck, FaLock } from 'react-icons/fa';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartSummary, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');

    // Form states
    const [shippingAddress, setShippingAddress] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderNotes, setOrderNotes] = useState('');

    const cartSummary = getCartSummary();

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    gemId: item.id,
                    quantity: item.quantity,
                    price: item.discount && item.discount > 0
                        ? item.discountType === 'percentage'
                            ? item.price - (item.price * item.discount) / 100
                            : item.price - item.discount
                        : item.price
                })),
                shippingAddress,
                paymentMethod,
                orderNotes,
                totalAmount: cartSummary.total
            };

            const response = await orderAPI.createOrder(orderData);

            if (response.success) {
                const createdOrderId = response.data?.orderId || response.order?.id || response.orderId;

                // If payment method is online, initiate payment gateway
                if (paymentMethod === 'online') {
                    await handleOnlinePayment(createdOrderId, cartSummary.total);
                } else {
                    // For COD, directly show success
                    setOrderId(createdOrderId);
                    clearCart();
                    navigate(`/payment-success?orderId=${createdOrderId}&amount=${cartSummary.total}`);
                }
            } else {
                alert(response.message || 'Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert(error.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOnlinePayment = async (orderId, amount) => {
        try {
            // Load Razorpay script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_xxxxxxxxxx', // Replace with actual key
                    amount: amount * 100, // Amount in paise
                    currency: 'INR',
                    name: 'Aurelane Gems',
                    description: `Order #${orderId}`,
                    image: '/logo192.png',
                    order_id: orderId,
                    handler: function (response) {
                        // Payment successful
                        clearCart();
                        navigate(`/payment-success?orderId=${orderId}&paymentId=${response.razorpay_payment_id}&amount=${amount}`);
                    },
                    prefill: {
                        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                        email: shippingAddress.email,
                        contact: shippingAddress.phone
                    },
                    notes: {
                        orderId: orderId,
                        orderNotes: orderNotes
                    },
                    theme: {
                        color: '#059669'
                    },
                    modal: {
                        ondismiss: function () {
                            // Payment cancelled
                            setLoading(false);
                            navigate(`/payment-failure?orderId=${orderId}&message=Payment cancelled by user`);
                        }
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', function (response) {
                    // Payment failed
                    navigate(`/payment-failure?orderId=${orderId}&message=${response.error.description}&reason=${response.error.reason}`);
                });
                razorpay.open();
            };

            script.onerror = () => {
                alert('Failed to load payment gateway. Please try again.');
                setLoading(false);
            };
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment initialization failed. Please try again.');
            setLoading(false);
        }
    };

    const validateForm = () => {
        const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
        for (const field of required) {
            if (!shippingAddress[field].trim()) {
                alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }
        return true;
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
                >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                        Your order <span className="font-semibold text-emerald-600">{orderId}</span> has been placed and will be processed soon.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            View Orders
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={shippingAddress.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={shippingAddress.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingAddress.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingAddress.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                    <textarea
                                        name="address"
                                        value={shippingAddress.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={shippingAddress.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                            <div className="space-y-4">
                                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="ml-4 flex items-center space-x-3">
                                        <FaTruck className="w-6 h-6 text-emerald-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                                            <p className="text-sm text-gray-600">Pay when your order arrives</p>
                                        </div>
                                    </div>
                                </label>
                                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 relative">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="ml-4 flex items-center space-x-3">
                                        <FaCreditCard className="w-6 h-6 text-emerald-600" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Online Payment</h3>
                                            <p className="text-sm text-gray-600">Pay securely with card, UPI, or Net Banking</p>
                                            <p className="text-xs text-emerald-600 mt-1">Powered by Razorpay</p>
                                        </div>
                                    </div>
                                    <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                                        Secure
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Order Notes */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Notes (Optional)</h2>
                            <textarea
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                rows={3}
                                placeholder="Any special instructions for your order..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image || '/placeholder-gem.jpg'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                ₹{((item.discount && item.discount > 0
                                                    ? item.discountType === 'percentage'
                                                        ? item.price - (item.price * item.discount) / 100
                                                        : item.price - item.discount
                                                    : item.price) * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{cartSummary.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {cartSummary.shipping === 0 ? 'Free' : `₹${cartSummary.shipping.toLocaleString()}`}
                                    </span>
                                </div>
                                {cartSummary.discount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-₹{cartSummary.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>₹{cartSummary.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Placing Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaLock className="w-5 h-5" />
                                        <span>Place Order</span>
                                    </>
                                )}
                            </button>

                            {/* Security Notice */}
                            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                                <FaLock className="w-4 h-4 text-emerald-600" />
                                <span>Your payment information is secure and encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;