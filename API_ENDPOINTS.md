# Gem E-commerce API Endpoints Documentation

This document outlines all the API endpoints required for the gem e-commerce application.

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. User Registration
- **POST** `/auth/register`
- **Description**: Register a new user
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### 2. User Login
- **POST** `/auth/login`
- **Description**: Authenticate user and return JWT token
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Forgot Password
- **POST** `/auth/forgot-password`
- **Description**: Send password reset email
- **Request Body**:
```json
{
  "email": "john@example.com"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 4. Reset Password
- **POST** `/auth/reset-password/:token`
- **Description**: Reset password using token
- **Request Body**:
```json
{
  "password": "newpassword123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 5. Verify Email
- **GET** `/auth/verify-email/:token`
- **Description**: Verify user email
- **Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 6. Get User Profile
- **GET** `/auth/profile`
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 7. Update User Profile
- **PUT** `/auth/profile`
- **Description**: Update user profile
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "John Smith",
  "phone": "+1234567891"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567891",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 8. Change Password
- **PUT** `/auth/change-password`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Gem Management Endpoints

### 1. Add New Gem
- **POST** `/gems`
- **Description**: Add a new gem to the collection
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "id": "emerald",
  "name": "Emerald",
  "hindiName": "Panna (पन्ना)",
  "planet": "Mercury (Budh Grah)",
  "planetHindi": "बुध ग्रह",
  "color": "Green",
  "hardness": "7.5-8",
  "metal": "Gold or Silver",
  "finger": "Little finger of right hand",
  "day": "Wednesday morning",
  "mantra": "Om Budhaya Namah",
  "emoji": "💚",
  "gradient": "from-green-600 to-emerald-700",
  "bgColor": "bg-green-50",
  "borderColor": "border-green-200",
  "textColor": "text-green-800",
  "description": "Emerald, known as Panna in Hindi, is one of the most revered gemstones in Vedic astrology...",
  "astrologicalSignificance": "In Vedic astrology, Emerald is directly associated with Budh Grah (Mercury)...",
  "benefits": [
    "Enhances intelligence and communication skills",
    "Improves business acumen and analytical ability",
    "Brings mental clarity and focus"
  ],
  "features": {
    "color": "Ranges from light green to deep, rich green...",
    "hardness": "7.5–8 on Mohs scale, making it durable...",
    "cut": "Commonly cut into rectangular step-cut forms...",
    "bestMetal": "Traditionally worn in gold or silver..."
  },
  "history": "Emeralds have been cherished since ancient times...",
  "suitableFor": ["Teachers", "Lawyers", "Writers", "Media professionals"],
  "price": 50000,
  "sizeWeight": 5,
  "sizeUnit": "carat",
  "discount": 10,
  "discountType": "percentage",
  "images": ["url1", "url2", "url3"],
  "uploadedImages": ["base64_image1", "base64_image2"],
  "allImages": ["url1", "url2", "base64_image1"],
  "stock": 10,
  "availability": true,
  "certification": "Govt. Lab Certified",
  "origin": "Sri Lanka"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Gem added successfully",
  "data": {
    "id": "gem_id",
    "name": "Blue Sapphire",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Get All Gems
- **GET** `/gems`
- **Description**: Get all gems with optional filtering
- **Query Parameters**:
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of items per page
  - `category` (optional): Filter by category
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
  - `zodiac` (optional): Filter by zodiac sign
  - `availability` (optional): Filter by availability (true/false)
  - `q` (optional): Search query for name, description, or category
  - `sortBy` (optional): Sort by field (newest, oldest, price-low, price-high, name)
- **Response**:
```json
{
  "success": true,
  "data": {
    "gems": [
      {
        "id": "gem_id",
        "name": "Blue Sapphire",
        "category": "Sapphire",
        "price": 50000,
        "discount": 10,
        "discountType": "percentage",
        "images": ["url1", "url2"],
        "availability": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 3. Get Gem by ID
- **GET** `/gems/:id`
- **Description**: Get detailed information about a specific gem
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "gem_id",
    "name": "Blue Sapphire",
    "description": "High quality blue sapphire...",
    "category": "Sapphire",
    "whomToUse": ["Aries", "Taurus"],
    "benefits": ["Financial Prosperity", "Health & Healing"],
    "price": 50000,
    "sizeWeight": 5,
    "sizeUnit": "carat",
    "discount": 10,
    "discountType": "percentage",
    "allImages": ["url1", "url2"],
    "stock": 10,
    "availability": true,
    "certification": "Govt. Lab Certified",
    "origin": "Sri Lanka",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4. Update Gem
- **PUT** `/gems/:id`
- **Description**: Update gem information
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Same as add gem
- **Response**:
```json
{
  "success": true,
  "message": "Gem updated successfully",
  "data": {
    "id": "gem_id",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5. Delete Gem
- **DELETE** `/gems/:id`
- **Description**: Delete a gem
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "message": "Gem deleted successfully"
}
```

### 6. Search Gems
- **POST** `/gems/search`
- **Description**: Search gems with advanced filters
- **Request Body**:
```json
{
  "query": "blue sapphire",
  "category": "Sapphire",
  "minPrice": 10000,
  "maxPrice": 100000,
  "zodiac": "Aries",
  "benefits": ["Financial Prosperity"],
  "availability": true
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "gems": [...],
    "pagination": {...}
  }
}
```

### 7. Get Gem Categories
- **GET** `/gems/categories`
- **Description**: Get all available gem categories
- **Response**:
```json
{
  "success": true,
  "data": [
    "Sapphire",
    "Ruby",
    "Emerald",
    "Diamond",
    "Pearl",
    "Coral"
  ]
}
```

### 8. Get Gems by Category
- **GET** `/gems/category/:category`
- **Description**: Get gems filtered by category
- **Response**: Same as get all gems

### 9. Get Gems by Zodiac Sign
- **GET** `/gems/zodiac/:zodiacSign`
- **Description**: Get gems suitable for a specific zodiac sign
- **Response**: Same as get all gems

## Cart Endpoints

### 1. Add Item to Cart
- **POST** `/cart/add`
- **Description**: Add gem to user's cart
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "gemId": "gem_id",
  "quantity": 2
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cartItem": {
      "id": "cart_item_id",
      "gemId": "gem_id",
      "quantity": 2,
      "addedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 1.1. Add Multiple Items to Cart (Bulk)
- **POST** `/cart/add-bulk`
- **Description**: Add multiple gems to cart at once
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "items": [
    {
      "gemId": "gem_id_1",
      "quantity": 2
    },
    {
      "gemId": "gem_id_2", 
      "quantity": 1
    }
  ]
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Items added to cart",
  "data": {
    "addedItems": 2,
    "cartItems": [...]
  }
}
```

### 2. Get Cart
- **GET** `/cart`
- **Description**: Get user's cart items
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_id",
        "gem": {
          "id": "gem_id",
          "name": "Blue Sapphire",
          "price": 50000,
          "images": ["url1", "url2"]
        },
        "quantity": 2,
        "addedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100000,
    "itemCount": 2
  }
}
```

### 3. Update Cart Item
- **PUT** `/cart/update/:gemId`
- **Description**: Update quantity of cart item
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "quantity": 3
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Cart item updated"
}
```

