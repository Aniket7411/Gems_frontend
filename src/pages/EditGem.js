import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gemAPI, authAPI } from '../services/api';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const EditGem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [gemData, setGemData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        discount: 0,
        discountType: 'percentage',
        sizeWeight: '',
        sizeUnit: 'carat',
        stock: 0,
        origin: '',
        certification: '',
        availability: 'available'
    });

    const categories = [
        'Ruby', 'Sapphire', 'Emerald', 'Diamond', 'Pearl',
        'Coral', 'Yellow Sapphire', 'Hessonite', "Cat's Eye",
        'Moonstone', 'Opal', 'Turquoise'
    ];

    useEffect(() => {
        if (!authAPI.isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchGemData();
    }, [id]);

    const fetchGemData = async () => {
        try {
            setLoading(true);
            const response = await gemAPI.getGemById(id);
            if (response.success) {
                const gem = response.data || response.gem;
                setGemData({
                    name: gem.name || '',
                    category: gem.category || '',
                    description: gem.description || '',
                    price: gem.price || '',
                    discount: gem.discount || 0,
                    discountType: gem.discountType || 'percentage',
                    sizeWeight: gem.sizeWeight || '',
                    sizeUnit: gem.sizeUnit || 'carat',
                    stock: gem.stock || 0,
                    origin: gem.origin || '',
                    certification: gem.certification || '',
                    availability: gem.availability || 'available'
                });
            }
        } catch (err) {
            console.error('Error fetching gem:', err);
            setError(err.message || 'Failed to fetch gem details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            // Handle number inputs with proper rounding
            let processedValue = value;
            
            // For integer fields (stock), round to nearest integer
            if (name === 'stock') {
                processedValue = value === '' ? '' : Math.round(parseFloat(value) || 0);
            }
            // For decimal fields (price, discount, sizeWeight), round to 2 decimal places
            else if (name === 'price' || name === 'discount' || name === 'sizeWeight') {
                processedValue = value === '' ? '' : Math.round((parseFloat(value) || 0) * 100) / 100;
            }
            
            setGemData(prev => ({
                ...prev,
                [name]: processedValue
            }));
        } else {
            setGemData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gemData.name || !gemData.category || !gemData.price) {
            alert('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const response = await gemAPI.updateGem(id, gemData);
            if (response.success) {
                alert('Gem updated successfully!');
                navigate('/seller-dashboard');
            }
        } catch (error) {
            console.error('Error updating gem:', error);
            alert(error.message || 'Failed to update gem');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading gem details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Gem</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/seller-dashboard')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/seller-dashboard')}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
                    >
                        <FaArrowLeft />
                        <span>Back to Dashboard</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Gem</h1>
                    <p className="text-gray-600 mt-2">Update your gem details</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gem Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gem Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={gemData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Natural Blue Sapphire"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={gemData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={gemData.price}
                                onChange={handleChange}
                                onBlur={(e) => {
                                    // Round to 2 decimal places on blur
                                    const value = parseFloat(e.target.value);
                                    if (!isNaN(value)) {
                                        const rounded = Math.round(value * 100) / 100;
                                        setGemData(prev => ({ ...prev, price: rounded }));
                                    }
                                }}
                                required
                                min="0"
                                step="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="75000"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={gemData.stock}
                                onChange={handleChange}
                                onBlur={(e) => {
                                    // Round to nearest integer on blur
                                    const value = parseFloat(e.target.value);
                                    if (!isNaN(value)) {
                                        const rounded = Math.round(value);
                                        setGemData(prev => ({ ...prev, stock: rounded }));
                                    }
                                }}
                                required
                                min="0"
                                step="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="10"
                            />
                        </div>

                        {/* Size Weight */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Weight/Size
                            </label>
                            <input
                                type="number"
                                name="sizeWeight"
                                value={gemData.sizeWeight}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="6.2"
                            />
                        </div>

                        {/* Size Unit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit
                            </label>
                            <select
                                name="sizeUnit"
                                value={gemData.sizeUnit}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="carat">Carat</option>
                                <option value="gram">Gram</option>
                                <option value="ratti">Ratti</option>
                            </select>
                        </div>

                        {/* Discount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount
                            </label>
                            <input
                                type="number"
                                name="discount"
                                value={gemData.discount}
                                onChange={handleChange}
                                onBlur={(e) => {
                                    // Round to 2 decimal places on blur
                                    const value = parseFloat(e.target.value);
                                    if (!isNaN(value)) {
                                        const rounded = Math.round(value * 100) / 100;
                                        setGemData(prev => ({ ...prev, discount: rounded }));
                                    }
                                }}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="10"
                            />
                        </div>

                        {/* Discount Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Type
                            </label>
                            <select
                                name="discountType"
                                value={gemData.discountType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>

                        {/* Origin */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Origin
                            </label>
                            <input
                                type="text"
                                name="origin"
                                value={gemData.origin}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Ceylon"
                            />
                        </div>

                        {/* Certification */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Certification
                            </label>
                            <input
                                type="text"
                                name="certification"
                                value={gemData.certification}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="GIA Certified"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={gemData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Premium quality natural gem..."
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/seller-dashboard')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGem;

