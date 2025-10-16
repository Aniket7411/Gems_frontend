import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const SellerDetails = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSellerDetails = async () => {
            if (!sellerId) {
                setError('No seller ID provided');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                // Call API to get seller details
                const response = await adminAPI.getSellerById(sellerId);

                if (response.success && response.seller) {
                    setSeller(response.seller);

                    // If gems are included in response
                    if (response.gems && Array.isArray(response.gems)) {
                        setGems(response.gems);
                    } else if (response.data?.gems && Array.isArray(response.data.gems)) {
                        setGems(response.data.gems);
                    } else {
                        setGems([]);
                    }
                } else {
                    setError(response.message || 'Failed to fetch seller details');
                    setSeller(null);
                    setGems([]);
                }
            } catch (error) {
                console.error('Error fetching seller details:', error);
                setError(error.message || 'Error loading seller details');
                setSeller(null);
                setGems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerDetails();
    }, [sellerId]);

    const handleApprove = async () => {
        if (!window.confirm('Are you sure you want to approve this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'approved');
            if (response.success) {
                alert('Seller approved successfully!');
                setSeller({ ...seller, status: 'approved', isVerified: true });
            }
        } catch (error) {
            alert(error.message || 'Failed to approve seller');
        }
    };

    const handleSuspend = async () => {
        if (!window.confirm('Are you sure you want to suspend this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'suspended');
            if (response.success) {
                alert('Seller suspended successfully!');
                setSeller({ ...seller, status: 'suspended' });
            }
        } catch (error) {
            alert(error.message || 'Failed to suspend seller');
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Are you sure you want to reject this seller?')) return;

        try {
            const response = await adminAPI.updateSellerStatus(sellerId, 'rejected');
            if (response.success) {
                alert('Seller rejected successfully!');
                setSeller({ ...seller, status: 'rejected' });
            }
        } catch (error) {
            alert(error.message || 'Failed to reject seller');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to DELETE this seller? This action cannot be undone!')) return;

        try {
            const response = await adminAPI.deleteSeller(sellerId);
            if (response.success) {
                alert('Seller deleted successfully!');
                navigate('/admin/sellers');
            }
        } catch (error) {
            alert(error.message || 'Failed to delete seller');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading seller details...</p>
                </div>
            </div>
        );
    }

    if (error || !seller) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {error || 'Seller not found'}
                    </h2>
                    <p className="text-gray-600 mb-4">Unable to load seller details</p>
                    <button
                        onClick={() => navigate('/admin/sellers')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Back to Sellers
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/admin/sellers')}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 mb-4"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Sellers
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{seller.name || seller.fullName || 'N/A'}</h1>
                            <p className="text-gray-600 mt-2">{seller.shopName || 'N/A'}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${(seller.status || seller.isVerified) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {seller.status
                                    ? seller.status.charAt(0).toUpperCase() + seller.status.slice(1)
                                    : seller.isVerified ? 'Verified' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Seller Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{seller.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="mt-1 text-sm text-gray-900">{seller.phone || 'N/A'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {seller.address
                                            ? (typeof seller.address === 'string'
                                                ? seller.address
                                                : `${seller.address.street || ''}, ${seller.address.city || ''}, ${seller.address.state || ''} ${seller.address.pincode || ''}`.trim()
                                            )
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Gems List */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Listed Gems ({gems.length})
                            </h3>
                            {gems.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No gems listed yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {gems.map((gem) => (
                                        <div key={gem._id || gem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center flex-1">
                                                {gem.images && gem.images[0] ? (
                                                    <img
                                                        src={gem.images[0]}
                                                        alt={gem.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-medium">
                                                        {(gem.name || 'NA').split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-medium text-gray-900">{gem.name || 'N/A'}</h4>
                                                    <p className="text-sm text-gray-500">{gem.category || 'N/A'}</p>
                                                    <p className="text-xs text-gray-400">
                                                        Stock: {gem.stock || 0} | {gem.sizeWeight} {gem.sizeUnit}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-gray-900">₹{(gem.price || 0).toLocaleString()}</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gem.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {gem.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Seller Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Rating</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.rating || 'N/A'}/5.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total Sales</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.totalSales || seller.totalOrders || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Member Since</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {seller.joinDate || seller.createdAt
                                            ? new Date(seller.joinDate || seller.createdAt).toLocaleDateString()
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Gems Listed</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.totalGems || gems.length || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleApprove()}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-150"
                                >
                                    Approve Seller
                                </button>
                                <button
                                    onClick={() => handleSuspend()}
                                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-150"
                                >
                                    Suspend Account
                                </button>
                                <button
                                    onClick={() => handleReject()}
                                    className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-150"
                                >
                                    Reject Seller
                                </button>
                                <button
                                    onClick={() => handleDelete()}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-150"
                                >
                                    Delete Seller
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDetails;