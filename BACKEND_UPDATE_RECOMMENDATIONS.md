# Backend Update Recommendations for Gem Category/Name Issue

## Issue Identified
There's confusion between `name` and `category` fields when adding gems:
- Frontend sends `name` (which contains category values like "Emerald", "Ruby", etc.)
- Frontend now also sends `category` (automatically set to same as name)
- Backend should ensure both fields are properly handled

## Recommended Backend Changes

### 1. Update Gem Creation Endpoint (`POST /gems`)

**Current Issue:**
- If `category` is not provided, it might be undefined
- `name` field contains category values

**Recommended Fix:**
```javascript
// In your gem creation controller (e.g., gemsController.js or gemRoutes.js)

// When creating a new gem:
const gemData = {
    name: req.body.name,
    category: req.body.category || req.body.name, // Use category if provided, otherwise use name
    // ... other fields
};

// Or add middleware to normalize:
const normalizeGemData = (req, res, next) => {
    if (req.body.name && !req.body.category) {
        req.body.category = req.body.name;
    }
    next();
};

// Apply middleware to gem creation route
router.post('/gems', normalizeGemData, createGem);
```

### 2. Update Gem Schema Validation

**Recommended:**
```javascript
// In your gem schema/model (e.g., Gem.js or gemModel.js)

const gemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Gem name is required'],
        trim: true,
        maxlength: [255, 'Name cannot be more than 255 characters']
    },
    category: {
        type: String,
        trim: true,
        maxlength: [100, 'Category cannot be more than 100 characters'],
        // Set default to name if not provided
        default: function() {
            return this.name;
        }
    },
    // ... rest of schema
}, {
    timestamps: true
});

// Pre-save hook to ensure category is set
gemSchema.pre('save', function(next) {
    if (!this.category && this.name) {
        this.category = this.name;
    }
    next();
});
```

### 3. Update Gem Update Endpoint (`PUT /gems/:id`)

**Recommended:**
```javascript
// In your gem update controller

const updateGem = async (req, res) => {
    try {
        const { name, category, ...otherFields } = req.body;
        
        // Ensure category is set if name is updated
        const updateData = {
            ...otherFields
        };
        
        if (name) {
            updateData.name = name;
            // If category not provided, set it to name
            updateData.category = category || name;
        } else if (category) {
            updateData.category = category;
        }
        
        const gem = await Gem.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        // ... rest of update logic
    } catch (error) {
        // ... error handling
    }
};
```

### 4. Update Related Products Query

**If you're using category for related products:**
```javascript
// In your getGemById controller

const getGemById = async (req, res) => {
    try {
        const gem = await Gem.findById(req.params.id)
            .populate('seller', 'fullName shopName email phone isVerified rating');
        
        if (!gem) {
            return res.status(404).json({ success: false, message: 'Gem not found' });
        }
        
        // Get related products based on category
        const relatedProducts = await Gem.find({
            _id: { $ne: gem._id },
            category: gem.category || gem.name, // Fallback to name if category not set
            availability: true
        })
        .select('name hindiName planet color price discount discountType heroImage images stock availability rating reviews seller createdAt')
        .limit(8)
        .populate('seller', 'fullName shopName isVerified rating');
        
        res.json({
            success: true,
            gem,
            relatedProducts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
```

## Summary

**Key Points:**
1. ✅ Frontend now sends both `name` and `category` fields
2. ✅ Backend should ensure `category` defaults to `name` if not provided
3. ✅ Add pre-save hook or middleware to normalize category
4. ✅ Update related products query to use category (with name fallback)
5. ✅ Ensure existing gems without category get category set to name

**Migration Script (if needed):**
```javascript
// One-time migration to set category for existing gems
const migrateGems = async () => {
    const gems = await Gem.find({ $or: [{ category: { $exists: false } }, { category: '' }] });
    
    for (const gem of gems) {
        gem.category = gem.name;
        await gem.save();
    }
    
    console.log(`Migrated ${gems.length} gems`);
};
```

## Testing Checklist

- [ ] Create gem with only name → category should be set automatically
- [ ] Create gem with both name and category → both should be saved
- [ ] Update gem name → category should update if not explicitly set
- [ ] Related products should show gems with same category
- [ ] Seller dashboard should display both name and category correctly

