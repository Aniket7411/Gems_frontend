import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gemAPI, wishlistAPI, reviewAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaHeart, FaShoppingCart, FaStar, FaArrowLeft, FaShare, FaCheck, FaTruck, FaCertificate } from 'react-icons/fa';
import GemCard from '../components/gems/GemCard';
import axios from 'axios';

const GemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, isInCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [gem, setGem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [showAllBenefits, setShowAllBenefits] = useState(false);
    const [showAllSuitableFor, setShowAllSuitableFor] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const [togglingWishlist, setTogglingWishlist] = useState(false);

    useEffect(() => {
        console.log('GemDetail mounted. Gem ID:', id, 'Is Authenticated:', isAuthenticated);
        fetchGemDetails();
        if (isAuthenticated) {
            checkWishlistStatus();
        }
        fetchReviews();
    }, [id, isAuthenticated]);

    // Keyboard support and body scroll lock for image modal
    useEffect(() => {
        if (!showImageModal) {
            document.body.style.overflow = '';
            return;
        }

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowImageModal(false);
            } else if (e.key === 'ArrowLeft') {
                const allImages = [];
                if (gem?.heroImage) allImages.push(gem.heroImage);
                if (gem?.additionalImages && gem.additionalImages.length > 0) {
                    allImages.push(...gem.additionalImages);
                }
                const imagesToShow = allImages.length > 0 ? allImages : (gem?.allImages || []);
                if (imagesToShow.length > 1) {
                    setModalImageIndex((prev) => prev === 0 ? imagesToShow.length - 1 : prev - 1);
                }
            } else if (e.key === 'ArrowRight') {
                const allImages = [];
                if (gem?.heroImage) allImages.push(gem.heroImage);
                if (gem?.additionalImages && gem.additionalImages.length > 0) {
                    allImages.push(...gem.additionalImages);
                }
                const imagesToShow = allImages.length > 0 ? allImages : (gem?.allImages || []);
                if (imagesToShow.length > 1) {
                    setModalImageIndex((prev) => prev === imagesToShow.length - 1 ? 0 : prev + 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [showImageModal, gem]);

    const fetchGemDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await gemAPI.getGemById(id);




            if (response.success) {
                const gemData = response.data || response.gem;
                // Combine heroImage and additionalImages for gallery
                const allImages = [];
                if (gemData.heroImage) allImages.push(gemData.heroImage);
                if (gemData.additionalImages && gemData.additionalImages.length > 0) {
                    allImages.push(...gemData.additionalImages);
                }
                // Update gem with combined images
                setGem({ ...gemData, allImages });

                // Handle related products
                if (response.relatedProducts && Array.isArray(response.relatedProducts)) {
                    setRelatedProducts(response.relatedProducts);
                }
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
            console.log('Checking wishlist status for gem:', id);
            const response = await wishlistAPI.isInWishlist(id);
            console.log('Wishlist status response:', response);
            if (response.success) {
                setIsWishlisted(response.isInWishlist || false);
                console.log('Is wishlisted:', response.isInWishlist);
            }
        } catch (err) {
            console.error('Error checking wishlist status:', err);
            // Set to false on error
            setIsWishlisted(false);
        }
    };

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const response = await reviewAPI.getGemReviews(id);
            if (response.success) {
                setReviews(response.reviews || response.data || []);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoadingReviews(false);
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
                image: gem.allImages?.[0] || gem.heroImage || gem.images?.[0] || null,
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

        if (togglingWishlist) {
            console.log('Already toggling wishlist, please wait');
            return;
        }

        setTogglingWishlist(true);
        console.log('Toggling wishlist. Current status:', isWishlisted);

        try {
            if (isWishlisted) {
                console.log('Removing from wishlist...');
                const response = await wishlistAPI.removeFromWishlist(id);
                console.log('Remove response:', response);
                if (response.success) {
                    setIsWishlisted(false);
                    alert('Removed from wishlist');
                } else {
                    throw new Error(response.message || 'Failed to remove from wishlist');
                }
            } else {
                console.log('Adding to wishlist...');
                const response = await wishlistAPI.addToWishlist(id);
                console.log('Add response:', response);
                if (response.success) {
                    setIsWishlisted(true);
                    alert('Added to wishlist');
                } else {
                    throw new Error(response.message || 'Failed to add to wishlist');
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            alert(error.message || 'Failed to update wishlist. Please try again.');
        } finally {
            setTogglingWishlist(false);
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

    const handleRelatedProductAddToCart = (relatedGem) => {
        addToCart({
            id: relatedGem._id || relatedGem.id,
            name: relatedGem.name,
            price: relatedGem.price,
            discount: relatedGem.discount,
            discountType: relatedGem.discountType,
            image: relatedGem.heroImage || relatedGem.images?.[0] || null,
            category: relatedGem.category,
            sizeWeight: relatedGem.sizeWeight,
            sizeUnit: relatedGem.sizeUnit,
            quantity: 1
        });
    };
console.log("nbjba")
    const handleRelatedProductWishlist = async (relatedGem) => {
        if (!isAuthenticated) {
            alert('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        const gemId = relatedGem._id || relatedGem.id;

        console.log('Related product wishlist toggle:', { relatedGem, gemId });

        if (!gemId) {
            console.error('No gem ID found for related product:', relatedGem);
            alert('Cannot add to wishlist - invalid gem ID');
            return;
        }

        try {
            // For now, always try to add (we don't track wishlist state for related products)
            const response = await wishlistAPI.addToWishlist(gemId);
            if (response.success) {
                alert('Added to wishlist!');
            } else {
                throw new Error(response.message || 'Failed to add to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            alert(error.message || 'Failed to add to wishlist');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            {/* Debug Panel - Remove this after testing */}
            {/* <div className="bg-yellow-100 border border-yellow-400 p-4 m-4 rounded-lg text-sm">
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <ul className="space-y-1">
                    <li>✓ Is Authenticated: <strong>{isAuthenticated ? 'YES' : 'NO'}</strong></li>
                    <li>✓ User: <strong>{user?.name || 'Not logged in'}</strong></li>
                    <li>✓ Token: <strong>{localStorage.getItem('token') ? 'Present' : 'Missing'}</strong></li>
                    <li>✓ Is Wishlisted: <strong>{isWishlisted ? 'YES' : 'NO'}</strong></li>
                    <li>✓ Toggling: <strong>{togglingWishlist ? 'YES' : 'NO'}</strong></li>
                    <li>✓ Gem ID: <strong>{id}</strong></li>
                </ul>
                <p className="mt-2 text-xs text-gray-600">Open browser console (F12) for detailed logs</p>
                <button
                    onClick={async () => {
                        console.log('=== TEST BUTTON CLICKED ===');
                        console.log('Token from localStorage:', localStorage.getItem('token'));
                        console.log('User from localStorage:', localStorage.getItem('user'));
                        console.log('Is Authenticated:', isAuthenticated);
                        console.log('Gem ID:', id);
                        
                        if (!isAuthenticated) {
                            alert('You are not authenticated! Please login first.');
                            return;
                        }
                        
                        try {
                            console.log('Attempting to add to wishlist...');
                            const response = await wishlistAPI.addToWishlist(id);
                            console.log('API Response:', response);
                            alert(`Success: ${JSON.stringify(response)}`);
                        } catch (error) {
                            console.error('API Error:', error);
                            alert(`Error: ${error.message}`);
                        }
                    }}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded text-xs hover:bg-blue-600 mr-2"
                >
                    Test Add to Wishlist API
                </button>
                <button
                    onClick={async () => {
                        console.log('=== DIRECT AXIOS TEST ===');
                        const token = localStorage.getItem('token');
                        const API_BASE_URL = 'https://gems-backend-u.onrender.com/api';
                        
                        console.log('Token:', token);
                        console.log('Gem ID:', id);
                        console.log('URL:', `${API_BASE_URL}/wishlist/add`);
                        
                        if (!token) {
                            alert('No token found! Please login first.');
                            return;
                        }
                        
                        try {
                            const response = await axios.post(
                                `${API_BASE_URL}/wishlist/add`,
                                { gemId: id },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    }
                                }
                            );
                            console.log('Direct axios response:', response.data);
                            alert(`Direct Success: ${JSON.stringify(response.data)}`);
                        } catch (error) {
                            console.error('Direct axios error:', error);
                            console.error('Error response:', error.response?.data);
                            alert(`Direct Error: ${error.response?.data?.message || error.message}`);
                        }
                    }}
                    className="mt-2 bg-purple-500 text-white px-4 py-2 rounded text-xs hover:bg-purple-600"
                >
                    Test Direct Backend Call
                </button>
            </div> */}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
                {/* Back Button - Simplified */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-4 lg:self-start relative z-10">
                        {/* Main Image */}
                        <motion.div
                            className="aspect-square sm:aspect-square bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200 relative z-10 max-h-[400px] sm:max-h-none"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            key={selectedImage}
                        >
                            {(() => {
                                // Get all images: heroImage + additionalImages
                                const allImages = [];
                                if (gem.heroImage) allImages.push(gem.heroImage);
                                if (gem.additionalImages && gem.additionalImages.length > 0) {
                                    allImages.push(...gem.additionalImages);
                                }

                                if (allImages.length > 0) {
                                    return (
                                        <img
                                            src={allImages[selectedImage]}
                                            alt={gem.name}
                                            className="w-full h-full object-cover transition-opacity duration-300 cursor-zoom-in"
                                            onClick={() => {
                                                setModalImageIndex(selectedImage);
                                                setShowImageModal(true);
                                            }}
                                        />
                                    );
                                } else if (gem.allImages && gem.allImages.length > 0) {
                                    return (
                                        <img
                                            src={gem.allImages[selectedImage]}
                                            alt={gem.name}
                                            className="w-full h-full object-cover transition-opacity duration-300 cursor-zoom-in"
                                            onClick={() => {
                                                setModalImageIndex(selectedImage);
                                                setShowImageModal(true);
                                            }}
                                        />
                                    );
                                } else {
                                    return (
                                        <div className={`w-full h-full bg-gradient-to-br ${getGemGradient(gem.category || gem.name)} flex items-center justify-center`}>
                                            <span className="text-6xl sm:text-8xl">{getGemEmoji(gem.category || gem.name)}</span>
                                        </div>
                                    );
                                }
                            })()}
                        </motion.div>

                        {/* Thumbnail Images */}
                        {(() => {
                            // Get all images: heroImage + additionalImages
                            const allImages = [];
                            if (gem.heroImage) allImages.push(gem.heroImage);
                            if (gem.additionalImages && gem.additionalImages.length > 0) {
                                allImages.push(...gem.additionalImages);
                            }

                            // Fallback to allImages if available
                            const imagesToShow = allImages.length > 0 ? allImages : (gem.allImages || []);

                            if (imagesToShow.length > 1) {
                                return (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 relative z-10">
                                        {imagesToShow.map((image, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 relative z-10 ${selectedImage === index
                                                    ? 'border-emerald-500 ring-2 ring-emerald-200 scale-105 shadow-md'
                                                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${gem.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4 sm:space-y-5 relative z-0">
                        {/* Title and Rating */}
                        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 relative z-0">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{gem.name}</h1>
                                    {gem.hindiName && (
                                        <h2 className="text-lg sm:text-xl font-semibold text-emerald-700 mb-3">{gem.hindiName}</h2>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                    <button
                                        onClick={handleToggleWishlist}
                                        disabled={togglingWishlist}
                                        className={`p-2 rounded-lg transition-all duration-200 ${togglingWishlist
                                            ? 'bg-gray-100 text-gray-400 cursor-wait'
                                            : isWishlisted
                                                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                                : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500'
                                            } ${togglingWishlist ? 'opacity-70' : 'hover:scale-110'}`}
                                        title={
                                            togglingWishlist
                                                ? 'Updating...'
                                                : isWishlisted
                                                    ? 'Remove from wishlist'
                                                    : 'Add to wishlist'
                                        }
                                    >
                                        {togglingWishlist ? (
                                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                        ) : (
                                            <FaHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                        )}
                                    </button>
                                    <button
                                        className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                        title="Share"
                                    >
                                        <FaShare className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <div className="flex items-center space-x-1">
                                    <FaStar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                    <span className="text-base sm:text-lg font-semibold">{gem.averageRating || gem.rating || 0}</span>
                                    <span className="text-sm text-gray-500">({gem.totalReviews || gem.reviews?.length || 0} reviews)</span>
                                </div>
                                {gem.category && (
                                    <span className="bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                        {gem.category}
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                                    {formatPrice(calculatePrice())}
                                </span>
                                {gem.discount && gem.discount > 0 && (
                                    <>
                                        <span className="text-xl sm:text-2xl text-gray-500 line-through">
                                            {formatPrice(gem.price)}
                                        </span>
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            {gem.discountType === 'percentage' ? `${gem.discount}% OFF` : `₹${gem.discount} OFF`}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Quick Specs */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <h4 className="font-semibold text-xs text-gray-500 mb-1">Weight</h4>
                                <p className="text-sm font-bold text-gray-900">{gem.sizeWeight} {gem.sizeUnit}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <h4 className="font-semibold text-xs text-gray-500 mb-1">Color</h4>
                                <p className="text-sm font-bold text-gray-900">{gem.color || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <h4 className="font-semibold text-xs text-gray-500 mb-1">Stock</h4>
                                <p className="text-sm font-bold text-gray-900">{gem.stock || 0} pieces</p>
                            </div>
                            {gem.planet && (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <h4 className="font-semibold text-xs text-gray-500 mb-1">Planet</h4>
                                    <p className="text-sm font-bold text-gray-900">{gem.planet}</p>
                                </div>
                            )}
                            {gem.origin && (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <h4 className="font-semibold text-xs text-gray-500 mb-1">Origin</h4>
                                    <p className="text-sm font-bold text-gray-900">{gem.origin}</p>
                                </div>
                            )}
                            {gem.deliveryDays && (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <h4 className="font-semibold text-xs text-gray-500 mb-1">Delivery</h4>
                                    <p className="text-sm font-bold text-gray-900">{gem.deliveryDays} days</p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {gem.description && (
                            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">About This Gem</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{gem.description}</p>
                            </div>
                        )}

                        {/* Benefits - Collapsible */}
                        {gem.benefits && gem.benefits.length > 0 && (
                            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setShowAllBenefits(!showAllBenefits)}
                                    className="w-full flex items-center justify-between mb-3"
                                >
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Benefits</h3>
                                    <span className="text-emerald-600 text-sm font-medium">
                                        {showAllBenefits ? 'Show Less' : `Show All (${gem.benefits.length})`}
                                    </span>
                                </button>
                                <ul className="space-y-2">
                                    {(showAllBenefits ? gem.benefits : gem.benefits.slice(0, 5)).map((benefit, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <FaCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm sm:text-base text-gray-600">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Suitable For - Collapsible */}
                        {(gem.suitableFor && gem.suitableFor.length > 0) || (gem.whomToUse && gem.whomToUse.length > 0) ? (
                            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setShowAllSuitableFor(!showAllSuitableFor)}
                                    className="w-full flex items-center justify-between mb-3"
                                >
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Suitable For</h3>
                                    <span className="text-emerald-600 text-sm font-medium">
                                        {showAllSuitableFor ? 'Show Less' : `Show All (${(gem.suitableFor || gem.whomToUse || []).length})`}
                                    </span>
                                </button>
                                <div className="flex flex-wrap gap-2">
                                    {(showAllSuitableFor
                                        ? (gem.suitableFor || gem.whomToUse || [])
                                        : (gem.suitableFor || gem.whomToUse || []).slice(0, 6)
                                    ).map((person, index) => (
                                        <span
                                            key={index}
                                            className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
                                        >
                                            {person}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Seller Information */}
                        {gem.seller && (
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 sm:p-5 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Sold By</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-base sm:text-lg text-gray-900">{gem.seller.shopName || gem.seller.fullName}</p>
                                        {gem.seller.shopName && (
                                            <p className="text-sm text-gray-600 mt-1">{gem.seller.fullName}</p>
                                        )}
                                        {gem.seller.rating && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <FaStar className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-semibold">{gem.seller.rating}</span>
                                                <span className="text-xs text-gray-500">Seller Rating</span>
                                            </div>
                                        )}
                                    </div>
                                    {gem.seller.isVerified && (
                                        <div className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
                                            <FaCheck className="w-3 h-3" />
                                            Verified
                                        </div>
                                    )}
                                </div>
                                {gem.certification && (
                                    <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center gap-2">
                                        <FaCertificate className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm text-gray-700">Certified: {gem.certification}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quantity and Add to Cart */}
                        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm sm:text-base text-gray-900">Quantity:</span>
                                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-base font-semibold transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="px-4 sm:px-6 py-2 border-x border-gray-200 min-w-[3rem] sm:min-w-[4rem] text-center text-base sm:text-lg font-bold">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-base font-semibold transition-colors"
                                        disabled={gem.stock && quantity >= gem.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!gem.availability || addingToCart}
                                    className={`flex-1 py-3.5 px-6 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center space-x-2 shadow-md ${gem.availability && !addingToCart
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg transform hover:scale-[1.02]'
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
                                    className={`flex-1 sm:flex-none py-3.5 px-6 rounded-lg font-bold text-base transition-all duration-200 shadow-md ${gem.availability && !addingToCart
                                        ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg transform hover:scale-[1.02]'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <FaTruck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900">Free Shipping</h4>
                                    <p className="text-xs text-gray-600">On orders over ₹50,000</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <FaCheck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900">Secure Payment</h4>
                                    <p className="text-xs text-gray-600">100% secure checkout</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <FaCertificate className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900">Authentic</h4>
                                    <p className="text-xs text-gray-600">Certified gemstones</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {reviews.length > 0 && (
                    <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Customer Reviews</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {reviews.slice(0, 5).map((review, index) => (
                                <motion.div
                                    key={review._id || review.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0 last:pb-0"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-emerald-600 font-semibold text-xs sm:text-sm">
                                                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                        {review.user?.name || 'Anonymous'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(review.createdAt || review.date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        className={`text-xs sm:text-sm ${star <= (review.rating || 5)
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                        {review.comment || review.review}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        {reviews.length > 5 && (
                            <button
                                onClick={() => navigate(`/gem/${id}/reviews`)}
                                className="mt-4 sm:mt-6 text-emerald-600 hover:text-emerald-700 font-medium text-xs sm:text-sm"
                            >
                                View All {reviews.length} Reviews →
                            </button>
                        )}
                    </div>
                )}

                {loadingReviews && (
                    <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-xs sm:text-sm">Loading reviews...</p>
                    </div>
                )}

                {/* Related Products Section */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-12 sm:mt-16">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Related Products</h2>
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm sm:text-base flex items-center gap-2"
                            >
                                View All
                                <FaArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {relatedProducts.map((relatedGem) => (
                                <GemCard
                                    key={relatedGem._id || relatedGem.id}
                                    gem={relatedGem}
                                    onAddToCart={handleRelatedProductAddToCart}
                                    onToggleWishlist={handleRelatedProductWishlist}
                                    isWishlisted={false}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Zoom Modal */}
                <AnimatePresence>
                    {showImageModal && gem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
                            onClick={() => setShowImageModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowImageModal(false)}
                                    className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/70 hover:bg-black/90 rounded-full p-2 sm:p-3 backdrop-blur-sm shadow-lg"
                                    aria-label="Close"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Main Image */}
                                {(() => {
                                    const allImages = [];
                                    if (gem.heroImage) allImages.push(gem.heroImage);
                                    if (gem.additionalImages && gem.additionalImages.length > 0) {
                                        allImages.push(...gem.additionalImages);
                                    }
                                    const imagesToShow = allImages.length > 0 ? allImages : (gem.allImages || []);

                                    return (
                                        <>
                                            <motion.div
                                                key={modalImageIndex}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center mb-3 sm:mb-4"
                                            >
                                                <img
                                                    src={imagesToShow[modalImageIndex]}
                                                    alt={`${gem.name} - Image ${modalImageIndex + 1}`}
                                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                                />
                                            </motion.div>

                                            {/* Thumbnail Navigation */}
                                            {imagesToShow.length > 1 && (
                                                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 max-w-full px-4">
                                                    {imagesToShow.map((image, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setModalImageIndex(index)}
                                                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${modalImageIndex === index
                                                                ? 'border-emerald-500 ring-2 ring-emerald-300 scale-110'
                                                                : 'border-gray-600 hover:border-gray-400'
                                                                }`}
                                                        >
                                                            <img
                                                                src={image}
                                                                alt={`Thumbnail ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Navigation Arrows */}
                                            {imagesToShow.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalImageIndex((prev) =>
                                                                prev === 0 ? imagesToShow.length - 1 : prev - 1
                                                            );
                                                        }}
                                                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white transition-all"
                                                        aria-label="Previous image"
                                                    >
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalImageIndex((prev) =>
                                                                prev === imagesToShow.length - 1 ? 0 : prev + 1
                                                            );
                                                        }}
                                                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 text-white transition-all"
                                                        aria-label="Next image"
                                                    >
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}

                                            {/* Image Counter */}
                                            {imagesToShow.length > 1 && (
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                                                    {modalImageIndex + 1} / {imagesToShow.length}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GemDetail;