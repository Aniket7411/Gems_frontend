# 📦 Backend Developer - Complete Implementation Package

> **URGENT: Deadline This Week** - Everything you need to get the backend running in 2-3 days!

---

## 🎯 What Frontend Sends You

### 1. Signup Request
```javascript
POST /api/auth/signup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"  // or "seller"
}
```

### 2. Login Request
```javascript
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Add Gem Request (Seller)
```javascript
POST /api/gems
Headers: Authorization: Bearer <token>
Body: {
  "name": "Emerald",
  "hindiName": "Panna (पन्ना)",
  "planet": "Mercury (Budh)",
  "planetHindi": "बुध ग्रह",
  "color": "Green",
  "description": "Beautiful natural emerald...",
  "benefits": ["Enhances intelligence..."],
  "suitableFor": ["Teachers", "Lawyers"],
  "price": 50000,
  "sizeWeight": 5.5,
  "sizeUnit": "carat",
  "stock": 10,
  "availability": true,
  "certification": "Govt. Lab Certified",
  "origin": "Sri Lanka",
  "deliveryDays": 7,
  "heroImage": "https://res.cloudinary.com/defgskoxv/image/upload/...",
  "additionalImages": ["https://res.cloudinary.com/defgskoxv/..."]
}
```

**Note:** Images are already uploaded to Cloudinary by frontend. You just receive the URLs!

### 4. Get Gems Request
```javascript
GET /api/gems?page=1&limit=12&search=emerald&planet=Mercury&minPrice=1000&maxPrice=100000
```

### 5. Cart Requests (Buyer)
```javascript
POST /api/cart
Body: { "gemId": "gem_id_here", "quantity": 1 }

GET /api/cart
DELETE /api/cart/:itemId
```

---

## ⚡ Quick Setup (10 Minutes)

### Install Dependencies
```bash
mkdir gems-backend && cd gems-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

### Create .env File
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gems-selling
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

### Create Files
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

## 📝 COPY THIS CODE EXACTLY

