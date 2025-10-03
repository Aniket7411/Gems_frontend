# Backend Setup Instructions

## Quick Setup Guide

### 1. Install Dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

### 2. Create Environment File (.env)
Create a `.env` file in your backend root directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gems_db
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
NODE_ENV=development
```

### 3. File Structure
```
backend/
├── server.js (or app.js)
├── .env
├── models/
│   └── User.js
├── controllers/
│   └── authController.js
├── middleware/
│   └── auth.js
├── routes/
│   └── auth.js
└── package.json
```

### 4. Copy Code
Copy the code from `backend_auth_implementation.js` into the appropriate files.

### 5. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

### 6. Test the API
- Health Check: GET `http://localhost:5000/api/health`
- Signup: POST `http://localhost:5000/api/auth/signup`
- Login: POST `http://localhost:5000/api/auth/login`

## Important Notes

1. **JWT Secret Error Fix**: The error "secretOrPrivateKey must have a value" means your JWT_SECRET is not set in the .env file.

2. **Make sure MongoDB is running** before starting the server.

3. **The API matches exactly** with your frontend expectations from `newlogin.md`.

4. **Password hashing** is handled automatically with bcryptjs.

5. **CORS is enabled** for frontend communication.

## Frontend Integration

Your frontend is already updated to work with these endpoints:
- Uses `/api/auth/signup` for registration
- Uses `/api/auth/login` for login
- Automatically stores JWT tokens in localStorage
- Includes proper error handling

## Testing with Frontend

1. Start your backend server
2. Start your frontend React app
3. Try signing up with: name, email, password
4. Try logging in with: email, password
5. Check that tokens are stored and user is redirected to dashboard

That's it! Your authentication should work perfectly now.
