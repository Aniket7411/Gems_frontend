import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gemAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import GemCard from '../components/gems/GemCard';
import Pagination from '../components/gems/Pagination';
import { FaSpinner, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const Shop = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});
    const [categories, setCategories] = useState([]);
    const [wishlist, setWishlist] = useState(new Set());
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: searchParams.get('query') || '',
        category: [], // Multiple categories
        minPrice: '',
        maxPrice: '',
        sort: 'newest'
    });

    // Temporary filter inputs (before apply)
    const [tempFilters, setTempFilters] = useState({
        search: searchParams.get('query') || '',
        category: [],
        minPrice: '',
        maxPrice: '',
        sort: 'newest'
    });

    // Fetch gems
    const fetchGems = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params
            const params = {};
            if (filters.page) params.page = filters.page;
            if (filters.limit) params.limit = filters.limit;
            if (filters.search) params.search = filters.search;
            if (filters.category && filters.category.length > 0) {
                params.category = filters.category.join(','); // Convert array to comma-separated string
            }
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.sort) params.sort = filters.sort;

            const response = await gemAPI.getGems(params);

            console.log("response", response);

            if (response.success) {
                setGems(response.data?.gems || response.gems || []);
                setPagination(response.data?.pagination || response.pagination || {});
            } else {
                setError('Failed to fetch gems');
            }
        } catch (err) {
            console.error('Error fetching gems:', err);
            setError(err.message || 'Failed to fetch gems');
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await gemAPI.getGemCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    // Fetch wishlist
    const fetchWishlist = async () => {
        if (!isAuthenticated) return;
        
        try {
            setLoadingWishlist(true);
            const response = await wishlistAPI.getWishlist();
            if (response.success && response.items) {
                const wishlistIds = new Set(
                    response.items.map(item => item.gem?._id || item.gem?.id || item.gem)
                );
                setWishlist(wishlistIds);
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoadingWishlist(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchGems();
        fetchCategories();
        fetchWishlist();
    }, [filters, isAuthenticated]);

    // Handle apply filters
    const handleApplyFilters = () => {
        setFilters(prev => ({
            ...prev,
            search: tempFilters.search,
            category: tempFilters.category,
            minPrice: tempFilters.minPrice,
            maxPrice: tempFilters.maxPrice,
            sort: tempFilters.sort,
            page: 1 // Reset to first page when filters change
        }));
    };

    // Handle search input
    const handleSearchChange = (e) => {
        setTempFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => ({
            ...prev,
            search: tempFilters.search,
            page: 1
        }));
    };

    // Handle category toggle
    const handleCategoryToggle = (category) => {
        setTempFilters(prev => {
            const isSelected = prev.category.includes(category);
            return {
                ...prev,
                category: isSelected
                    ? prev.category.filter(c => c !== category)
                    : [...prev.category, category]
            };
        });
    };

    // Handle price change
    const handlePriceChange = (type, value) => {
        setTempFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    // Handle sort change
    const handleSortChange = (value) => {
        setTempFilters(prev => ({
            ...prev,
            sort: value
        }));
        // Apply sort immediately
        setFilters(prev => ({
            ...prev,
            sort: value,
            page: 1
        }));
    };

    // Handle pagination
    const handlePageChange = (page, newLimit = null) => {
        setFilters(prev => ({
            ...prev,
            page,
            limit: newLimit || prev.limit
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        const resetFilters = {
            page: 1,
            limit: 12,
            search: '',
            category: [],
            minPrice: '',
            maxPrice: '',
            sort: 'newest'
        };
        setFilters(resetFilters);
        setTempFilters({
            search: '',
            category: [],
            minPrice: '',
            maxPrice: '',
            sort: 'newest'
        });
    };

    // Handle add to cart
    const handleAddToCart = (gem) => {
        addToCart({
            id: gem._id || gem.id, // Use _id from MongoDB or id
            name: gem.name,
            price: gem.price,
            discount: gem.discount,
            discountType: gem.discountType,
            image: gem.images?.[0] || null,
            category: gem.category,
            sizeWeight: gem.sizeWeight,
            sizeUnit: gem.sizeUnit
        });

        // Show success message
        alert(`${gem.name} added to cart!`);
    };

    // Handle wishlist toggle
    const handleToggleWishlist = async (gem) => {
        const gemId = gem._id || gem.id;
        
        if (!isAuthenticated) {
            alert('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        try {
            const isCurrentlyWishlisted = wishlist.has(gemId);
            
            // Optimistic update
            setWishlist(prev => {
                const newWishlist = new Set(prev);
                if (isCurrentlyWishlisted) {
                    newWishlist.delete(gemId);
                } else {
                    newWishlist.add(gemId);
                }
                return newWishlist;
            });

            // Make API call
            if (isCurrentlyWishlisted) {
                const response = await wishlistAPI.removeFromWishlist(gemId);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to remove from wishlist');
                }
            } else {
                const response = await wishlistAPI.addToWishlist(gemId);
                if (!response.success) {
                    throw new Error(response.message || 'Failed to add to wishlist');
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            // Revert optimistic update on error
            setWishlist(prev => {
                const newWishlist = new Set(prev);
                if (wishlist.has(gemId)) {
                    newWishlist.delete(gemId);
                } else {
                    newWishlist.add(gemId);
                }
                return newWishlist;
            });
            alert(error.message || 'Failed to update wishlist');
        }
    };

    // Loading state
    if (loading && gems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-xl text-gray-600">Loading gems...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            {/* Header Section */}
            {/* <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Premium Gemstones
                        </h1>
                        <p className="text-xl text-emerald-100">
                            Discover our collection of authentic gemstones
                        </p>
                        
                    </motion.div>
                </div>
            </div> */}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>

                            {/* Search */}
                            <form onSubmit={handleSearchSubmit} className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Gems
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={tempFilters.search}
                                        onChange={handleSearchChange}
                                        placeholder="Search by name..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Category (Multiple)
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={tempFilters.category.includes(category)}
                                                onChange={() => handleCategoryToggle(category)}
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-gray-700">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Price Range (₹)
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="number"
                                        value={tempFilters.minPrice}
                                        onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                                        placeholder="Min Price"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <input
                                        type="number"
                                        value={tempFilters.maxPrice}
                                        onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                                        placeholder="Max Price"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={tempFilters.sort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleApplyFilters}
                                    className="w-full px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Active Filters Count */}
                            <div className="mt-4 text-sm text-gray-600 text-center">
                                {pagination.totalItems || 0} gems found
                            </div>
                        </div>
                    </div>

                    {/* Gems Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {pagination.totalItems || 0} Gems Found
                            </h2>

                            {/* Active Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                {filters.search && (
                                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        Search: "{filters.search}"
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, search: '' }));
                                                setTempFilters(prev => ({ ...prev, search: '' }));
                                            }}
                                            className="hover:bg-emerald-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filters.category.map((cat) => (
                                    <span key={cat} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        {cat}
                                        <button
                                            onClick={() => {
                                                const newCategories = filters.category.filter(c => c !== cat);
                                                setFilters(prev => ({ ...prev, category: newCategories }));
                                                setTempFilters(prev => ({ ...prev, category: newCategories }));
                                            }}
                                            className="hover:bg-blue-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                                {(filters.minPrice || filters.maxPrice) && (
                                    <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        Price: ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                                        <button
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                                                setTempFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                                            }}
                                            className="hover:bg-purple-200 rounded-full p-0.5"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {filters.sort !== 'newest' && (
                                    <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                        Sort: {filters.sort === 'oldest' ? 'Oldest' : filters.sort === 'price-low' ? 'Price Low-High' : 'Price High-Low'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Error State */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
                            >
                                <div className="flex items-center space-x-3">
                                    <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-800">Error Loading Gems</h3>
                                        <p className="text-red-600">{error}</p>
                                        <button
                                            onClick={fetchGems}
                                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Gems Grid */}
                        {!error && (
                            <>
                                {gems.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-20 bg-white rounded-2xl shadow-lg"
                                    >
                                        <FaSearch className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                                            No matching gems found
                                        </h3>
                                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                            Try different filters or search terms to discover our beautiful collection of gemstones.
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-8 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            Clear All Filters
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        layout
                                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
                                    >
                                        <AnimatePresence>
                                            {gems.map((gem) => (
                                                <motion.div
                                                    key={gem._id || gem.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <GemCard
                                                        gem={gem}
                                                        onAddToCart={handleAddToCart}
                                                        onToggleWishlist={handleToggleWishlist}
                                                        isWishlisted={wishlist.has(gem._id || gem.id)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <Pagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                        hasNext={pagination.hasNext}
                                        hasPrev={pagination.hasPrev}
                                        totalItems={pagination.totalItems}
                                        itemsPerPage={filters.limit}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
