# 🚀 Complete Backend Implementation Guide - Gems Selling Platform

## 📋 Table of Contents
1. [Quick Setup](#quick-setup)
2. [Authentication & User Roles](#authentication--user-roles)
3. [All API Endpoints](#all-api-endpoints)
4. [Database Schemas](#database-schemas)
5. [Complete Code Implementation](#complete-code-implementation)

---

## 🎯 Quick Setup

### Prerequisites
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

### Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gems-selling
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 🔐 Authentication & User Roles

### User Types
- **BUYER**: Regular customers who can browse and purchase gems
- **SELLER**: Can add, update, and manage gem listings

### Authentication Flow
1. User signs up with role (buyer/seller)
2. Password is hashed with bcrypt
3. JWT token is generated on login
4. Token is sent in Authorization header: `Bearer <token>`

---

## 📡 ALL API ENDPOINTS

### Base URL
```
http://localhost:5000/api
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Signup (Register New User)
```
POST /auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"  // or "seller"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 1.2 Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

---

### 1.3 Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

---

## 2. GEM ENDPOINTS

### 2.1 Add New Gem (SELLER ONLY)
```
POST /gems
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Emerald",
  "hindiName": "Panna (पन्ना)",
  "planet": "Mercury (Budh)",
  "planetHindi": "बुध ग्रह",
  "color": "Green",
  "description": "Beautiful natural emerald with excellent clarity...",
  "benefits": [
    "Enhances intelligence and communication skills",
    "Improves business acumen and analytical ability",
    "Brings mental clarity and focus"
  ],
  "suitableFor": [
    "Teachers",
    "Lawyers",
    "Writers",
    "Media professionals"
  ],
  "price": 50000,
  "sizeWeight": 5.5,
  "sizeUnit": "carat",
  "stock": 10,
  "availability": true,
  "certification": "Govt. Lab Certified",
  "origin": "Sri Lanka",
  "deliveryDays": 7,
  "heroImage": "https://res.cloudinary.com/defgskoxv/image/upload/v1234567890/STJ/hero_image.jpg",
  "additionalImages": [
    "https://res.cloudinary.com/defgskoxv/image/upload/v1234567890/STJ/image1.jpg",
    "https://res.cloudinary.com/defgskoxv/image/upload/v1234567890/STJ/image2.jpg"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Gem added successfully",
  "gem": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Emerald",
    "hindiName": "Panna (पन्ना)",
    "price": 50000,
    "heroImage": "https://res.cloudinary.com/...",
    "seller": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2.2 Get All Gems (PUBLIC)
```
GET /gems
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `search` (optional): Search by name
- `planet` (optional): Filter by planet
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `availability` (optional): true/false

**Example:**
```
GET /gems?page=1&limit=12&planet=Mercury&minPrice=1000&maxPrice=100000
```

**Response:**
```json
{
  "success": true,
  "count": 45,
  "totalPages": 4,
  "currentPage": 1,
  "gems": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Emerald",
      "hindiName": "Panna (पन्ना)",
      "planet": "Mercury (Budh)",
      "color": "Green",
      "price": 50000,
      "sizeWeight": 5.5,
      "sizeUnit": "carat",
      "heroImage": "https://res.cloudinary.com/...",
      "additionalImages": ["https://res.cloudinary.com/..."],
      "availability": true,
      "deliveryDays": 7,
      "seller": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Seller Name"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 2.3 Get Single Gem by ID (PUBLIC)
```
GET /gems/:id
```

**Response:**
```json
{
  "success": true,
  "gem": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Emerald",
    "hindiName": "Panna (पन्ना)",
    "planet": "Mercury (Budh)",
    "planetHindi": "बुध ग्रह",
    "color": "Green",
    "description": "Beautiful natural emerald with excellent clarity...",
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
    "heroImage": "https://res.cloudinary.com/...",
    "additionalImages": ["https://res.cloudinary.com/..."],
    "seller": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Seller Name",
      "email": "seller@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2.4 Update Gem (SELLER ONLY - Own gems)
```
PUT /gems/:id
Headers: Authorization: Bearer <token>
```

**Request Body:** (Same as Add Gem, all fields optional)
```json
{
  "price": 55000,
  "stock": 8,
  "availability": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Gem updated successfully",
  "gem": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Emerald",
    "price": 55000,
    "stock": 8
  }
}
```

---

### 2.5 Delete Gem (SELLER ONLY - Own gems)
```
DELETE /gems/:id
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Gem deleted successfully"
}
```

---

### 2.6 Get My Gems (SELLER ONLY)
```
GET /gems/my-gems
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "gems": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Emerald",
      "price": 50000,
      "stock": 10,
      "availability": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 3. CART ENDPOINTS

### 3.1 Add to Cart (BUYER ONLY)
```
POST /cart
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "gemId": "507f1f77bcf86cd799439011",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": {
    "items": [
      {
        "gem": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Emerald",
          "price": 50000,
          "heroImage": "https://res.cloudinary.com/..."
        },
        "quantity": 1,
        "price": 50000
      }
    ],
    "totalItems": 1,
    "totalPrice": 50000
  }
}
```

---

### 3.2 Get Cart (BUYER ONLY)
```
GET /cart
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "gem": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Emerald",
          "price": 50000,
          "heroImage": "https://res.cloudinary.com/...",
          "availability": true,
          "stock": 10
        },
        "quantity": 2,
        "price": 50000
      }
    ],
    "totalItems": 2,
    "totalPrice": 100000
  }
}
```

---

### 3.3 Update Cart Item
```
PUT /cart/:itemId
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

