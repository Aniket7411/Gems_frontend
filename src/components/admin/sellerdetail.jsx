import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SellerDetails = () => {
    //   const { sellerId } = useParams();
    const sellerId = 1;
    const navigate = useNavigate();
    const [seller, setSeller] = useState(null);
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellerDetails = async () => {
            try {
                // Simulate API calls
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock seller data
                const mockSeller = {
                    _id: sellerId,
                    name: 'Diamond Dreams',
                    email: 'contact@diamonddreams.com',
                    phone: '+1-555-0101',
                    registrationDate: '2023-01-15',
                    status: 'active',
                    shopName: 'Diamond Dreams Jewelry',
                    address: '123 Gem Street, New York, NY 10001',
                    rating: 4.8,
                    totalSales: 124,
                    joinDate: '2023-01-15'
                };

                // Mock gems data
                const mockGems = [
                    {
                        id: 1,
                        name: 'Blue Sapphire',
                        category: 'Sapphire',
                        price: 2500,
                        status: 'available',
                        listedDate: '2023-10-15',
                        images: ['/api/placeholder/80/80']
                    },
                    {
                        id: 2,
                        name: 'Emerald Cut',
                        category: 'Emerald',
                        price: 1800,
                        status: 'sold',
                        listedDate: '2023-09-20',
                        images: ['/api/placeholder/80/80']
                    },
                    // Add more mock gems as needed
                ];

                setSeller(mockSeller);
                setGems(mockGems);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching seller details:', error);
                setLoading(false);
            }
        };

        fetchSellerDetails();
    }, [sellerId]);

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

    if (!seller) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Seller not found</h2>
                    <button
                        onClick={() => navigate('/admin/sellers')}
                        className="mt-4 text-indigo-600 hover:text-indigo-900"
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
                            <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
                            <p className="text-gray-600 mt-2">{seller.shopName}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
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
                                    <p className="mt-1 text-sm text-gray-900">{seller.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="mt-1 text-sm text-gray-900">{seller.phone}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <p className="mt-1 text-sm text-gray-900">{seller.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Gems List */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Listed Gems</h3>
                            <div className="space-y-4">
                                {gems.map((gem) => (
                                    <div key={gem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center text-white font-medium">
                                                {gem.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="text-sm font-medium text-gray-900">{gem.name}</h4>
                                                <p className="text-sm text-gray-500">{gem.category}</p>
                                                <p className="text-sm text-gray-500">Listed: {gem.listedDate}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900">${gem.price}</p>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gem.status === 'available'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {gem.status.charAt(0).toUpperCase() + gem.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                    <span className="text-sm font-medium text-gray-900">{seller.rating}/5.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Total Sales</span>
                                    <span className="text-sm font-medium text-gray-900">{seller.totalSales}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Member Since</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Date(seller.joinDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Gems Listed</span>
                                    <span className="text-sm font-medium text-gray-900">{gems.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-150">
                                    Send Message
                                </button>
                                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                                    Edit Seller
                                </button>
                                <button className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-150">
                                    Suspend Account
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