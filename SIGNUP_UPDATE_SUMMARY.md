# ✅ Signup Page Updated with Buyer/Seller Role Selection

## What Was Changed

Your **Register/Signup** page (`src/components/auth/Register.js`) has been updated to include role selection.

## Changes Made

### 1. Added Role Field to Form Data
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'buyer', // Default to buyer
});
```

### 2. Added Role Selection UI
- **Location**: After email field, before password
- **Type**: Dropdown/Select menu
- **Options**:
  - **Buyer (Customer)**: For users who want to browse and purchase gems
  - **Seller (Gem Provider)**: For users who want to list and sell gems

### 3. Dynamic Helper Text
Shows context-aware message based on selected role:
- **Buyer**: "Browse and purchase gems from our collection"
- **Seller**: "List and sell your gems on our platform"

## API Request Format

When user submits the signup form, it now sends:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer"  // or "seller"
}
```

**Endpoint**: `POST /auth/signup`

## User Experience

1. User fills in their name
2. User enters their email
3. **User selects their role** (Buyer or Seller) ⬅️ NEW
4. User creates a password
5. User confirms password
6. User clicks "Create account"

## How It Looks

```
┌─────────────────────────────────────────┐
│  Full Name                              │
│  [Enter your full name              ]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Email address                          │
│  [Enter your email                  ]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  I want to register as                  │
│  [▼ Buyer (Customer)            ]      │
│  Browse and purchase gems from our      │
│  collection                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Password                               │
│  [Enter your password            👁]   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Confirm Password                       │
│  [Confirm your password          👁]   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         [Create account]                │
└─────────────────────────────────────────┘
```

## Backend Requirements

Your backend should:

1. **Accept the `role` field** in the signup request body
2. **Validate the role** (must be "buyer" or "seller")
3. **Store the role** in the User document
4. **Use the role** for authorization:
   - **Buyers**: Can browse gems, add to cart, place orders
   - **Sellers**: Can add/edit/delete their own gems, view orders for their gems

## Example Backend User Schema

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: String (enum: ['buyer', 'seller'], default: 'buyer'),
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

1. **Test as Buyer**:
   - Select "Buyer (Customer)"
   - Complete registration
   - Should be able to browse and purchase gems
   - Should NOT see "Add Gem" functionality

2. **Test as Seller**:
   - Select "Seller (Gem Provider)"
   - Complete registration
   - Should see "Add Gem" functionality
   - Should be able to list gems for sale

## What's Next

Your backend developer should:
1. ✅ Accept `role` field in signup endpoint
2. ✅ Store role in user document
3. ✅ Implement role-based access control:
   - Protect `/gems POST` endpoint (sellers only)
   - Allow all users to GET gems (public)
   - Protect cart/orders endpoints (buyers only)

## Complete Documentation

See **BACKEND_DEVELOPER_COMPLETE_GUIDE.md** for:
- All API endpoints
- Complete authentication flow
- Role-based authorization
- Database schemas
- Full implementation code

---

🎉 **Your signup page is now ready with buyer/seller role selection!**

