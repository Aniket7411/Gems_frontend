import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { authAPI } from '../services/api';
import GemCards from '../components/gemcard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
    const isAuthenticated = authAPI.isAuthenticated();
    const user = authAPI.getCurrentUser();
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    // Hero carousel data
    const heroSlides = [
        {
            id: 1,
            title: "Discover Exquisite Gems",
            subtitle: "Handpicked, certified gemstones that bring timeless elegance and lasting value",
            image: "images/gemtop.jpeg",
            gem: "💎",
            color: "from-emerald-600 to-teal-700"
        },
        {
            id: 2,
            title: "Premium Ruby Collection",
            subtitle: "Experience the pinnacle of luxury with rare, investment-worthy rubies",
            image: "gemimages/ruby.webp",
            gem: "🔴",
            color: "from-red-600 to-pink-700"
        },
        {
            id: 3,
            title: "Elegant Emerald Stones",
            subtitle: "Adorned by royalty, these emeralds whisper legacy, prestige, and timeless power",
            image: "gemimages/emrald.webp",
            gem: "💚",
            color: "from-green-600 to-emerald-700"
        },
        {
            id: 4,
            title: "Mystical Blue Sapphires",
            subtitle: "The most powerful and fastest-acting gemstone in Vedic astrology",
            image: "gemimages/bluesapphire.webp",
            gem: "💙",
            color: "from-blue-600 to-indigo-700"
        }
    ];

    // Testimonials data
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Jewelry Collector",
            content: "The quality and authenticity of gems here is unmatched. My emerald ring has brought incredible positive energy to my life.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 2,
            name: "Rajesh Kumar",
            role: "Business Owner",
            content: "Since wearing the yellow sapphire, my business has seen remarkable growth. Highly recommended for anyone seeking prosperity.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 3,
            name: "Priya Sharma",
            role: "Fashion Designer",
            content: "The pearl necklace I purchased here has become my signature piece. The elegance and quality are simply divine.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        }
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Carousel Section */}
            <section className="relative h-screen">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className="h-full"
                >
                    {heroSlides.map((slide, index) => (
                        <SwiperSlide key={slide.id}>
                            <div className="relative h-screen w-full">
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url('${slide.image}')` }}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80`} />

                                <motion.div
                                    className="relative z-10 h-full flex items-center justify-center text-center px-4"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                >
                                    <div className="max-w-4xl mx-auto">
                                        <motion.div
                                            className="text-8xl mb-6"
                                            animate={{
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 3
                                            }}
                                        >
                                            {slide.gem}
                                        </motion.div>
                                        <motion.h1
                                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                        >
                                            {slide.title}
                                        </motion.h1>
                                        <motion.p
                                            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.5 }}
                                        >
                                            {slide.subtitle}
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.7 }}
                                        >
                                            <Link
                                                to="/register"
                                                className="inline-block px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                            >
                                                Explore Collection
                                            </Link>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Gem Cards Section */}
            <GemCards />

            {/* Features Section */}
            <motion.section
                className="py-20 bg-gradient-to-br from-gray-50 to-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose Our Gems?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We offer the finest collection of authentic, certified gemstones with unmatched quality and spiritual significance.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: "🔍",
                                title: "100% Authentic",
                                description: "Every gemstone is certified and verified for authenticity by expert gemologists."
                            },
                            {
                                icon: "✨",
                                title: "Premium Quality",
                                description: "Handpicked from the finest sources worldwide, ensuring exceptional quality and beauty."
                            },
                            {
                                icon: "🛡️",
                                title: "Secure Delivery",
                                description: "Insured and secure shipping with tracking to ensure your precious gems arrive safely."
                            },
                            {
                                icon: "📜",
                                title: "Certification",
                                description: "Complete documentation and certification for every gemstone you purchase."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Testimonials Section */}
            <motion.section
                className="py-20 bg-gradient-to-r from-emerald-600 to-teal-700"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            What Our Customers Say
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Join thousands of satisfied customers who have experienced the power of authentic gemstones.
                        </p>
                    </motion.div>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            }
                        }}
                        className="pb-12"
                    >
                        {testimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id}>
                                <motion.div
                                    className="bg-white p-8 rounded-2xl shadow-lg h-full"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex items-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-xl">⭐</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                                    <div className="flex items-center">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-4 object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="py-20 bg-gradient-to-r from-gray-900 to-black text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Find Your Perfect Gem?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Discover the power and beauty of authentic gemstones. Start your journey with us today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isAuthenticated ? (
                                <Link
                                    to="/dashboard"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                                >
                                    Get Started
                                </Link>
                            )}
                            <Link
                                to="/login"
                                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;

