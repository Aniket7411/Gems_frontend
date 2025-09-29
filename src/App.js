import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddGem from './pages/AddGem';
import GemDetail from './pages/GemDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Gemstones from './pages/Gemstones';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './components/auth/VerifyEmail';

// Layout Components
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return authAPI.isAuthenticated() ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  return !authAPI.isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <MainLayout>
                  <Home />
                </MainLayout>
              } />
              <Route path="/gemstones" element={
                <MainLayout>
                  <Gemstones />
                </MainLayout>
              } />

              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Register />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <ForgotPassword />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <ResetPassword />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-email/:token"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <VerifyEmail />
                    </AuthLayout>
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-gem"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AddGem />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gem/:id"
                element={
                  <MainLayout>
                    <GemDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <MainLayout>
                    <Cart />
                  </MainLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <MainLayout>
                    <Checkout />
                  </MainLayout>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