### server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gems', require('./routes/gems'));
app.use('/api/cart', require('./routes/cart'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
```

### models/User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
  phone: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### models/Gem.js
```javascript
const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hindiName: { type: String, required: true },
  planet: { type: String, required: true },
  planetHindi: String,
  color: { type: String, required: true },
  description: { type: String, required: true },
  benefits: [String],
  suitableFor: [String],
  price: { type: Number, required: true },
  sizeWeight: { type: Number, required: true },
  sizeUnit: { type: String, enum: ['carat', 'gram', 'ounce'], default: 'carat' },
  stock: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  certification: { type: String, required: true },
  origin: { type: String, required: true },
  deliveryDays: { type: Number, required: true },
  heroImage: { type: String, required: true },
  additionalImages: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gem', gemSchema);
```

### middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

exports.isSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ success: false, message: 'Sellers only' });
  }
  next();
};

exports.isBuyer = (req, res, next) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({ success: false, message: 'Buyers only' });
  }
  next();
};

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
```

### routes/auth.js
```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role: role || 'buyer' });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }
  });
});

module.exports = router;
```

### routes/gems.js
```javascript
const express = require('express');
const router = express.Router();
const Gem = require('../models/Gem');
const { protect, isSeller } = require('../middleware/auth');

// Get all gems (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, search, planet, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { hindiName: { $regex: search, $options: 'i' } }
      ];
    }
    if (planet) query.planet = { $regex: planet, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const gems = await Gem.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Gem.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      gems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single gem (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id).populate('seller', 'name email');
    if (!gem) {
      return res.status(404).json({ success: false, message: 'Gem not found' });
    }
    res.json({ success: true, gem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add gem (SELLER ONLY)
router.post('/', protect, isSeller, async (req, res) => {
  try {
    const gem = await Gem.create({ ...req.body, seller: req.user._id });
    res.status(201).json({ success: true, message: 'Gem added successfully', gem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update gem (SELLER ONLY - own gems)
router.put('/:id', protect, isSeller, async (req, res) => {
  try {
    let gem = await Gem.findById(req.params.id);
    if (!gem) {
      return res.status(404).json({ success: false, message: 'Gem not found' });
    }
    if (gem.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    gem = await Gem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Gem updated successfully', gem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete gem (SELLER ONLY - own gems)
router.delete('/:id', protect, isSeller, async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);
    if (!gem) {
      return res.status(404).json({ success: false, message: 'Gem not found' });
    }
    if (gem.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await gem.deleteOne();
    res.json({ success: true, message: 'Gem deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

---

## 🚀 Run It

```bash
# Install
npm install express mongoose bcryptjs jsonwebtoken cors dotenv

# Run
node server.js
```

**Server will run on:** `http://localhost:5000`

---

## ✅ Frontend Configuration (Already Done!)

Frontend is already configured to connect to:
```javascript
http://localhost:5000/api
```

All API calls are ready:
- ✅ Signup with role
- ✅ Login with JWT
- ✅ Add gem (seller)
- ✅ Get gems (all users)
- ✅ Cart operations (buyer)

---

## 🧪 Test It

### 1. Start your backend
```bash
node server.js
```

### 2. Start the frontend
```bash
npm start
```

### 3. Test Signup
- Go to `http://localhost:3000/register`
- Select "Buyer" or "Seller"
- Create account
- You'll get JWT token automatically

### 4. Test AddGem (as Seller)
- Signup as Seller
- Go to Add Gem page
- Upload images (goes to Cloudinary)
- Submit form
- Gem is saved to database with image URLs

### 5. View Cart (Dummy Data)
- Go to `http://localhost:3000/cart`
- See 4 sample items
- Test quantity changes

---

## 🎯 Priority Implementation Order

### Day 1 (4-5 hours)
1. ✅ Setup Express server
2. ✅ Connect MongoDB
3. ✅ Create User model
4. ✅ Implement signup (with role)
5. ✅ Implement login
6. ✅ Create auth middleware

### Day 2 (4-5 hours)
1. ✅ Create Gem model
2. ✅ Add gem endpoint (seller only)
3. ✅ Get all gems (public)
4. ✅ Get single gem (public)
5. ✅ Update/Delete gem (seller only)

### Day 3 (3-4 hours)
1. ✅ Create Cart model
2. ✅ Add to cart (buyer only)
3. ✅ Get cart
4. ✅ Update/remove cart items

**Total: 11-14 hours of work = You'll finish before deadline!**

---

## 📊 Response Format (IMPORTANT!)

Always use this format:

**Success:**
```javascript
res.status(200).json({
  success: true,
  message: "Operation successful",
  data: {...}
});
```

**Error:**
```javascript
res.status(400).json({
  success: false,
  message: "Error message here"
});
```

Frontend expects `success` field in all responses!

---

## 🔒 Security Checklist

- ✅ Hash passwords with bcrypt (10 rounds)
- ✅ Use strong JWT secret
- ✅ Validate all inputs
- ✅ Check user roles before operations
- ✅ Use try-catch blocks everywhere
- ✅ Never send password in responses

---

## 🎁 Bonus Features (If Time)

- Rate limiting on auth endpoints
- Input sanitization
- Request logging
- Error tracking
- Email verification (optional)

---

## 📞 Important Notes

### Images
- **Frontend handles Cloudinary upload**
- You receive ready-to-use URLs
- Just store URLs in database
- No file upload handling needed on backend!

### Roles
- Check `req.user.role` for authorization
- Use `isSeller` middleware for seller-only routes
- Use `isBuyer` middleware for buyer-only routes

### JWT
- Frontend sends: `Authorization: Bearer <token>`
- Decode to get user ID and role
- Attach user to `req.user`

---

## ⚠️ Common Mistakes to Avoid

1. ❌ Forgetting to hash passwords
2. ❌ Not checking user role before operations
3. ❌ Sending password in responses
4. ❌ Not validating seller owns the gem before update/delete
5. ❌ Missing `success: true/false` in responses

---

## 🎉 You're Set!

**Everything is documented and ready to implement.**

Frontend team has:
- ✅ All UI/UX complete
- ✅ All API calls configured
- ✅ Cloudinary working
- ✅ Role-based signup
- ✅ Dummy data for testing

You just need to:
1. Copy the code above
2. Run `npm install`
3. Start the server
4. Test with frontend

**The frontend will automatically work with your backend!**

---

## 📚 Full Documentation

For detailed documentation, see:
- `BACKEND_DEVELOPER_COMPLETE_GUIDE.md` - Complete API reference
- `BACKEND_QUICK_START.md` - Quick implementation guide
- `BACKEND_COPY_PASTE_CODE.md` - All code in one place

---

## 🎯 Success Criteria

✅ User can signup as buyer/seller  
✅ User can login and get JWT token  
✅ Seller can add gems with images  
✅ Anyone can view all gems  
✅ Buyer can add gems to cart  
✅ Cart persists in database  

**If these 6 things work, you're done! 🎊**

---

**Good luck! You've got this! 💪**

Last Updated: October 7, 2025


