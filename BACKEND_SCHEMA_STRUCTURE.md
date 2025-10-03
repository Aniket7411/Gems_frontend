# Backend Schema Structure for Enhanced Gemstone Data

This document provides the complete backend schema structure for implementing the enhanced gemstone data model in your backend system.

## Database Schema (MongoDB)

### Gems Collection Schema

```javascript
{
  _id: ObjectId,
  id: String, // unique identifier like "emerald", "ruby", "sapphire"
  name: String, // English name
  hindiName: String, // Hindi name with script
  planet: String, // Associated planet in English
  planetHindi: String, // Associated planet in Hindi script
  color: String, // Primary color
  hardness: String, // Mohs scale hardness range
  metal: String, // Recommended metal for setting
  finger: String, // Recommended finger for wearing
  day: String, // Recommended day for wearing
  mantra: String, // Associated mantra
  emoji: String, // Emoji representation
  gradient: String, // CSS gradient class for UI
  bgColor: String, // Background color class for UI
  borderColor: String, // Border color class for UI
  textColor: String, // Text color class for UI
  description: String, // General description
  astrologicalSignificance: String, // Astrological importance
  benefits: [String], // Array of benefits
  features: {
    color: String, // Detailed color description
    hardness: String, // Detailed hardness info
    cut: String, // Cut and shape recommendations
    bestMetal: String // Best metal combinations
  },
  history: String, // Historical significance
  suitableFor: [String], // Array of suitable professions
  price: Number, // Price in currency
  discount: Number, // Discount amount
  discountType: String, // "percentage" or "fixed"
  sizeWeight: Number, // Size/weight value
  sizeUnit: String, // Unit (carat, gram, etc.)
  images: [String], // Array of image URLs
  uploadedImages: [String], // Array of base64 images
  allImages: [String], // Combined images array
  stock: Number, // Available stock quantity
  availability: Boolean, // Whether currently available
  certification: String, // Certification details
  origin: String, // Origin/country
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoint Structure

### POST /api/gems - Add New Gem

**Request Body Validation Schema:**
```javascript
{
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hindiName: {
    type: String,
    required: true,
    trim: true
  },
  planet: {
    type: String,
    required: true,
    trim: true
  },
  planetHindi: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  hardness: {
    type: String,
    trim: true
  },
  metal: {
    type: String,
    trim: true
  },
  finger: {
    type: String,
    trim: true
  },
  day: {
    type: String,
    trim: true
  },
  mantra: {
    type: String,
    trim: true
  },
  emoji: {
    type: String,
    trim: true
  },
  gradient: {
    type: String,
    trim: true
  },
  bgColor: {
    type: String,
    trim: true
  },
  borderColor: {
    type: String,
    trim: true
  },
  textColor: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  astrologicalSignificance: {
    type: String,
    required: true,
    trim: true
  },
  benefits: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one benefit is required'
    }
  },
  features: {
    color: {
      type: String,
      trim: true
    },
    hardness: {
      type: String,
      trim: true
    },
    cut: {
      type: String,
      trim: true
    },
    bestMetal: {
      type: String,
      trim: true
    }
  },
  history: {
    type: String,
    trim: true
  },
  suitableFor: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one suitable profession is required'
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  sizeWeight: {
    type: Number,
    required: true,
    min: 0
  },
  sizeUnit: {
    type: String,
    enum: ['carat', 'gram', 'ounce'],
    default: 'carat'
  },
  images: {
    type: [String],
    default: []
  },
  uploadedImages: {
    type: [String],
    default: []
  },
  allImages: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    min: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  certification: {
    type: String,
    required: true,
    trim: true
  },
  origin: {
    type: String,
    required: true,
    trim: true
  }
}
```

## Backend Implementation Examples

### Node.js with Mongoose

```javascript
// models/Gem.js
const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hindiName: {
    type: String,
    required: true,
    trim: true
  },
  planet: {
    type: String,
    required: true,
    trim: true
  },
  planetHindi: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  hardness: {
    type: String,
    trim: true
  },
  metal: {
    type: String,
    trim: true
  },
  finger: {
    type: String,
    trim: true
  },
  day: {
    type: String,
    trim: true
  },
  mantra: {
    type: String,
    trim: true
  },
  emoji: {
    type: String,
    trim: true
  },
  gradient: {
    type: String,
    trim: true
  },
  bgColor: {
    type: String,
    trim: true
  },
  borderColor: {
    type: String,
    trim: true
  },
  textColor: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  astrologicalSignificance: {
    type: String,
    required: true,
    trim: true
  },
  benefits: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one benefit is required'
    }
  },
  features: {
    color: {
      type: String,
      trim: true
    },
    hardness: {
      type: String,
      trim: true
    },
    cut: {
      type: String,
      trim: true
    },
    bestMetal: {
      type: String,
      trim: true
    }
  },
  history: {
    type: String,
    trim: true
  },
  suitableFor: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one suitable profession is required'
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  sizeWeight: {
    type: Number,
    required: true,
    min: 0
  },
  sizeUnit: {
    type: String,
    enum: ['carat', 'gram', 'ounce'],
    default: 'carat'
  },
  images: {
    type: [String],
    default: []
  },
  uploadedImages: {
    type: [String],
    default: []
  },
  allImages: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    min: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  certification: {
    type: String,
    required: true,
    trim: true
  },
  origin: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
