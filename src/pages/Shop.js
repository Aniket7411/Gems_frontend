import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { gemAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import GemCard from '../components/gems/GemCard';
import GemFilters from '../components/gems/GemFilters';
import Pagination from '../components/gems/Pagination';
import { FaSpinner, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const Shop = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({});
    const [categories, setCategories] = useState([]);
    const [wishlist, setWishlist] = useState(new Set());

    // Filter states
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: '',
        category: '',
        zodiac: '',
        sortBy: 'newest'
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
            if (filters.category) params.category = filters.category;
            if (filters.zodiac) params.zodiac = filters.zodiac;
            if (filters.sortBy) params.sortBy = filters.sortBy;

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

    // Initial load
    useEffect(() => {
        fetchGems();
        fetchCategories();
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset to first page when filters change
        }));
    };

    // Handle search
    const handleSearch = (query) => {
        setFilters(prev => ({
            ...prev,
            search: query,
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
        setFilters({
            page: 1,
            limit: 12,
            search: '',
            category: '',
            zodiac: '',
            sortBy: 'newest'
        });
    };

    // Handle add to cart
    const handleAddToCart = (gem) => {
        addToCart({
            id: gem.id,
            name: gem.name,
            price: gem.price,
            discount: gem.discount,
            discountType: gem.discountType,
            image: gem.images?.[0] || null,
            category: gem.category
        });
    };

    // Handle wishlist toggle
    const handleToggleWishlist = (gemId) => {
        setWishlist(prev => {
            const newWishlist = new Set(prev);
            if (newWishlist.has(gemId)) {
                newWishlist.delete(gemId);
            } else {
                newWishlist.add(gemId);
            }
            return newWishlist;
        });
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
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-8">
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
                        {/* <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
                            Discover our exquisite collection of authentic, astrologically certified gemstones.
                            Each piece is carefully selected and energized for maximum spiritual and material benefits.
                        </p> */}
                        {/* <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>100% Authentic</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Astrologically Certified</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Free Shipping</span>
                            </div>
                        </div> */}
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <GemFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={categories}
                            onSearch={handleSearch}
                            onClearFilters={clearFilters}
                            totalResults={pagination.totalItems || 0}
                        />
                    </div>

                    {/* Gems Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-0">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {pagination.totalItems || 0} Gems Found
                                </h2>
                                {filters.search && (
                                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        Search: "{filters.search}"
                                        <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))} className="hover:bg-emerald-200 rounded-full p-0.5">✕</button>
                                    </span>
                                )}
                                {filters.category && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        Category: {filters.category}
                                        <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))} className="hover:bg-blue-200 rounded-full p-0.5">✕</button>
                                    </span>
                                )}
                                {filters.zodiac && (
                                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        Zodiac: {filters.zodiac}
                                        <button onClick={() => setFilters(prev => ({ ...prev, zodiac: '' }))} className="hover:bg-purple-200 rounded-full p-0.5">✕</button>
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
                                        className="text-center py-16"
                                    >
                                        <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Gems Found</h3>
                                        <p className="text-gray-500 mb-6">
                                            Try adjusting your filters or search terms to find what you're looking for.
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
                                                    key={gem.id}
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
                                                        isWishlisted={wishlist.has(gem.id)}
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
