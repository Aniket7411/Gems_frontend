import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = 'https://gems-backend-u.onrender.com/api';


// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            // Server responded with error status
            throw new Error(error.response.data.message || 'Something went wrong');
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Network error. Please check your connection.');
        } else {
            // Something else happened
            throw new Error(error.message || 'Something went wrong');
        }
    }
);

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Authentication API functions
export const authAPI = {
    // Signup a new user
    signup: async (userData) => {
        const response = await apiClient.post('/auth/signup', userData);

        // Store token in localStorage
        if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    // Register a new user (alias for signup)
    register: async (userData) => {
        return authAPI.signup(userData);
    },

    // Login user
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);

        // Store token in localStorage
        if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    // Forgot password
    forgotPassword: async (email) => {
        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response;
        } catch (error) {
            console.error('Forgot password error:', error);
            return { success: false, message: 'Network error. Please check your connection.' };
        }
    },

    // Reset password
    resetPassword: async (token, password) => {
        try {
            const response = await apiClient.put(`/auth/reset-password/${token}`, { password });
            return response;
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, message: 'Network error. Please check your connection.' };
        }
    },

    // Verify reset token
    verifyResetToken: async (token) => {
        try {
            const response = await apiClient.get(`/auth/reset-password/${token}`);
            return response;
        } catch (error) {
            console.error('Verify token error:', error);
            return { success: false, message: 'Invalid or expired reset token.' };
        }
    },

    // Verify email
    verifyEmail: async (token) => {
        return apiClient.get(`/auth/verify-email/${token}`);
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!getAuthToken();
    },

    // Get seller profile
    getSellerProfile: async () => {
        return await apiClient.get('/seller/profile');
    },

    // Update user profile (for sellers)
    updateProfile: async (profileData) => {
        const response = await apiClient.put('/seller/profile', profileData);

        // Update user in localStorage if seller data is returned
        if (response.success && response.seller) {
            // Store seller data
            localStorage.setItem('sellerProfile', JSON.stringify(response.seller));

            // Also update user object if present
            const currentUser = authAPI.getCurrentUser();
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    name: response.seller.fullName,
                    email: response.seller.email,
                    role: 'seller'
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        }

        return response;
    },

    // Get seller dashboard stats
    getSellerDashboardStats: async () => {
        return await apiClient.get('/seller/dashboard/stats');
    },

    // Update buyer profile
    updateBuyerProfile: async (profileData) => {
        const response = await apiClient.put('/user/profile', profileData);

        // Update user in localStorage
        if (response.success && response.user) {
            const currentUser = authAPI.getCurrentUser();
            const updatedUser = {
                ...currentUser,
                ...response.user
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        return response;
    },

    // Get buyer profile
    getBuyerProfile: async () => {
        return await apiClient.get('/user/profile');
    },

    // Address Management
    // Get all addresses
    getAddresses: async () => {
        return apiClient.get('/user/addresses');
    },

    // Add address
    addAddress: async (addressData) => {
        return apiClient.post('/user/addresses', addressData);
    },

    // Update address
    updateAddress: async (addressId, addressData) => {
        return apiClient.put(`/user/addresses/${addressId}`, addressData);
    },

    // Delete address
    deleteAddress: async (addressId) => {
        return apiClient.delete(`/user/addresses/${addressId}`);
    },

    // Set primary address
    setPrimaryAddress: async (addressId) => {
        return apiClient.put(`/user/addresses/${addressId}/primary`);
    }
};

// Gem API functions
export const gemAPI = {
    // Add a new gem
    addGem: async (gemData) => {
        return apiClient.post('/gems', gemData);
    },

    // Get all gems
    getGems: async (params = {}) => {
        // Filter out empty values
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});

        return apiClient.get('/gems', { params: filteredParams });
    },

    // Get gem by ID
    getGemById: async (id) => {
        return apiClient.get(`/gems/${id}`);
    },

    // Update gem
    updateGem: async (id, gemData) => {
        return apiClient.put(`/gems/${id}`, gemData);
    },

    // Delete gem
    deleteGem: async (id) => {
        return apiClient.delete(`/gems/${id}`);
    },

    // Search gems
    searchGems: async (searchParams) => {
        return apiClient.post('/gems/search', searchParams);
    },

    // Get gem categories
    getGemCategories: async () => {
        return apiClient.get('/gems/categories');
    },

    // Get gems by category
    getGemsByCategory: async (category) => {
        return apiClient.get(`/gems/category/${category}`);
    },

    // Get gems by zodiac sign
    getGemsByZodiac: async (zodiacSign) => {
        return apiClient.get(`/gems/zodiac/${zodiacSign}`);
    }
};

// Cart API functions
export const cartAPI = {
    // Add item to cart
    addToCart: async (gemId, quantity) => {
        return apiClient.post('/cart/add', { gemId, quantity });
    },

    // Get cart items
    getCart: async () => {
        return apiClient.get('/cart');
    },

    // Update cart item quantity
    updateCartItem: async (gemId, quantity) => {
        return apiClient.put(`/cart/update/${gemId}`, { quantity });
    },

    // Remove item from cart
    removeFromCart: async (gemId) => {
        return apiClient.delete(`/cart/remove/${gemId}`);
    },

    // Clear cart
    clearCart: async () => {
        return apiClient.delete('/cart/clear');
    }
};

