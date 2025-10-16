# 🔄 Backend Updates Required - Critical Issues Fix

**Date**: October 16, 2025  
**Priority**: CRITICAL for Diwali Launch  
**Current Backend**: https://gems-backend-u.onrender.com/api

---

## ✅ What's Already Working

Based on the actual API response from `/admin/sellers/:id`, your backend **already returns**:

```json
{
  "success": true,
  "seller": {
    "_id": "68f0d07d0f269bf23f022fc4",
    "fullName": "Aniket Sharma",
    "email": "johnaniket72311@gmail.com",
    "shopName": "Raj Kumar Gems & Jewels",
    "phone": "07275061192",
    "alternatePhone": "08318825828",
    "address": {
      "street": "11/305 SOUTER GANJ, KANPUR",
      "city": "Kanpur Nagar",
      "state": "Uttar Pradesh",
      "pincode": "208001"
    },
    "status": "approved",
    "isVerified": true,
    "gems": [
      {
        "_id": "68f0d2515111defeb409f2b5",
        "name": "Emerald",
        "price": 5000,
        "stock": 10,
        "availability": true
      }
    ],
    "stats": {
      "totalGems": 1,
      "totalOrders": 0,
      "totalRevenue": 0,
      "averageRating": 4.5
    }
  }
}
```

✅ **Good news**: Gems array is already included!  
✅ **Good news**: Stats are already available!  
✅ **Good news**: Most data is already there!

---

## 🔧 Issues to Fix

### 1. **Seller Status Management** ⚠️

**Current Status Values Observed**: `approved`, `suspended`

**Issue**: Need to ensure all status transitions work properly.

**Required Status Values**:
- `pending` - New seller waiting for approval
- `approved` - Seller is active and can sell
- `rejected` - Seller application rejected
- `suspended` - Seller temporarily suspended

**Backend Fix Required**:
```javascript
// In PUT /api/admin/sellers/:sellerId/status

async updateSellerStatus(req, res) {
  try {
    const { sellerId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    const updateData = { 
      status,
      updatedAt: new Date()
    };
    
    // Update verification based on status
    if (status === 'approved') {
      updateData.isVerified = true;
      updateData.suspendedAt = null;
      updateData.suspendedBy = null;
    } else if (status === 'suspended') {
      updateData.suspendedAt = new Date();
      updateData.suspendedBy = req.user._id;
    } else if (status === 'rejected') {
      updateData.isVerified = false;
    }
    
    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      updateData,
      { new: true }
    );
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Seller ${status} successfully`,
      seller
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

---

### 2. **Gems Array Format** ✅ WORKING!

Your backend already returns gems correctly inside the seller object. Frontend has been updated to handle this!

---

### 3. **GET Seller's Own Gems** (For Seller Dashboard)

**Endpoint**: `GET /api/gems?seller={sellerId}`

**Current Issue**: Need to filter gems by seller ID

**Backend Implementation**:
```javascript
// In GET /api/gems controller

async getGems(req, res) {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sort = 'newest',
      seller // ✅ ADD THIS PARAMETER
    } = req.query;
    
    // Build query
    let query = {};
    
    // ✅ FILTER BY SELLER
    if (seller) {
      query.seller = seller;
    }
    
    // Other filters...
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      const categories = category.split(',');
      query.category = { $in: categories };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Sorting
    let sortOption = {};
    switch(sort) {
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'oldest': sortOption = { createdAt: 1 }; break;
      case 'price-low': sortOption = { price: 1 }; break;
      case 'price-high': sortOption = { price: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const gems = await Gem.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('seller', 'fullName shopName')
      .lean();
    
    const totalItems = await Gem.countDocuments(query);
    
    return res.status(200).json({
      success: true,
      gems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        hasNext: page * limit < totalItems,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

---

### 4. **Gem Edit/Delete Authorization**

**Endpoints**: 
- `PUT /api/gems/:id`
- `DELETE /api/gems/:id`

**Requirement**: Only gem owner (seller) or admin can edit/delete

**Backend Implementation**:
```javascript
// Middleware: validateGemOwnership
async function validateGemOwnership(req, res, next) {
  try {
    const gemId = req.params.id;
    const gem = await Gem.findById(gemId);
    
    if (!gem) {
      return res.status(404).json({
        success: false,
        message: 'Gem not found'
      });
    }
    
    // Allow if user is admin OR owner
    const isOwner = gem.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own gems'
      });
    }
    
    req.gem = gem;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Apply to routes
