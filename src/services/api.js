// const API_BASE_URL = 'https://gems-backend-zfpw.onrender.com/api';
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper function to make API requests
const makeRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication API functions
export const authAPI = {
    // Register a new user
    register: async (userData) => {
        return makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // Login user
    login: async (credentials) => {
        const response = await makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // Store token in localStorage
        if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    // Forgot password
    forgotPassword: async (email) => {
        return makeRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    // Reset password
    resetPassword: async (token, password) => {
        return makeRequest(`/auth/reset-password/${token}`, {
            method: 'POST',
            body: JSON.stringify({ password }),
        });
    },

    // Verify email
    verifyEmail: async (token) => {
        return makeRequest(`/auth/verify-email/${token}`, {
            method: 'GET',
        });
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
        return makeRequest('/gems', {
            method: 'POST',
            body: JSON.stringify(gemData),
        });
    },

    // Get all gems
    getGems: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `/gems?${queryString}` : '/gems';
        return makeRequest(endpoint, {
            method: 'GET',
        });
    },

    // Get gem by ID
    getGemById: async (id) => {
        return makeRequest(`/gems/${id}`, {
            method: 'GET',
        });
    },

    // Update gem
    updateGem: async (id, gemData) => {
        return makeRequest(`/gems/${id}`, {
            method: 'PUT',
            body: JSON.stringify(gemData),
        });
    },

    // Delete gem
    deleteGem: async (id) => {
        return makeRequest(`/gems/${id}`, {
            method: 'DELETE',
        });
    },

    // Search gems
    searchGems: async (searchParams) => {
        return makeRequest('/gems/search', {
            method: 'POST',
            body: JSON.stringify(searchParams),
        });
    },

    // Get gem categories
    getGemCategories: async () => {
        return makeRequest('/gems/categories', {
            method: 'GET',
        });
    },

    // Get gems by category
    getGemsByCategory: async (category) => {
        return makeRequest(`/gems/category/${category}`, {
            method: 'GET',
        });
    },

    // Get gems by zodiac sign
    getGemsByZodiac: async (zodiacSign) => {
        return makeRequest(`/gems/zodiac/${zodiacSign}`, {
            method: 'GET',
        });
    }
};

// Cart API functions
export const cartAPI = {
    // Add item to cart
    addToCart: async (gemId, quantity) => {
        return makeRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ gemId, quantity }),
        });
    },

    // Get cart items
    getCart: async () => {
        return makeRequest('/cart', {
            method: 'GET',
        });
    },

    // Update cart item quantity
    updateCartItem: async (gemId, quantity) => {
        return makeRequest(`/cart/update/${gemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    },

    // Remove item from cart
    removeFromCart: async (gemId) => {
        return makeRequest(`/cart/remove/${gemId}`, {
            method: 'DELETE',
        });
    },

    // Clear cart
    clearCart: async () => {
        return makeRequest('/cart/clear', {
            method: 'DELETE',
        });
    }
};

// Order API functions
export const orderAPI = {
    // Create order
    createOrder: async (orderData) => {
        return makeRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // Get user orders
    getOrders: async () => {
        return makeRequest('/orders', {
            method: 'GET',
        });
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        return makeRequest(`/orders/${orderId}`, {
            method: 'GET',
        });
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        return makeRequest(`/orders/${orderId}/cancel`, {
            method: 'PUT',
        });
    }
};

// OTP API functions
export const otpAPI = {
    // Send OTP
    sendOTP: async (phoneNumber) => {
        return makeRequest('/otp/send', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber }),
        });
    },

    // Verify OTP
    verifyOTP: async (phoneNumber, otp) => {
        return makeRequest('/otp/verify', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, otp }),
        });
    }
};

// Health check
export const healthCheck = async () => {
    return makeRequest('/health', {
        method: 'GET',
    });
};

const api = { authAPI, gemAPI, cartAPI, orderAPI, otpAPI, healthCheck };
export default api;



