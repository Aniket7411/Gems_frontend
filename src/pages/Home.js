import React from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import GemCards from '../components/gemcard';

const Home = () => {
    const isAuthenticated = authAPI.isAuthenticated();
    const user = authAPI.getCurrentUser();

    return (
        <div>
            <div
                className="relative w-full h-72  bg-cover bg-center bg-no-repeat flex items-center justify-start text-center px-4"
                style={{ backgroundImage: "url('images/gemtop.jpeg')" }}
            >
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Content */}
                <div className="relative z-10 text-white max-w-2xl">
                    <h1 className="text-2xl md:text-4xl font-bold mb-4">
                        Discover Exquisite Gems
                    </h1>
                    <p className="text-sm md:text-lg mb-6">
                        Handpicked, certified gemstones that bring timeless elegance and lasting value.
                    </p>
                    <button className="px-6 py-2 bg-[#00A3A1] hover:bg-[#0a8f8d] text-white font-semibold rounded-lg transition duration-300">
                        Shop Now
                    </button>
                </div>
            </div>

            <GemCards />

            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Welcome to</span>{' '}
                                    <span className="block text-emerald-600 xl:inline">Jewel</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Your trusted platform for jewelry management and authentication.
                                    Secure, reliable, and easy to use.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        {isAuthenticated ? (
                                            <Link
                                                to="/dashboard"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10"
                                            >
                                                Go to Dashboard
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/register"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10"
                                            >
                                                Get started
                                            </Link>
                                        )}
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link
                                            to="/login"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="h-56 w-full bg-emerald-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="h-32 w-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-6xl font-bold">💎</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Jewel Platform</h2>
                            <p className="text-indigo-100">Secure & Reliable</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-emerald-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to manage your jewelry
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Our platform provides comprehensive tools for jewelry authentication, management, and security.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Authentication</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Advanced security features to protect your account and data.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Data Protection</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Your personal information is encrypted and protected with industry-standard security.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Fast & Reliable</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Lightning-fast performance with 99.9% uptime guarantee.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                                    </svg>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Easy to Use</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Intuitive interface designed for both beginners and professionals.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div >
    );
};

export default Home;