### 4. Remove from Cart
- **DELETE** `/cart/remove/:gemId`
- **Description**: Remove item from cart
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

### 5. Clear Cart
- **DELETE** `/cart/clear`
- **Description**: Clear all items from cart
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

## Order Endpoints

### 1. Create Order
- **POST** `/orders`
- **Description**: Create a new order
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "items": [
    {
      "gemId": "gem_id",
      "quantity": 2,
      "price": 50000
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001"
  },
  "paymentMethod": "cod",
  "orderNotes": "Please handle with care"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "ORD123456789",
    "status": "pending",
    "total": 100000,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Get User Orders
- **GET** `/orders`
- **Description**: Get user's order history
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `status` (optional): Filter by order status
- **Response**:
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_id",
        "orderId": "ORD123456789",
        "status": "delivered",
        "total": 100000,
        "items": [...],
        "shippingAddress": {...},
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### 3. Get Order by ID
- **GET** `/orders/:orderId`
- **Description**: Get detailed order information
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "orderId": "ORD123456789",
    "status": "delivered",
    "total": 100000,
    "items": [...],
    "shippingAddress": {...},
    "paymentMethod": "cod",
    "trackingNumber": "TRK123456",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4. Cancel Order
- **PUT** `/orders/:orderId/cancel`
- **Description**: Cancel an order
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

### 5. Update Order Status
- **PUT** `/orders/:orderId/status`
- **Description**: Update order status (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456",
  "notes": "Order shipped via Express Delivery"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

### 6. Get Order Analytics
- **GET** `/orders/analytics`
- **Description**: Get order analytics and statistics (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period` (optional): Time period (daily, weekly, monthly, yearly)
  - `startDate` (optional): Start date for custom period
  - `endDate` (optional): End date for custom period
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalRevenue": 5000000,
    "averageOrderValue": 33333,
    "ordersByStatus": {
      "pending": 10,
      "confirmed": 25,
      "shipped": 30,
      "delivered": 80,
      "cancelled": 5
    },
    "revenueByMonth": [...],
    "topGems": [...]
  }
}
```

## OTP Endpoints (for Non-Logged Users)

### 1. Send OTP
- **POST** `/otp/send`
- **Description**: Send OTP to phone number
- **Request Body**:
```json
{
  "phoneNumber": "+1234567890"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "sessionId": "session_id",
    "expiresAt": "2024-01-01T00:05:00Z"
  }
}
```

### 2. Verify OTP
- **POST** `/otp/verify`
- **Description**: Verify OTP and create temporary session
- **Request Body**:
```json
{
  "phoneNumber": "+1234567890",
  "otp": "123456",
  "sessionId": "session_id"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "tempToken": "temp_jwt_token",
    "expiresAt": "2024-01-01T00:30:00Z"
  }
}
```

## Admin Endpoints

### 1. Get All Users
- **GET** `/admin/users`
- **Description**: Get all users (admin only)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `search` (optional): Search by name or email
- **Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "emailVerified": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "lastLogin": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### 2. Get Dashboard Statistics
- **GET** `/admin/dashboard`
- **Description**: Get admin dashboard statistics
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1500,
    "totalGems": 250,
    "totalOrders": 500,
    "totalRevenue": 10000000,
    "recentOrders": [...],
    "topGems": [...],
    "monthlyRevenue": [...]
  }
}
```

### 3. Upload Gem Images
- **POST** `/admin/gems/upload-images`
- **Description**: Upload images for gems
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Request Body**: Form data with image files
- **Response**:
```json
{
  "success": true,
  "data": {
    "uploadedImages": [
      {
        "filename": "gem_image_1.jpg",
        "url": "https://storage.example.com/gems/gem_image_1.jpg",
        "size": 1024000
      }
    ]
  }
}
```

## Health Check

### 1. Health Check
- **GET** `/health`
- **Description**: Check API health status
- **Response**:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute
- OTP endpoints: 3 requests per minute

## File Upload

For gem images, the API should support:
- File upload via multipart/form-data
- Image formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB per image
- Maximum images per gem: 10

## MongoDB Schema Suggestions

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String, // unique index
  password: String, // hashed
  phone: String,
  emailVerified: Boolean,
  role: String, // 'user' or 'admin'
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### Gems Collection
```javascript
{
  _id: ObjectId,
  id: String, // unique identifier like "emerald", "ruby"
  name: String,
  hindiName: String,
  planet: String,
  planetHindi: String,
  color: String,
  hardness: String,
  metal: String,
  finger: String,
  day: String,
  mantra: String,
  emoji: String,
  gradient: String,
  bgColor: String,
  borderColor: String,
  textColor: String,
  description: String,
  astrologicalSignificance: String,
  benefits: [String], // array of benefits
  features: {
    color: String,
    hardness: String,
    cut: String,
    bestMetal: String
  },
  history: String,
  suitableFor: [String], // array of professions
  price: Number,
  discount: Number,
  discountType: String, // 'percentage' or 'fixed'
  sizeWeight: Number,
  sizeUnit: String,
  images: [String], // array of image URLs
  uploadedImages: [String], // base64 images
  allImages: [String], // combined images
  stock: Number,
  availability: Boolean,
  certification: String,
  origin: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Items Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // reference to users
  gemId: ObjectId, // reference to gems
  quantity: Number,
  createdAt: Date,
  updatedAt: Date
}
// Compound index: { userId: 1, gemId: 1 } - unique
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  orderId: String, // unique order number like "ORD123456789"
  userId: ObjectId, // reference to users
  status: String, // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  total: Number,
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: String, // 'cod', 'online'
  orderNotes: String,
  trackingNumber: String,
  items: [{
    gemId: ObjectId,
    quantity: Number,
    price: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Sessions Collection
```javascript
{
  _id: ObjectId,
  phoneNumber: String,
  otp: String,
  sessionId: String,
  expiresAt: Date,
  verified: Boolean,
  createdAt: Date
}
```

### Indexes Recommendations
```javascript
// Users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "phone": 1 })

// Gems collection
db.gems.createIndex({ "id": 1 }, { unique: true })
db.gems.createIndex({ "planet": 1 })
db.gems.createIndex({ "color": 1 })
db.gems.createIndex({ "price": 1 })
db.gems.createIndex({ "availability": 1 })
db.gems.createIndex({ "suitableFor": 1 })
db.gems.createIndex({ "benefits": 1 })
db.gems.createIndex({ "name": "text", "description": "text", "hindiName": "text", "astrologicalSignificance": "text" })

// Cart items collection
db.cartItems.createIndex({ "userId": 1, "gemId": 1 }, { unique: true })
db.cartItems.createIndex({ "userId": 1 })

// Orders collection
db.orders.createIndex({ "orderId": 1 }, { unique: true })
db.orders.createIndex({ "userId": 1 })
db.orders.createIndex({ "status": 1 })
db.orders.createIndex({ "createdAt": -1 })

// OTP sessions collection
db.otpSessions.createIndex({ "phoneNumber": 1 })
db.otpSessions.createIndex({ "sessionId": 1 })
db.otpSessions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })
```

This API documentation provides a complete reference for implementing the backend for your gem e-commerce application. The backend developer can use this to understand all the required endpoints, data structures, and business logic.
