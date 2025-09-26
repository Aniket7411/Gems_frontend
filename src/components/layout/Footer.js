import React from 'react';

const Footer = () => {
    return (
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center mb-4">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">J</span>
                        </div>
                        <span className="ml-2 text-xl font-bold">Jewel</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                        Your trusted platform for jewelry management and authentication.
                    </p>
                    <p className="text-gray-400 text-xs">
                        © 2024 Jewel. All rights reserved.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/login" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Login
                            </a>
                        </li>
                        <li>
                            <a href="/register" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Register
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                        Support
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/help" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Help Center
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Privacy Policy
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;

