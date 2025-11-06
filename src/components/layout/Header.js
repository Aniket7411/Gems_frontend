import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { authAPI, gemAPI } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authAPI.isAuthenticated();
  const user = authAPI.getCurrentUser();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  // Fetch gem suggestions from API
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() && value.length >= 2) {
      setIsSearching(true);
      try {
        const response = await gemAPI.getGems({ search: value, limit: 5 });
        if (response.success) {
          const gems = response.data?.gems || response.gems || [];
          const gemNames = gems.map(gem => gem.name);
          setSuggestions(gemNames);
        }
      } catch (error) {
        console.error('Error fetching gem suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSelect = (gem) => {
    setSearchTerm(gem);
    setSuggestions([]);
    setMobileMenuOpen(false);
    navigate(`/shop?query=${encodeURIComponent(gem)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSuggestions([]);
      setMobileMenuOpen(false);
      navigate(`/shop?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 py-2 sm:px-6 lg:px-6">
        {/* Mobile Header - Logo and Search Bar */}
        <div className="md:hidden mb-2">
          <div className="flex items-center gap-2">
            {/* Logo - smaller on mobile */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="h-20 w-20 rounded-lg flex items-center justify-center">
                  <img src="/images/aurelane.png" alt="Aurelane Logo" className="h-full w-full object-contain" />
                </div>
              </Link>
            </div>

            {/* Mobile Search Bar */}
            <div className="flex-1 relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center border-2 border-gray-300 rounded-full px-3 py-2 bg-gray-50 hover:border-emerald-400 focus-within:border-emerald-600 transition-colors">
                  <CiSearch className="text-gray-500 text-lg flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search gems..."
                    className="ml-2 bg-transparent outline-none w-full text-sm"
                  />
                </div>
              </form>

              {suggestions.length > 0 && (
                <ul className="absolute mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                  {isSearching && <li className="px-4 py-3 text-gray-500 text-sm text-center">Searching...</li>}
                  {suggestions.map((gem, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-3 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSearchSelect(gem)}
                    >
                      <div className="flex items-center">
                        <CiSearch className="text-gray-400 mr-2" />
                        <span className="font-medium">{gem}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Cart and Menu Icons */}
            <div className="flex items-center space-x-2">
              <Link to="/cart" className="relative text-gray-600 hover:text-emerald-600 p-1">
                <FaShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated && (
                <Link
                  to={
                    user?.role === "admin" ? "/admin/sellers" :
                      user?.role === "seller" ? "/seller-dashboard" :
                        "/my-orders"
                  }
                  className="text-gray-600 hover:text-emerald-600 p-1"
                  title="My Account"
                >
                  <CgProfile size={26} />
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-emerald-600 p-1"
              >
                {mobileMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-28 w-28  rounded-lg flex items-center justify-center">
                <img src="/images/aurelane.png" alt="Aurelane Logo" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {/* <Link
              to="/"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              Home
            </Link> */}
            <Link
              to="/shop"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              Shop
            </Link>

            <Link
              to="/aboutus"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              About
            </Link>
            {/* <Link
              to="/contact"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              Contact
            </Link> */}
            <Link
              to="/gemstones"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              Gallery
            </Link>
            {isAuthenticated && (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="text-gray-600 hover:text-emerald-600 font-medium transition"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === "seller" && (
                  <>
                    <Link
                      to="/seller-dashboard"
                      className="text-gray-600 hover:text-emerald-600 font-medium transition"
                    >
                      Seller Dashboard
                    </Link>
                    <Link
                      to="/add-gem"
                      className="text-gray-600 hover:text-emerald-600 font-medium transition"
                    >
                      Add Gem
                    </Link>
                  </>
                )}
                {(user?.role === "buyer" || !user?.role) && (
                  <Link
                    to="/my-orders"
                    className="text-gray-600 hover:text-emerald-600 font-medium transition"
                  >
                    My Orders
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Search bar */}
          <div className="relative hidden md:block w-64">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center border rounded-full px-3 py-1 bg-gray-50">
                <CiSearch className="text-gray-500 text-lg" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search gems..."
                  className="ml-2 bg-transparent outline-none w-full"
                />
              </div>
            </form>

            {suggestions.length > 0 && (
              <ul className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                {isSearching && <li className="px-4 py-2 text-gray-500 text-sm">Searching...</li>}
                {suggestions.map((gem, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSearchSelect(gem)}
                  >
                    {gem}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart and User menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <FaShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>




            <Link
              to={
                user?.role === "admin"
                  ? "/admin-dashboard"
                  : user?.role === "seller"
                    ? "/seller-dashboard"
                    : "/user-detail"
              }
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
              title={user?.role === "admin" ? "Admin Dashboard" : user?.role === "seller" ? "Seller Dashboard" : "My Profile"}
            >
              <CgProfile size={24} />
            </Link>



            {isAuthenticated ? (
              <div className="flex items-center space-x-4">

                <span className="text-sm text-gray-700">
                  Welcome, {user?.name || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-emerald-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="p-4 space-y-3">
            {/* User Info Section - Only if authenticated */}
            {isAuthenticated && (
              <div className="pb-3 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50 -mx-4 px-4 py-3 mb-3">
                <p className="font-semibold text-gray-900 text-sm">👋 {user?.name || "User"}</p>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-emerald-600 text-white text-xs rounded-full font-medium capitalize">
                  {user?.role || "Buyer"}
                </span>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase px-2 mb-3">📍 Navigate</p>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors font-medium"
              >
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </Link>

              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors font-medium"
              >
                <span className="text-lg">💎</span>
                <span>Shop Gems</span>
              </Link>

              <Link
                to="/gemstones"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors font-medium"
              >
                <span className="text-lg">🖼️</span>
                <span>Gallery</span>
              </Link>

              <Link
                to="/aboutus"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors font-medium"
              >
                <span className="text-lg">ℹ️</span>
                <span>About Us</span>
              </Link>
            </div>

            {/* Role-Specific Quick Actions */}
            {isAuthenticated && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase px-2 mb-3">
                  {user?.role === "admin" ? "⚙️ Admin Tools" :
                    user?.role === "seller" ? "🏪 My Business" :
                      "👤 My Account"}
                </p>

                {user?.role === "admin" ? (
                  <>
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">📊</span>
                      <span>Admin Dashboard</span>
                    </Link>
                  </>
                ) : user?.role === "seller" ? (
                  <>
                    <Link
                      to="/seller-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">📊</span>
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      to="/seller-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">📦</span>
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/add-gem"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">➕</span>
                      <span>Add New Gem</span>
                    </Link>
                    <Link
                      to="/seller-detail"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">✏️</span>
                      <span>Edit Profile</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/my-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">📦</span>
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">❤️</span>
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      to="/user-detail"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      <span className="text-lg">👤</span>
                      <span>My Profile</span>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Auth Section */}
            <div className="pt-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-center text-sm text-gray-500 mb-3">
                    Logged in as <span className="font-semibold text-emerald-600">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg w-full text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
