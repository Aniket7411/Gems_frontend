import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MyOrders = () => {
    const navigate = useNavigate();

    // User Profile State (with edit functionality)
    const [userProfile, setUserProfile] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        address: {
            addressLine1: '123 Main Street',
            addressLine2: 'Apartment 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
        }
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ ...userProfile });

    // Dummy Orders Data
    const [orders] = useState([
        {
            id: 'ORD-2024-001',
            orderDate: '2024-10-05',
            status: 'delivered',
            totalAmount: 110000,
            deliveryDays: 7,
            expectedDelivery: '2024-10-12',
            items: [
                {
                    id: '1',
                    name: 'Natural Emerald (Panna)',
                    image: '/gemimages/emrald.webp',
                    price: 55000,
                    quantity: 2,
                    sizeWeight: 5.5,
                    sizeUnit: 'carat'
                }
            ],
            shippingAddress: {
                name: 'John Doe',
                phone: '+91 9876543210',
                addressLine1: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            }
        },
        {
            id: 'ORD-2024-002',
            orderDate: '2024-10-06',
            status: 'shipped',
            totalAmount: 75000,
            deliveryDays: 5,
            expectedDelivery: '2024-10-11',
            items: [
                {
                    id: '2',
                    name: 'Blue Sapphire (Neelam)',
                    image: '/gemimages/bluesapphire.webp',
                    price: 75000,
                    quantity: 1,
                    sizeWeight: 6.2,
                    sizeUnit: 'carat'
                }
            ],
            shippingAddress: {
                name: 'John Doe',
                phone: '+91 9876543210',
                addressLine1: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            }
        },
        {
            id: 'ORD-2024-003',
            orderDate: '2024-10-07',
            status: 'processing',
            totalAmount: 130000,
            deliveryDays: 7,
            expectedDelivery: '2024-10-14',
            items: [
                {
                    id: '3',
                    name: 'Yellow Sapphire (Pukhraj)',
                    image: '/gemimages/yellowsapphire.webp',
                    price: 45000,
                    quantity: 1,
                    sizeWeight: 4.8,
                    sizeUnit: 'carat'
                },
                {
                    id: '4',
                    name: 'Natural Ruby (Manik)',
                    image: '/gemimages/ruby.webp',
                    price: 85000,
                    quantity: 1,
                    sizeWeight: 7.0,
                    sizeUnit: 'carat'
                }
            ],
            shippingAddress: {
                name: 'John Doe',
                phone: '+91 9876543210',
                addressLine1: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            }
        }
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    // Get status badge styling
    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaBox className="inline-block mr-2" />;
            case 'processing':
                return <FaBox className="inline-block mr-2" />;
            case 'shipped':
                return <FaTruck className="inline-block mr-2" />;
            case 'delivered':
                return <FaCheckCircle className="inline-block mr-2" />;
            case 'cancelled':
                return <FaTimesCircle className="inline-block mr-2" />;
            default:
                return null;
        }
    };

    // Handle profile edit
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setEditedProfile({
                ...editedProfile,
                address: {
                    ...editedProfile.address,
                    [addressField]: value
                }
            });
        } else {
            setEditedProfile({
                ...editedProfile,
                [name]: value
            });
        }
    };

    const handleSaveProfile = () => {
        setUserProfile(editedProfile);
        setIsEditingProfile(false);
        // TODO: Add API call to save profile
        alert('Profile updated successfully!');
    };

    const handleCancelEdit = () => {
        setEditedProfile({ ...userProfile });
        setIsEditingProfile(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your profile and view your orders</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - User Profile */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Profile</h2>
                                {!isEditingProfile ? (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm sm:text-base"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="text-green-600 hover:text-green-700 flex items-center text-sm"
                                        >
                                            <FaSave className="mr-1" /> Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="text-red-600 hover:text-red-700 flex items-center text-sm"
                                        >
                                            <FaTimes className="mr-1" /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Profile Picture Placeholder */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                                    {isEditingProfile ? editedProfile.name.charAt(0).toUpperCase() : userProfile.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    {isEditingProfile ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedProfile.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
                                        />
                                    ) : (
                                        <p className="text-sm sm:text-base text-gray-900">{userProfile.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900">{userProfile.email}</p>
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    {isEditingProfile ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editedProfile.phone}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
                                            placeholder="+91 9876543210"
                                        />
                                    ) : (
                                        <p className="text-sm sm:text-base text-gray-900">{userProfile.phone}</p>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        Shipping Address
                                    </label>
                                    {isEditingProfile ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                name="address.addressLine1"
                                                value={editedProfile.address.addressLine1}
                                                onChange={handleProfileChange}
                                                placeholder="Address Line 1"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                            />
                                            <input
                                                type="text"
                                                name="address.addressLine2"
                                                value={editedProfile.address.addressLine2}
                                                onChange={handleProfileChange}
                                                placeholder="Address Line 2 (Optional)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    name="address.city"
                                                    value={editedProfile.address.city}
                                                    onChange={handleProfileChange}
                                                    placeholder="City"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    name="address.state"
                                                    value={editedProfile.address.state}
                                                    onChange={handleProfileChange}
                                                    placeholder="State"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    name="address.pincode"
                                                    value={editedProfile.address.pincode}
                                                    onChange={handleProfileChange}
                                                    placeholder="Pincode"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    name="address.country"
                                                    value={editedProfile.address.country}
                                                    onChange={handleProfileChange}
                                                    placeholder="Country"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm sm:text-base text-gray-900">
                                            <p>{userProfile.address.addressLine1}</p>
                                            {userProfile.address.addressLine2 && <p>{userProfile.address.addressLine2}</p>}
                                            <p>{userProfile.address.city}, {userProfile.address.state}</p>
                                            <p>{userProfile.address.pincode}, {userProfile.address.country}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">My Orders</h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-4xl sm:text-6xl mb-4">📦</div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6">Start shopping to see your orders here!</p>
                                    <button
                                        onClick={() => navigate('/shop')}
                                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 sm:space-y-6">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                                        >
                                            {/* Order Header */}
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                                        Order #{order.id}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-start sm:items-end space-y-1">
                                                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusBadge(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                    {order.status === 'shipped' && (
                                                        <p className="text-xs text-gray-600">
                                                            Expected: {new Date(order.expectedDelivery).toLocaleDateString('en-IN')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="space-y-3 mb-4">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-3 sm:space-x-4">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                {item.sizeWeight} {item.sizeUnit} × {item.quantity}
                                                            </p>
                                                            <p className="text-sm sm:text-base font-semibold text-gray-900">
                                                                ₹{(item.price * item.quantity).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Footer */}
                                            <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
                                                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                                                        ₹{order.totalAmount.toLocaleString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-emerald-600 hover:text-emerald-700 text-sm sm:text-base font-medium"
                                                >
                                                    View Details →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Order Details - {selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* Order Status */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Order Status</h4>
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                </span>
                                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                                    Expected delivery: {new Date(selectedOrder.expectedDelivery).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })} ({selectedOrder.deliveryDays} days)
                                </p>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 pb-3 border-b last:border-b-0">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-sm sm:text-base font-medium text-gray-900">{item.name}</h5>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    {item.sizeWeight} {item.sizeUnit}
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                                    <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                                    <p className="text-gray-700">{selectedOrder.shippingAddress.phone}</p>
                                    <p className="text-gray-700 mt-2">{selectedOrder.shippingAddress.addressLine1}</p>
                                    <p className="text-gray-700">
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                                    </p>
                                    <p className="text-gray-700">{selectedOrder.shippingAddress.pincode}</p>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between text-base sm:text-lg font-semibold">
                                            <span>Total</span>
                                            <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                {selectedOrder.status === 'pending' && (
                                    <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base">
                                        Cancel Order
                                    </button>
                                )}
                                {selectedOrder.status === 'delivered' && (
                                    <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base">
                                        Reorder
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;