// Order API functions
export const orderAPI = {
    // Create order
    createOrder: async (orderData) => {
        return apiClient.post('/orders', orderData);
    },

    // Get user orders
    getOrders: async () => {
        return apiClient.get('/orders');
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        return apiClient.get(`/orders/${orderId}`);
    },

    // Cancel order
    cancelOrder: async (orderId, reason) => {
        return apiClient.put(`/orders/${orderId}/cancel`, { reason });
    },

    // Get order tracking details
    trackOrder: async (orderId) => {
        return apiClient.get(`/orders/${orderId}/track`);
    },

    // Get order invoice
    getOrderInvoice: async (orderId) => {
        return apiClient.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
    },

    // Seller-specific order functions
    // Get seller orders
    getSellerOrders: async (params = {}) => {
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});
        return apiClient.get('/seller/orders', { params: filteredParams });
    },

    // Get seller order by ID
    getSellerOrderById: async (orderId) => {
        return apiClient.get(`/seller/orders/${orderId}`);
    },

    // Update order status
    updateOrderStatus: async (orderId, status, trackingData = {}) => {
        return apiClient.put(`/seller/orders/${orderId}/status`, { status, ...trackingData });
    },

    // Get seller order stats
    getSellerOrderStats: async () => {
        return apiClient.get('/seller/orders/stats');
    }
};

// OTP API functions
export const otpAPI = {
    // Send OTP
    sendOTP: async (phoneNumber) => {
        return apiClient.post('/otp/send', { phoneNumber });
    },

    // Verify OTP
    verifyOTP: async (phoneNumber, otp) => {
        return apiClient.post('/otp/verify', { phoneNumber, otp });
    }
};

// Review API functions
export const reviewAPI = {
    // Submit a review
    submitReview: async (gemId, reviewData) => {
        return apiClient.post(`/reviews/${gemId}`, reviewData);
    },

    // Get reviews for a gem
    getGemReviews: async (gemId, params = {}) => {
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});
        return apiClient.get(`/reviews/gem/${gemId}`, { params: filteredParams });
    },

    // Get user's reviews
    getUserReviews: async () => {
        return apiClient.get('/reviews/user');
    },

    // Update a review
    updateReview: async (reviewId, reviewData) => {
        return apiClient.put(`/reviews/${reviewId}`, reviewData);
    },

    // Delete a review
    deleteReview: async (reviewId) => {
        return apiClient.delete(`/reviews/${reviewId}`);
    },

    // Check if user has reviewed a gem
    hasReviewed: async (gemId) => {
        return apiClient.get(`/reviews/check/${gemId}`);
    }
};

// Wishlist API functions
export const wishlistAPI = {
    // Add item to wishlist
    addToWishlist: async (gemId) => {
        return apiClient.post('/wishlist/add', { gemId });
    },

    // Get wishlist items
    getWishlist: async () => {
        return apiClient.get('/wishlist');
    },

    // Remove item from wishlist
    removeFromWishlist: async (gemId) => {
        return apiClient.delete(`/wishlist/remove/${gemId}`);
    },

    // Clear wishlist
    clearWishlist: async () => {
        return apiClient.delete('/wishlist/clear');
    },

    // Check if item is in wishlist
    isInWishlist: async (gemId) => {
        return apiClient.get(`/wishlist/check/${gemId}`);
    }
};

// Admin API functions
export const adminAPI = {
    // Get all sellers with filters
    getSellers: async (params = {}) => {
        // Filter out empty values
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});

        return apiClient.get('/admin/sellers', { params: filteredParams });
    },

    // Get seller by ID
    getSellerById: async (sellerId) => {
        return apiClient.get(`/admin/sellers/${sellerId}`);
    },

    // Update seller status (approve/reject)
    updateSellerStatus: async (sellerId, status) => {
        return apiClient.put(`/admin/sellers/${sellerId}/status`, { status });
    },

    // Block/Unblock seller
    blockSeller: async (sellerId) => {
        return apiClient.put(`/admin/sellers/${sellerId}/block`);
    },

    unblockSeller: async (sellerId) => {
        return apiClient.put(`/admin/sellers/${sellerId}/unblock`);
    },

    // Delete seller
    deleteSeller: async (sellerId) => {
        return apiClient.delete(`/admin/sellers/${sellerId}`);
    },

    // Get all buyers with filters
    getBuyers: async (params = {}) => {
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});
        return apiClient.get('/admin/buyers', { params: filteredParams });
    },

    // Get buyer by ID
    getBuyerById: async (buyerId) => {
        return apiClient.get(`/admin/buyers/${buyerId}`);
    },

    // Block/Unblock buyer
    blockBuyer: async (buyerId) => {
        return apiClient.put(`/admin/buyers/${buyerId}/block`);
    },

    unblockBuyer: async (buyerId) => {
        return apiClient.put(`/admin/buyers/${buyerId}/unblock`);
    },

    // Get all products (admin)
    getAllProducts: async (params = {}) => {
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});
        return apiClient.get('/admin/products', { params: filteredParams });
    },

    // Get product by ID (admin)
    getProductById: async (productId) => {
        return apiClient.get(`/admin/products/${productId}`);
    },

    // Delete product (admin)
    deleteProduct: async (productId) => {
        return apiClient.delete(`/admin/products/${productId}`);
    },

    // Get all orders (admin)
    getAllOrders: async (params = {}) => {
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});
        return apiClient.get('/admin/orders', { params: filteredParams });
    },

    // Get order by ID (admin)
    getOrderById: async (orderId) => {
        return apiClient.get(`/admin/orders/${orderId}`);
    },

    // Get dashboard stats
    getDashboardStats: async () => {
        return apiClient.get('/admin/dashboard/stats');
    }
};

// Health check
export const healthCheck = async () => {
    return apiClient.get('/health');
};

const api = { authAPI, gemAPI, cartAPI, orderAPI, otpAPI, reviewAPI, wishlistAPI, adminAPI, healthCheck };
export default api;
