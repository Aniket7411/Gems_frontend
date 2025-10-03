import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { authAPI } from "../../services/api";
import { useCart } from "../../contexts/CartContext";

const dummyGems = [
  "Ruby",
  "Emerald",
  "Sapphire",
  "Diamond",
  "Amethyst",
  "Topaz",
  "Opal",
  "Garnet",
  "Pearl",
  "Aquamarine",
];

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authAPI.isAuthenticated();
  const user = authAPI.getCurrentUser();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = dummyGems.filter((gem) =>
        gem.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSelect = (gem) => {
    setSearchTerm(gem);
    setSuggestions([]);
    navigate(`/shop?query=${gem}`); // redirect to shop page with query
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 py-2 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-28 w-28  rounded-lg flex items-center justify-center">
                <img src="images/aurelane.png" alt="emrald" />
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
              to="/gemstones"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              Gemstones
            </Link>
            <Link
              to="/about"
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
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-emerald-600 font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-gem"
                  className="text-gray-600 hover:text-emerald-600 font-medium transition"
                >
                  Add Gem
                </Link>
              </>
            )}
          </nav>

          {/* Search bar */}
          <div className="relative hidden md:block w-64">
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

            {suggestions.length > 0 && (
              <ul className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                {suggestions.map((gem, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-emerald-600"
            >
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg p-4 space-y-3">
          <Link to="/" className="block text-gray-600 hover:text-emerald-600">
            Home
          </Link>
          <Link to="/shop" className="block text-gray-600 hover:text-emerald-600">
            Shop
          </Link>
          <Link
            to="/gemstones"
            className="block text-gray-600 hover:text-emerald-600"
          >
            Gemstones
          </Link>
          <Link
            to="/about"
            className="block text-gray-600 hover:text-emerald-600"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block text-gray-600 hover:text-emerald-600"
          >
            Contact
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="block text-gray-600 hover:text-emerald-600"
              >
                Dashboard
              </Link>
              <Link
                to="/add-gem"
                className="block text-gray-600 hover:text-emerald-600"
              >
                Add Gem
              </Link>
            </>
          )}

          {/* Mobile search */}
          <div className="relative">
            <div className="flex items-center border rounded-full px-3 py-1 bg-gray-50 mt-3">
              <CiSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search gems..."
                className="ml-2 bg-transparent outline-none w-full"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                {suggestions.map((gem, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSearchSelect(gem)}
                  >
                    {gem}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart and Auth links */}
          <div className="mt-4 space-y-3">
            {/* Cart Link */}
            <Link
              to="/cart"
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-emerald-600 p-2"
            >
              <FaShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block text-center text-gray-600 hover:text-emerald-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
