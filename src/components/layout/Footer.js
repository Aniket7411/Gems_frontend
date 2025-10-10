import React from 'react';

const Footer = () => {
    return (
        <div className=" bg-[#fff] text-[#000] mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center mb-4">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                                <img src="/images/aurelane.png" alt="Aurelane Logo" />

                        </div>

                        <span className="ml-2 text-xl font-bold">Aurelane</span>
                    </div>
                    <p className=" text-sm mb-4">
                        Your trusted platform for jewelry management and authentication.
                    </p>
                    <p className=" text-xs">
                        © 2025 Aurelane. All rights reserved.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-sm font-semibold  uppercase tracking-wider mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/" className=" hover:text-white text-sm transition-colors duration-200">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/login" className=" hover:text-white text-sm transition-colors duration-200">
                                Login
                            </a>
                        </li>
                        <li>
                            <a href="/register" className=" hover:text-white text-sm transition-colors duration-200">
                                Register
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-sm font-semibold  uppercase tracking-wider mb-4">
                        Support
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/aboutus" className=" hover:text-white text-sm transition-colors duration-200">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className=" hover:text-white text-sm transition-colors duration-200">
                                Contact Us
                            </a>
                        </li>
                            {/* <li>
                                <a href="/privacy" className=" hover:text-white text-sm transition-colors duration-200">
                                    Privacy Policy
                                </a>
                            </li> */}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;

