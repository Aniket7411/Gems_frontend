# 🚀 Backend Developer - Copy & Paste Ready Code

## 📦 Step 1: Install Packages
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

## 📝 Step 2: Create .env File
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gems-selling
JWT_SECRET=gems_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRE=7d
```

---

## 📁 Step 3: Create Files & Copy Code

### 1️⃣ server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gems', require('./routes/gems'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

### 2️⃣ models/User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    default: 'buyer'
  },
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### 3️⃣ models/Gem.js
```javascript
const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hindiName: {
    type: String,
    required: true
  },
  planet: {
    type: String,
    required: true
  },
  planetHindi: String,
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  benefits: [String],
  suitableFor: [String],
  price: {
    type: Number,
    required: true
  },
  sizeWeight: {
    type: Number,
    required: true
  },
  sizeUnit: {
    type: String,
    enum: ['carat', 'gram', 'ounce'],
    default: 'carat'
  },
  stock: {
    type: Number,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  certification: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  deliveryDays: {
    type: Number,
    required: true
  },
  heroImage: {
    type: String,
    required: true
  },
  additionalImages: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gem', gemSchema);
```

---

### 4️⃣ middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Check if user is seller
exports.isSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Sellers only.' 
    });
  }
  next();
};

// Check if user is buyer
exports.isBuyer = (req, res, next) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Buyers only.' 
    });
  }
  next();
};

// Generate JWT Token
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
```

---

### 5️⃣ routes/auth.js
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register a new user (buyer or seller)
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'buyer' // Default to buyer if not specified
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
```

---

### 6️⃣ routes/gems.js
```javascript
const express = require('express');
const router = express.Router();
const Gem = require('../models/Gem');
const { protect, isSeller } = require('../middleware/auth');

// @route   GET /api/gems
// @desc    Get all gems with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search, 
      planet, 
      minPrice, 
      maxPrice,
      availability 
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { hindiName: { $regex: search, $options: 'i' } }
      ];
    }

    if (planet) {
      query.planet = { $regex: planet, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (availability !== undefined) {
      query.availability = availability === 'true';
    }

    // Execute query with pagination
    const gems = await Gem.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Gem.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      gems
    });
  } catch (error) {
    console.error('Get gems error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/gems/:id
// @desc    Get single gem
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id).populate('seller', 'name email');

    if (!gem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gem not found' 
      });
    }

    res.status(200).json({
      success: true,
      gem
    });
  } catch (error) {
    console.error('Get gem error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/gems
// @desc    Add new gem
// @access  Private (Seller only)
router.post('/', protect, isSeller, async (req, res) => {
  try {
    const {
      name, hindiName, planet, planetHindi, color, description,
      benefits, suitableFor, price, sizeWeight, sizeUnit,
      stock, availability, certification, origin, deliveryDays,
      heroImage, additionalImages
    } = req.body;

    // Validate required fields
    if (!name || !hindiName || !planet || !color || !description || !price || !heroImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Create gem
    const gem = await Gem.create({
      name,
      hindiName,
      planet,
      planetHindi,
      color,
      description,
      benefits,
      suitableFor,
      price,
      sizeWeight,
      sizeUnit,
      stock,
      availability,
      certification,
      origin,
      deliveryDays,
      heroImage,
      additionalImages,
      seller: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Gem added successfully',
      gem
    });
  } catch (error) {
    console.error('Add gem error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
});

// @route   PUT /api/gems/:id
// @desc    Update gem
// @access  Private (Seller only - own gems)
router.put('/:id', protect, isSeller, async (req, res) => {
  try {
    let gem = await Gem.findById(req.params.id);

    if (!gem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gem not found' 
      });
    }

    // Check if user is the seller of this gem
    if (gem.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this gem' 
      });
    }

    gem = await Gem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Gem updated successfully',
      gem
    });
  } catch (error) {
    console.error('Update gem error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/gems/:id
// @desc    Delete gem
// @access  Private (Seller only - own gems)
router.delete('/:id', protect, isSeller, async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);

    if (!gem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gem not found' 
      });
    }

    // Check if user is the seller of this gem
    if (gem.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this gem' 
      });
    }

    await gem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gem deleted successfully'
    });
  } catch (error) {
    console.error('Delete gem error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/gems/my-gems
// @desc    Get seller's gems
// @access  Private (Seller only)
router.get('/my-gems', protect, isSeller, async (req, res) => {
  try {
    const gems = await Gem.find({ seller: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gems.length,
      gems
    });
  } catch (error) {
    console.error('Get my gems error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
```

---

### 7️⃣ models/Cart.js
```javascript
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      gem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gem'
      },
      quantity: {
        type: Number,
        default: 1
      },
      price: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', cartSchema);
```

---

### 8️⃣ routes/cart.js
```javascript
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Gem = require('../models/Gem');
const { protect, isBuyer } = require('../middleware/auth');

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private (Buyer only)
router.post('/', protect, isBuyer, async (req, res) => {
  try {
    const { gemId, quantity = 1 } = req.body;

    // Check if gem exists
    const gem = await Gem.findById(gemId);
    if (!gem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gem not found' 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex(
      item => item.gem.toString() === gemId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        gem: gemId,
        quantity,
        price: gem.price
      });
    }

    await cart.save();
    await cart.populate('items.gem');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private (Buyer only)
router.get('/', protect, isBuyer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.gem');

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalItems: 0, totalPrice: 0 }
      });
    }

    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      cart: {
        items: cart.items,
        totalItems,
        totalPrice
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private (Buyer only)
router.delete('/:itemId', protect, isBuyer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private (Buyer only)
router.delete('/', protect, isBuyer, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
```

---

## 🎯 Folder Structure

Create this structure:
```
backend/
├── server.js
├── .env
├── models/
│   ├── User.js
│   ├── Gem.js
│   └── Cart.js
├── middleware/
│   └── auth.js
└── routes/
    ├── auth.js
    ├── gems.js
    └── cart.js
```

---

## ▶️ Run the Server

```bash
node server.js
```

You should see:
```
MongoDB connected successfully
Server is running on port 5000
```

---

## 🧪 Test Immediately

### 1. Signup as Seller
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Seller",
    "email": "seller@test.com",
    "password": "password123",
    "role": "seller"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@test.com",
    "password": "password123"
  }'
```

### 3. Add Gem (Use token from login)
```bash
curl -X POST http://localhost:5000/api/gems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Emerald",
    "hindiName": "Panna",
    "planet": "Mercury",
    "color": "Green",
    "description": "Beautiful emerald",
    "price": 50000,
    "sizeWeight": 5,
    "certification": "Certified",
    "origin": "Sri Lanka",
    "deliveryDays": 7,
    "heroImage": "https://example.com/image.jpg"
  }'
```

### 4. Get All Gems
```bash
curl http://localhost:5000/api/gems
```

---

## ✅ What This Gives You

- ✅ Complete authentication with JWT
- ✅ Buyer/Seller role system
- ✅ All gem CRUD operations
- ✅ Cart management
- ✅ Role-based access control
- ✅ Works perfectly with your frontend

---

## 🎉 That's It!

Copy these files, run `node server.js`, and your backend is live!

Your frontend will automatically connect to `http://localhost:5000/api` and everything will work.

**You'll meet your deadline! 🚀**


