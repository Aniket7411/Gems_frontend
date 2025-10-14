# 🚀 Backend Quick Reference - Shop Page API

## 📋 **What You Need to Implement**

### **Endpoint:** `GET /api/gems`

---

## 📥 **What Frontend Sends**

```
GET /api/gems?page=2&limit=10&search=blue&category=Ruby,Sapphire&minPrice=1000&maxPrice=5000&sort=newest
```

### **Query Parameters:**

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `page` | Number | `2` | Page number (default: 1) |
| `limit` | Number | `10` | Items per page (default: 12) |
| `search` | String | `"blue"` | Search keyword |
| `category` | String | `"Ruby,Sapphire"` | Comma-separated categories |
| `minPrice` | Number | `1000` | Minimum price filter |
| `maxPrice` | Number | `5000` | Maximum price filter |
| `sort` | String | `"newest"` | Sort order |

**Sort Options:**
- `newest` - createdAt DESC
- `oldest` - createdAt ASC
- `price-low` - price ASC
- `price-high` - price DESC

---

## 📤 **What Backend Should Return**

```json
{
  "success": true,
  "gems": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Ruby",
      "hindiName": "Manik (माणिक)",
      "planet": "Sun (Surya)",
      "planetHindi": "सूर्य",
      "color": "Red",
      "description": "Ruby is the king...",
      "benefits": ["Boosts confidence"],
      "suitableFor": ["Aries", "Leo"],
      "price": 50000,
      "sizeWeight": 5.5,
      "sizeUnit": "carat",
      "stock": 10,
      "availability": true,
      "certification": "Govt. Lab Certified",
      "origin": "Burma",
      "deliveryDays": 7,
      "heroImage": "https://cloudinary.com/.../ruby.jpg",
      "additionalImages": ["https://cloudinary.com/.../ruby2.jpg"],
      "seller": {
        "_id": "507f...",
        "fullName": "Raj Kumar Gems",
        "shopName": "Raj Kumar Gems & Jewels",
        "isVerified": true
      },
      "createdAt": "2024-10-09T10:30:00.000Z",
      "updatedAt": "2024-10-09T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalItems": 58,
    "limit": 10,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## 💻 **Complete Backend Code**

```javascript
// routes/gems.js
const express = require('express');
const router = express.Router();
const Gem = require('../models/Gem');

router.get('/gems', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search = '',
            category = '',
            minPrice = '',
            maxPrice = '',
            sort = 'newest'
        } = req.query;

        // BUILD QUERY
        let query = {};

        // 1. Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { hindiName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // 2. Category filter (multiple)
        if (category) {
            const categories = category.split(',').map(cat => cat.trim());
            query.name = { $in: categories };
        }

        // 3. Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // BUILD SORT
        let sortOption = {};
        switch (sort) {
            case 'oldest':
                sortOption.createdAt = 1;
                break;
            case 'price-low':
                sortOption.price = 1;
                break;
            case 'price-high':
                sortOption.price = -1;
                break;
            case 'newest':
            default:
                sortOption.createdAt = -1;
                break;
        }

        // PAGINATION
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Gem.countDocuments(query);
        const totalPages = Math.ceil(total / Number(limit));

        // FETCH GEMS
        const gems = await Gem.find(query)
            .populate('seller', 'fullName shopName email phone isVerified')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        // RESPONSE
        res.json({
            success: true,
            gems,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalItems: total,
                limit: Number(limit),
                hasNext: Number(page) < totalPages,
                hasPrev: Number(page) > 1
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching gems',
            error: error.message
        });
    }
});

module.exports = router;
```

---

## 🗄️ **Gem Model (Mongoose)**

```javascript
const gemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hindiName: String,
    planet: String,
    planetHindi: String,
    color: String,
    description: String,
    benefits: [String],
    suitableFor: [String],
    price: { type: Number, required: true },
    sizeWeight: Number,
    sizeUnit: String,
    stock: Number,
    availability: { type: Boolean, default: true },
    certification: String,
    origin: String,
    deliveryDays: Number,
    heroImage: String,
    additionalImages: [String],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
}, { timestamps: true });

module.exports = mongoose.model('Gem', gemSchema);
```

---

## 🧪 **Test It**

```bash
# Basic
curl "http://localhost:5000/api/gems?page=1&limit=12"

# With search
curl "http://localhost:5000/api/gems?search=ruby"

# With categories
curl "http://localhost:5000/api/gems?category=Ruby,Sapphire"

# With price
curl "http://localhost:5000/api/gems?minPrice=1000&maxPrice=50000"

# With sort
curl "http://localhost:5000/api/gems?sort=price-low"

# ALL COMBINED
curl "http://localhost:5000/api/gems?page=2&limit=10&search=blue&category=Ruby,Sapphire&minPrice=1000&maxPrice=5000&sort=newest"
```

---

## 📊 **MongoDB Query Examples**

### **Search:**
```javascript
{
  $or: [
    { name: { $regex: 'ruby', $options: 'i' } },
    { hindiName: { $regex: 'ruby', $options: 'i' } },
    { description: { $regex: 'ruby', $options: 'i' } }
  ]
}
```

### **Category (Multiple):**
```javascript
{
  name: { $in: ['Ruby', 'Sapphire', 'Diamond'] }
}
```

### **Price Range:**
```javascript
{
  price: { $gte: 1000, $lte: 50000 }
}
```

### **Combined:**
```javascript
{
  $or: [
    { name: { $regex: 'blue', $options: 'i' } },
    { hindiName: { $regex: 'blue', $options: 'i' } }
  ],
  name: { $in: ['Ruby', 'Sapphire'] },
  price: { $gte: 1000, $lte: 5000 }
}
```

---

## 🎯 **Bonus: Categories Endpoint**

```javascript
router.get('/gems/categories', async (req, res) => {
    try {
        const categories = await Gem.distinct('name');
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
});
```

---

## ✅ **Checklist**

- [ ] Create Gem model with all fields
- [ ] Implement GET /api/gems route
- [ ] Handle search parameter (name, hindiName, description)
- [ ] Handle category filter (split by comma, use $in)
- [ ] Handle price range (minPrice, maxPrice)
- [ ] Handle sort (newest/oldest/price-low/price-high)
- [ ] Implement pagination (skip, limit)
- [ ] Populate seller details
- [ ] Return pagination object
- [ ] Test with all filters combined

---

## 🚀 **Setup**

1. **Install:**
```bash
npm install express mongoose cors dotenv
```

2. **Register route in server.js:**
```javascript
const gemRoutes = require('./routes/gems');
app.use('/api', gemRoutes);
```

3. **Test:**
```bash
npm start
curl "http://localhost:5000/api/gems?page=1&limit=12"
```

---

## 📝 **Important Notes**

1. **Category field**: Frontend assumes gem name IS the category (Ruby, Sapphire, etc.). If you have a separate `category` field, adjust the query accordingly.

2. **Populate seller**: Always populate seller with: `fullName`, `shopName`, `email`, `phone`, `isVerified`

3. **Empty response**: If no gems found, return empty array with pagination showing 0 items.

4. **Error handling**: Always return `{ success: false, message: "..." }` on errors.

---

**For complete details, see:** `COMPLETE_SHOP_API_DOCUMENTATION.md`

Last Updated: October 13, 2025