gemSchema.index({ id: 1 }, { unique: true });
gemSchema.index({ planet: 1 });
gemSchema.index({ color: 1 });
gemSchema.index({ price: 1 });
gemSchema.index({ availability: 1 });
gemSchema.index({ suitableFor: 1 });
gemSchema.index({ benefits: 1 });
gemSchema.index({ 
  name: 'text', 
  description: 'text', 
  hindiName: 'text', 
  astrologicalSignificance: 'text' 
});

module.exports = mongoose.model('Gem', gemSchema);
```

### Controller Example

```javascript
// controllers/gemController.js
const Gem = require('../models/Gem');

exports.addGem = async (req, res) => {
  try {
    const gemData = req.body;
    
    // Process uploaded images if any
    if (gemData.uploadedImages && gemData.uploadedImages.length > 0) {
      // Handle base64 image processing
      gemData.allImages = [...gemData.images, ...gemData.uploadedImages];
    } else {
      gemData.allImages = gemData.images || [];
    }
    
    const gem = new Gem(gemData);
    await gem.save();
    
    res.status(201).json({
      success: true,
      message: 'Gem added successfully',
      data: {
        id: gem._id,
        name: gem.name,
        createdAt: gem.createdAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Gem with this ID already exists',
        error: 'DUPLICATE_ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add gem',
      error: error.message
    });
  }
};

exports.getGems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      planet,
      color,
      minPrice,
      maxPrice,
      suitableFor,
      availability,
      q
    } = req.query;
    
    const filter = {};
    
    if (planet) filter.planet = planet;
    if (color) filter.color = color;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (suitableFor) filter.suitableFor = { $in: [suitableFor] };
    if (availability !== undefined) filter.availability = availability === 'true';
    if (q) filter.$text = { $search: q };
    
    const gems = await Gem.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await Gem.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        gems,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gems',
      error: error.message
    });
  }
};
```

## Database Indexes

```javascript
// Create indexes for optimal performance
db.gems.createIndex({ "id": 1 }, { unique: true });
db.gems.createIndex({ "planet": 1 });
db.gems.createIndex({ "color": 1 });
db.gems.createIndex({ "price": 1 });
db.gems.createIndex({ "availability": 1 });
db.gems.createIndex({ "suitableFor": 1 });
db.gems.createIndex({ "benefits": 1 });
db.gems.createIndex({ 
  "name": "text", 
  "description": "text", 
  "hindiName": "text", 
  "astrologicalSignificance": "text" 
});
```

## Sample Data Structure

```javascript
// Example gem document
{
  "_id": ObjectId("..."),
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
  "discount": 10,
  "discountType": "percentage",
  "sizeWeight": 5,
  "sizeUnit": "carat",
  "images": ["https://example.com/emerald1.jpg"],
  "uploadedImages": [],
  "allImages": ["https://example.com/emerald1.jpg"],
  "stock": 10,
  "availability": true,
  "certification": "Govt. Lab Certified",
  "origin": "Sri Lanka",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

This schema structure provides a comprehensive foundation for implementing the enhanced gemstone data model in your backend system. The structure supports all the astrological and cultural information while maintaining flexibility for future enhancements.






