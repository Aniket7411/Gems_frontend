// ===============================================
// COMPLETE BACKEND AUTHENTICATION IMPLEMENTATION
// ===============================================
// Share this with your backend developer

// ===============================================
// 1. INSTALL REQUIRED PACKAGES
// ===============================================
/*
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
*/

// ===============================================
// 2. ENVIRONMENT VARIABLES (.env file)
// ===============================================
/*
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gems_db
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=development
*/

// ===============================================
// 3. USER MODEL (models/User.js)
// ===============================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with cost of 12
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);

// ===============================================
// 4. AUTH MIDDLEWARE (middleware/auth.js)
// ===============================================
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign({ userId }, secret, {
        expiresIn: '7d' // Token expires in 7 days
    });
};

// Verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        });
    }
};

module.exports = {
    generateToken,
    verifyToken,
    getCurrentUser
};

// ===============================================
// 5. AUTH CONTROLLER (controllers/authController.js)
// ===============================================
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return user data (password will be automatically excluded by toJSON method)
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};

module.exports = {
    signup,
    login,
    getProfile
};

// ===============================================
// 6. AUTH ROUTES (routes/auth.js)
// ===============================================
const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { verifyToken, getCurrentUser } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getCurrentUser, getProfile);

module.exports = router;

// ===============================================
// 7. MAIN SERVER FILE (server.js or app.js)
// ===============================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gems_db')
    .then(() => {
        console.log('MongoDB connected successfully');

        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;

// ===============================================
// 8. PACKAGE.JSON SCRIPTS
// ===============================================
/*
{
  "name": "gems-backend",
  "version": "1.0.0",
  "description": "Backend for Gems E-commerce",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
*/

// ===============================================
// 9. TESTING THE API
// ===============================================

// Test Signup:
// POST http://localhost:5000/api/auth/signup
// Content-Type: application/json
// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "password": "password123"
// }

// Test Login:
// POST http://localhost:5000/api/auth/login
// Content-Type: application/json
// {
//   "email": "john@example.com",
//   "password": "password123"
// }

// Test Profile (Protected):
// GET http://localhost:5000/api/auth/profile
// Authorization: Bearer YOUR_JWT_TOKEN_HERE

// ===============================================
// 10. IMPORTANT NOTES FOR BACKEND DEVELOPER
// ===============================================

/*
1. MAKE SURE TO SET JWT_SECRET in .env file:
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

2. The error you're seeing "secretOrPrivateKey must have a value" means:
   - JWT_SECRET is not set in environment variables
   - Or the .env file is not being loaded properly

3. To fix the JWT error:
   - Create a .env file in your backend root directory
   - Add JWT_SECRET=your_long_secret_key_here
   - Make sure to require('dotenv').config() at the top of your main file

4. Database setup:
   - Make sure MongoDB is running
   - Update MONGODB_URI in .env if needed

5. CORS is enabled for frontend communication

6. Password is automatically hashed using bcryptjs

7. JWT tokens expire in 7 days

8. The API follows the exact structure specified in newlogin.md:
   - POST /api/auth/signup
   - POST /api/auth/login
   - GET /api/auth/profile (protected)
   - GET /api/health (health check)

9. Error responses follow the format:
   {
     "success": false,
     "message": "Error description"
   }

10. Success responses follow the format:
    {
      "success": true,
      "message": "Success message",
      "token": "jwt_token_here",
      "user": { ... }
    }
*/

// ===============================================
// END OF IMPLEMENTATION
// ===============================================
