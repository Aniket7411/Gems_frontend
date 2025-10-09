# 🚀 Backend Quick Start - Copy & Paste Ready!

## ⚡ Super Fast Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

### Step 2: Create .env File
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gems-selling
JWT_SECRET=gems_super_secret_key_change_in_production_12345
JWT_EXPIRE=7d
```

### Step 3: Frontend is Already Configured!
✅ Frontend base URL: `http://localhost:5000/api`  
✅ All endpoints are already integrated  
✅ Cloudinary images upload automatically  

---

## 📡 Essential Endpoints (Must Have)

### 1. Authentication

#### Signup (Buyer/Seller)
```javascript
POST /api/auth/signup
Body: { name, email, password, role: "buyer" or "seller" }
Response: { success, token, user: { _id, name, email, role } }
```

#### Login
```javascript
POST /api/auth/login
Body: { email, password }
Response: { success, token, user: { _id, name, email, role } }
```

#### Get Current User
```javascript
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { success, user }
```

### 2. Gems (Core Features)

#### Get All Gems (PUBLIC - Everyone)
```javascript
GET /api/gems
Query: ?page=1&limit=12&search=emerald&planet=Mercury&minPrice=1000&maxPrice=100000
Response: { success, count, totalPages, currentPage, gems: [...] }
```

#### Get Single Gem (PUBLIC)
```javascript
GET /api/gems/:id
Response: { success, gem: {...} }
```

#### Add Gem (SELLER ONLY)
```javascript
POST /api/gems
Headers: Authorization: Bearer <token>
Body: {
  name, hindiName, planet, planetHindi, color, description,
  benefits: [], suitableFor: [], price, sizeWeight, sizeUnit,
  stock, availability, certification, origin, deliveryDays,
  heroImage: "cloudinary-url", additionalImages: ["urls..."]
}
Response: { success, gem }
```

#### Update Gem (SELLER ONLY - Own Gems)
```javascript
PUT /api/gems/:id
Headers: Authorization: Bearer <token>
Body: { any fields to update }
Response: { success, gem }
```

#### Delete Gem (SELLER ONLY - Own Gems)
```javascript
DELETE /api/gems/:id
Headers: Authorization: Bearer <token>
Response: { success, message }
```

#### Get My Gems (SELLER ONLY)
```javascript
GET /api/gems/my-gems
Headers: Authorization: Bearer <token>
Response: { success, count, gems: [...] }
```

### 3. Cart (BUYER ONLY)

#### Add to Cart
```javascript
POST /api/cart
Headers: Authorization: Bearer <token>
Body: { gemId, quantity }
Response: { success, cart }
```

#### Get Cart
```javascript
GET /api/cart
Headers: Authorization: Bearer <token>
Response: { success, cart: { items: [...], totalPrice } }
```

#### Update Cart Item
```javascript
PUT /api/cart/:itemId
Headers: Authorization: Bearer <token>
Body: { quantity }
Response: { success, cart }
```

#### Remove from Cart
```javascript
DELETE /api/cart/:itemId
Headers: Authorization: Bearer <token>
Response: { success, message }
```

### 4. Orders

#### Create Order (BUYER ONLY)
```javascript
POST /api/orders
Headers: Authorization: Bearer <token>
Body: {
  items: [{ gem, quantity, price }],
  shippingAddress: { name, phone, addressLine1, city, state, pincode, country },
  paymentMethod: "COD",
  totalPrice
}
Response: { success, order }
```

#### Get My Orders (BUYER)
```javascript
GET /api/orders/my-orders
Headers: Authorization: Bearer <token>
Response: { success, orders: [...] }
```

#### Get Seller Orders (SELLER ONLY)
```javascript
GET /api/orders/seller/orders
Headers: Authorization: Bearer <token>
Response: { success, orders: [...] }
```

#### Update Order Status (SELLER ONLY)
```javascript
PUT /api/orders/:id/status
Headers: Authorization: Bearer <token>
Body: { status: "processing" | "shipped" | "delivered" }
Response: { success, order }
```

---

## 🗄️ Database Schemas (MongoDB)

### User Schema
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Hashed with bcrypt
  role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Gem Schema
```javascript
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
  heroImage: { type: String, required: true }, // Cloudinary URL
  additionalImages: [String], // Cloudinary URLs
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Cart Schema
```javascript
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    gem: { type: mongoose.Schema.Types.ObjectId, ref: 'Gem' },
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Order Schema
```javascript
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    gem: { type: mongoose.Schema.Types.ObjectId, ref: 'Gem' },
    quantity: Number,
    price: Number,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  shippingAddress: {
    name: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

---

## 🔒 JWT Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Role-based middleware
const isSeller = (req, res, next) => {
  if (req.userRole !== 'seller') {
    return res.status(403).json({ success: false, message: 'Access denied. Sellers only.' });
  }
  next();
};

const isBuyer = (req, res, next) => {
  if (req.userRole !== 'buyer') {
    return res.status(403).json({ success: false, message: 'Access denied. Buyers only.' });
  }
  next();
};

module.exports = { auth, isSeller, isBuyer };
```

---

## 🎯 Priority Order (What to Build First)

### Phase 1: Core Authentication (Day 1)
1. ✅ Setup Express server
2. ✅ Connect MongoDB
3. ✅ User model with bcrypt
4. ✅ Signup endpoint (with role)
5. ✅ Login endpoint
6. ✅ JWT middleware

### Phase 2: Gem Management (Day 2)
1. ✅ Gem model
2. ✅ Add gem (seller only)
3. ✅ Get all gems (public)
4. ✅ Get single gem (public)
5. ✅ Update gem (seller only)
6. ✅ Delete gem (seller only)

### Phase 3: Shopping Features (Day 3)
1. ✅ Cart model
2. ✅ Add to cart
3. ✅ Get cart
4. ✅ Update/remove cart items

### Phase 4: Orders (Day 4)
1. ✅ Order model
2. ✅ Create order
3. ✅ Get buyer orders
4. ✅ Get seller orders
5. ✅ Update order status

---

## 📞 Response Format (Use Everywhere)

### Success Response
```javascript
res.status(200).json({
  success: true,
  message: "Operation successful",
  data: {...}
});
```

### Error Response
```javascript
res.status(400).json({
  success: false,
  message: "Error message here"
});
```

---

## 🧪 Testing Checklist

- [ ] Signup as buyer works
- [ ] Signup as seller works
- [ ] Login returns JWT token
- [ ] Protected routes reject requests without token
- [ ] Sellers can add gems
- [ ] Buyers cannot add gems
- [ ] All users can view gems
- [ ] Buyers can add to cart
- [ ] Buyers can create orders
- [ ] Sellers can view their orders
- [ ] Sellers can update order status

---

## 📚 Full Documentation

See **BACKEND_DEVELOPER_COMPLETE_GUIDE.md** for:
- Detailed API documentation
- Complete code examples
- Error handling patterns
- Security best practices
- Deployment guide

---

## ⚠️ Important Notes

1. **Password Security**: Always hash passwords with bcrypt (min 10 rounds)
2. **JWT Secret**: Use strong secret in production
3. **Input Validation**: Validate all inputs
4. **Error Handling**: Use try-catch blocks everywhere
5. **CORS**: Configure for frontend domain
6. **Images**: Frontend uploads to Cloudinary, you receive URLs
7. **Roles**: Enforce role checks in middleware

---

🎉 **You're all set! Start with Phase 1 and your app will be live in 4 days!**