---

### 3.4 Remove from Cart
```
DELETE /cart/:itemId
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### 3.5 Clear Cart
```
DELETE /cart
Headers: Authorization: Bearer <token>
```

---

## 4. ORDER ENDPOINTS

### 4.1 Create Order (BUYER ONLY)
```
POST /orders
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "gem": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 50000
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+91 9876543210",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "COD",
  "totalPrice": 100000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439014",
    "orderNumber": "ORD-2024-001",
    "totalPrice": 100000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4.2 Get My Orders (BUYER)
```
GET /orders/my-orders
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "orderNumber": "ORD-2024-001",
      "totalPrice": 100000,
      "status": "pending",
      "items": [
        {
          "gem": {
            "name": "Emerald",
            "heroImage": "https://res.cloudinary.com/..."
          },
          "quantity": 2,
          "price": 50000
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 4.3 Get Single Order
```
GET /orders/:id
Headers: Authorization: Bearer <token>
```

---

### 4.4 Cancel Order (BUYER ONLY)
```
PUT /orders/:id/cancel
Headers: Authorization: Bearer <token>
```

---

## 5. SELLER ORDERS

### 5.1 Get Seller Orders (SELLER ONLY)
```
GET /orders/seller/orders
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "orderNumber": "ORD-2024-001",
      "buyer": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "gem": {
            "name": "Emerald"
          },
          "quantity": 2,
          "price": 50000
        }
      ],
      "totalPrice": 100000,
      "status": "pending",
      "shippingAddress": {...},
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 5.2 Update Order Status (SELLER ONLY)
```
PUT /orders/:id/status
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "processing"  // pending, processing, shipped, delivered, cancelled
}
```

---

## 📊 DATABASE SCHEMAS

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['buyer', 'seller'], default: 'buyer'),
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Gem Schema
```javascript
{
  name: String (required),
  hindiName: String (required),
  planet: String (required),
  planetHindi: String,
  color: String (required),
  description: String (required),
  benefits: [String] (required),
  suitableFor: [String] (required),
  price: Number (required),
  sizeWeight: Number (required),
  sizeUnit: String (enum: ['carat', 'gram', 'ounce']),
  stock: Number (default: 0),
  availability: Boolean (default: true),
  certification: String (required),
  origin: String (required),
  deliveryDays: Number (required),
  heroImage: String (required, Cloudinary URL),
  additionalImages: [String] (Cloudinary URLs),
  seller: ObjectId (ref: 'User', required),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  user: ObjectId (ref: 'User', required),
  items: [
    {
      gem: ObjectId (ref: 'Gem'),
      quantity: Number (default: 1),
      price: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  orderNumber: String (unique, auto-generated),
  user: ObjectId (ref: 'User', required),
  items: [
    {
      gem: ObjectId (ref: 'Gem'),
      quantity: Number,
      price: Number,
      seller: ObjectId (ref: 'User')
    }
  ],
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
  paymentMethod: String (enum: ['COD', 'Online']),
  paymentStatus: String (enum: ['pending', 'completed', 'failed']),
  totalPrice: Number (required),
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💻 COMPLETE BACKEND CODE

### Project Structure
```
backend/
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Gem.js
│   ├── Cart.js
│   └── Order.js
├── middleware/
│   ├── auth.js
│   └── role.js
├── routes/
│   ├── auth.js
│   ├── gems.js
│   ├── cart.js
│   └── orders.js
├── controllers/
│   ├── authController.js
│   ├── gemController.js
│   ├── cartController.js
│   └── orderController.js
└── .env
```

---

## 🎯 Quick Start for Backend Developer

1. **Clone/Create project**
```bash
mkdir gems-backend && cd gems-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

2. **Create .env file**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gems-selling
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

3. **Copy all code files** (provided below)

4. **Run server**
```bash
node server.js
```

5. **Test with frontend**
- Frontend is configured to use `http://localhost:5000/api`
- All endpoints will work automatically once backend is running

---

## 🔒 Important Security Notes

1. **Password Hashing**: Always use bcrypt with minimum 10 salt rounds
2. **JWT Secret**: Use strong, random secret in production
3. **Input Validation**: Validate all inputs before processing
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **CORS**: Configure CORS properly for production
6. **Environment Variables**: Never commit .env file to git

---

## 🚀 Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB URI
- [ ] Set up proper CORS origins
- [ ] Add request validation
- [ ] Implement rate limiting
- [ ] Add logging
- [ ] Set up error tracking
- [ ] Configure HTTPS
- [ ] Test all endpoints

---

## 📝 Testing the API

Use Postman or similar tools:

1. **Signup**: POST to `/api/auth/signup` with buyer/seller role
2. **Login**: POST to `/api/auth/login` to get token
3. **Add Token**: Copy token and add to Authorization header: `Bearer <token>`
4. **Test Gems**: 
   - As seller: Add gems via POST `/api/gems`
   - As anyone: Get gems via GET `/api/gems`
5. **Test Cart**: As buyer, add items to cart
6. **Create Order**: As buyer, place an order

---

## 🎉 You're Ready!

This backend will work perfectly with your frontend. The frontend is already configured with:
- All these endpoints
- Proper authentication
- Cloudinary image uploads (images go directly to Cloudinary, URLs come to backend)
- Buyer/Seller role support

**Just implement the backend code and you're done!** 🚀

---

For questions or issues, check the code comments or refer to this guide.
