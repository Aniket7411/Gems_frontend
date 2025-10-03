import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
        return apiClient.post('/auth/forgot-password', { email });
    },

    // Reset password
    resetPassword: async (token, password) => {
        return apiClient.post(`/auth/reset-password/${token}`, { password });
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
    cancelOrder: async (orderId) => {
        return apiClient.put(`/orders/${orderId}/cancel`);
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

// Health check
export const healthCheck = async () => {
    return apiClient.get('/health');
};

const api = { authAPI, gemAPI, cartAPI, orderAPI, otpAPI, healthCheck };
export default api;