router.put('/gems/:id', authenticateUser, validateGemOwnership, updateGem);
router.delete('/gems/:id', authenticateUser, validateGemOwnership, deleteGem);
```

---

### 5. **Delete Seller - Cascade Deletion**

**Endpoint**: `DELETE /api/admin/sellers/:sellerId`

**Requirement**: When deleting seller, also delete their gems

**Backend Implementation**:
```javascript
async deleteSeller(req, res) {
  try {
    const { sellerId } = req.params;
    
    // Start transaction (if using MongoDB 4.0+)
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. Delete all gems by this seller
      const deletedGems = await Gem.deleteMany({ seller: sellerId }, { session });
      console.log(`Deleted ${deletedGems.deletedCount} gems`);
      
      // 2. Delete seller profile
      const seller = await Seller.findByIdAndDelete(sellerId, { session });
      
      if (!seller) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }
      
      // 3. Optionally delete or deactivate user account
      // await User.findByIdAndUpdate(seller.user, { 
      //   isActive: false,
      //   deletedAt: new Date() 
      // }, { session });
      
      await session.commitTransaction();
      
      return res.status(200).json({
        success: true,
        message: `Seller deleted successfully. ${deletedGems.deletedCount} gems removed.`
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

---

### 6. **Stock Management in Orders** 🆕

**Endpoints**: 
- `POST /api/orders`
- `PUT /api/orders/:orderId/cancel`

**Requirement**: 
- Reduce stock when order is placed
- Restore stock when order is cancelled

**Backend Implementation**:

#### Order Creation with Stock Validation:
```javascript
async createOrder(req, res) {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, orderNotes } = req.body;
    
    // ✅ STEP 1: Validate stock availability for ALL items
    for (const item of items) {
      const gem = await Gem.findById(item.gemId);
      
      if (!gem) {
        return res.status(404).json({
          success: false,
          message: `Gem not found: ${item.gemId}`
        });
      }
      
      if (!gem.stock || gem.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${gem.name}. Available: ${gem.stock || 0}, Requested: ${item.quantity}`
        });
      }
    }
    
    // ✅ STEP 2: Create order
    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const order = new Order({
      user: req.user._id,
      orderId,
      items: items.map(item => ({
        gemId: item.gemId,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderNotes,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
    });
    
    // ✅ STEP 3: Reduce stock for all items
    for (const item of items) {
      await Gem.findByIdAndUpdate(item.gemId, {
        $inc: { 
          stock: -item.quantity,
          sales: item.quantity
        }
      });
      
      // Update availability if stock reaches 0
      const gem = await Gem.findById(item.gemId);
      if (gem.stock === 0) {
        gem.availability = false;
        await gem.save();
      }
    }
    
    await order.save();
    
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.orderId,
        order
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

#### Order Cancellation with Stock Restoration:
```javascript
async cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order can be cancelled
    if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }
    
    // ✅ RESTORE STOCK
    for (const item of order.items) {
      await Gem.findByIdAndUpdate(item.gemId, {
        $inc: { 
          stock: item.quantity,
          sales: -item.quantity
        }
      });
      
      // Update availability
      const gem = await Gem.findById(item.gemId);
      if (gem.stock > 0) {
        gem.availability = true;
        await gem.save();
      }
    }
    
    // Update order
    order.status = 'cancelled';
    order.cancelReason = reason;
    order.cancelledAt = new Date();
    await order.save();
    
    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

---

## 📋 Quick Implementation Checklist

### ✅ Already Working:
- [x] Admin can get seller details
- [x] Gems array is returned with seller
- [x] Stats are calculated and returned
- [x] Seller status management exists

### 🔧 Need to Fix/Verify:

#### Critical (Do First):
- [ ] **Test seller status updates** (`PUT /admin/sellers/:id/status`)
  - Approve: `pending` → `approved`
  - Suspend: `approved` → `suspended`
  - Reject: `pending` → `rejected`
  - Reactivate: `suspended` → `approved`

- [ ] **Implement seller deletion** (`DELETE /admin/sellers/:id`)
  - Delete seller's gems
  - Delete seller profile
  - Return success message

- [ ] **Add seller filter to gems** (`GET /gems?seller={id}`)
  - Filter gems by seller ID
  - Used in seller dashboard

#### Important (Do Next):
- [ ] **Implement stock validation in order creation**
  - Check stock before creating order
  - Reduce stock when order placed
  - Update availability to `false` when stock = 0

- [ ] **Implement stock restoration in order cancellation**
  - Restore stock when order cancelled
  - Update availability to `true` when stock > 0

- [ ] **Add gem ownership validation**
  - Only owner or admin can edit/delete gems
  - Return 403 error if unauthorized

---

## 🧪 Testing Steps

### Test 1: Seller Status Management
```bash
# Approve Seller
PUT /api/admin/sellers/68f0d07d0f269bf23f022fc4/status
Body: { "status": "approved" }
Expected: { success: true, seller: { status: "approved", isVerified: true } }

# Suspend Seller
PUT /api/admin/sellers/68f0d07d0f269bf23f022fc4/status
Body: { "status": "suspended" }
Expected: { success: true, seller: { status: "suspended", suspendedAt: "..." } }

# Reactivate (from suspended to approved)
PUT /api/admin/sellers/68f0d07d0f269bf23f022fc4/status
Body: { "status": "approved" }
Expected: { success: true, seller: { status: "approved", suspendedAt: null } }

# Reject Seller
PUT /api/admin/sellers/68f0d07d0f269bf23f022fc4/status
Body: { "status": "rejected" }
Expected: { success: true, seller: { status: "rejected", isVerified: false } }
```

### Test 2: Delete Seller
```bash
DELETE /api/admin/sellers/68f0d07d0f269bf23f022fc4
Expected: {
  success: true,
  message: "Seller deleted successfully. 1 gems removed."
}

# Verify gems are deleted
GET /api/gems?seller=68f0d07d0f269bf23f022fc4
Expected: { gems: [] }
```

### Test 3: Get Seller's Gems
```bash
GET /api/gems?seller=68f0d07d0f269bf23f022fc4
Expected: {
  success: true,
  gems: [...],
  pagination: {...}
}
```

### Test 4: Stock Management
```bash
# Create order
POST /api/orders
Body: {
  items: [{ gemId: "68f0d2515111defeb409f2b5", quantity: 2, price: 5000 }],
  ...
}

# Check gem stock reduced
GET /api/gems/68f0d2515111defeb409f2b5
Expected: { stock: 8 } // Was 10, now 8

# Cancel order
PUT /api/orders/{orderId}/cancel
Body: { reason: "Changed mind" }

# Check gem stock restored
GET /api/gems/68f0d2515111defeb409f2b5
Expected: { stock: 10 } // Back to 10
```

---

## 📊 Database Schema Verification

### Seller Model - Verify These Fields Exist:
```javascript
{
  fullName: String,
  shopName: String,
  email: String,
  phone: String,
  alternatePhone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  
  // ✅ Status Management
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  isVerified: Boolean,
  suspendedAt: Date,
  suspendedBy: ObjectId,
  
  // Business Details
  businessType: String,
  gstNumber: String,
  panNumber: String,
  aadharNumber: String,
  bankName: String,
  accountNumber: String,
  accountHolderName: String,
  ifscCode: String,
  
  // Categories
  gemTypes: [String],
  specialization: [String],
  
  // Stats (can be virtual or actual fields)
  stats: {
    totalGems: Number,
    totalOrders: Number,
    totalRevenue: Number,
    averageRating: Number
  }
}
```

### Gem Model - Verify Stock Fields:
```javascript
{
  name: String,
  category: String,
  price: Number,
  
  // ✅ CRITICAL: Stock Management
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  
  // Other fields...
  sizeWeight: Number,
  sizeUnit: String,
  images: [String],
  seller: ObjectId,
  sales: { type: Number, default: 0 }
}
```

---

## 🚀 API Routes Summary (What Needs Testing/Fixing)

```javascript
// ✅ Already Working
GET  /api/admin/sellers/:id              // Returns seller with gems ✅

// 🔧 Need to Verify/Fix
PUT    /api/admin/sellers/:id/status     // Test all status transitions
DELETE /api/admin/sellers/:id            // Implement cascade deletion
GET    /api/gems?seller={id}             // Add seller filter
PUT    /api/gems/:id                     // Add ownership validation
DELETE /api/gems/:id                     // Add ownership validation
POST   /api/orders                       // Add stock validation & reduction
PUT    /api/orders/:id/cancel            // Add stock restoration
```

---

## 💡 Optional Enhancements (If Time Permits)

### 1. Reactivate Suspended Seller Endpoint
```javascript
// Alternative dedicated endpoint
PUT /api/admin/sellers/:sellerId/reactivate

async reactivateSeller(req, res) {
  const seller = await Seller.findByIdAndUpdate(
    req.params.sellerId,
    {
      status: 'approved',
      isVerified: true,
      suspendedAt: null,
      suspendedBy: null,
      reactivatedAt: new Date(),
      reactivatedBy: req.user._id
    },
    { new: true }
  );
  
  return res.json({
    success: true,
    message: 'Seller reactivated successfully',
    seller
  });
}
```

### 2. Bulk Status Update
```javascript
PUT /api/admin/sellers/bulk-update

Body: {
  sellerIds: ["id1", "id2"],
  status: "approved"
}
```

### 3. Seller Activity Log
Track all admin actions on sellers:
```javascript
{
  sellerId: ObjectId,
  action: String, // 'approved', 'suspended', 'deleted'
  performedBy: ObjectId,
  performedAt: Date,
  reason: String
}
```

---

## ⚠️ CRITICAL NOTES

1. **Gems Array**: Already working! It's inside `seller.gems` in the response ✅

2. **Stock Field**: Make sure `stock` field exists in Gem model and is returned in API responses

3. **Seller Filter**: The `GET /gems?seller={id}` is essential for seller dashboard to work

4. **Ownership Validation**: Critical for security - sellers should only edit their own gems

5. **Transaction Safety**: Use MongoDB transactions for delete operations to ensure data consistency

---

## 🎯 Priority Order

**Do these in order**:

1. ✅ **Highest Priority**:
   - Test and verify `PUT /admin/sellers/:id/status` works for all statuses
   - Implement `GET /gems?seller={id}` filter

2. 🔥 **High Priority**:
   - Implement `DELETE /admin/sellers/:id` with cascade
   - Add stock validation in order creation
   - Add stock restoration in order cancellation

3. 📝 **Medium Priority**:
   - Add ownership validation for gem edit/delete
   - Add proper error messages

4. 💡 **Nice to Have**:
   - Activity logs
   - Email notifications
   - Bulk operations

---

## 🔍 What Frontend Expects

Based on actual backend response, frontend now correctly handles:

✅ Gems inside `seller.gems` array  
✅ Stats inside `seller.stats` object  
✅ All seller details (business, bank, etc.)  
✅ Status values: pending, approved, suspended, rejected  
✅ Stock values in gems  

---

## 📞 Questions for Backend Team?

If you have the actual backend code, I can help review and make specific fixes. Otherwise, implement the changes above and the platform will work perfectly!

---

**Status**: Frontend 100% ready! Backend needs these updates to be fully functional.

**Timeline**: Can be implemented in 2-3 hours by backend developer.

**Happy Diwali Launch!** 🪔✨

