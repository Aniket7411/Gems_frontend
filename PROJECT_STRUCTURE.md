# Jewel Frontend - Project Structure

This React application provides a complete authentication system with a modern, responsive UI built using Tailwind CSS.

## Project Structure

```
src/
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── Login.js            # User login form
│   │   ├── Register.js         # User registration form
│   │   ├── ForgotPassword.js   # Forgot password form
│   │   ├── ResetPassword.js    # Password reset form
│   │   └── VerifyEmail.js      # Email verification page
│   └── layout/                 # Layout components
│       ├── Header.js           # Main header component
│       ├── Footer.js           # Footer component
│       └── AuthLayout.js       # Layout for auth pages
├── pages/                      # Main pages
│   ├── Home.js                 # Landing page
│   └── Dashboard.js            # User dashboard
├── services/                   # API services
│   └── api.js                  # API integration functions
├── App.js                      # Main app component with routing
├── App.css                     # App styles
├── index.js                    # App entry point
└── index.css                   # Global styles with Tailwind
```

## Features Implemented

### Authentication System
- **User Registration**: Complete registration form with validation
- **User Login**: Secure login with JWT token storage
- **Password Reset**: Forgot password and reset functionality
- **Email Verification**: Email verification system
- **Protected Routes**: Route protection based on authentication status

### UI/UX Features
- **Responsive Design**: Mobile-first responsive design using Tailwind CSS
- **Modern UI**: Clean, professional interface with consistent styling
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Loading indicators for better user experience
- **Success/Error Messages**: Clear feedback for user actions

### API Integration
- **RESTful API**: Complete integration with the backend API
- **Error Handling**: Comprehensive error handling for API calls
- **Token Management**: Automatic JWT token storage and management
- **Request Interceptors**: Automatic token attachment to requests

## Available Routes

- `/` - Home page (public)
- `/login` - Login page (public, redirects if authenticated)
- `/register` - Registration page (public, redirects if authenticated)
- `/forgot-password` - Forgot password page (public)
- `/reset-password/:token` - Password reset page (public)
- `/verify-email/:token` - Email verification page (public)
- `/dashboard` - User dashboard (protected, requires authentication)

## API Endpoints Used

The application integrates with the following backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/health` - Health check

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Environment Setup

Make sure your backend server is running on `http://localhost:5000` as specified in the API documentation.

## Key Components

### Authentication Flow
1. User registers → receives verification email
2. User verifies email → can login
3. User logs in → redirected to dashboard
4. User can reset password if needed

### Route Protection
- **Public Routes**: Redirect authenticated users to dashboard
- **Protected Routes**: Redirect unauthenticated users to login
- **Token Management**: Automatic token validation and storage

### Form Validation
- **Client-side validation**: Real-time form validation
- **Server-side integration**: API error handling and display
- **User feedback**: Clear success and error messages

## Styling

The application uses Tailwind CSS for styling with:
- Consistent color scheme (indigo primary, gray neutrals)
- Responsive breakpoints
- Modern component styling
- Accessibility considerations

## Future Enhancements

- User profile management
- Advanced dashboard features
- Real-time notifications
- Enhanced security features
- Mobile app integration


