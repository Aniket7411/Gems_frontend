import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [showNotification, setShowNotification] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(64);
    const headerRef = useRef(null);

    useEffect(() => {
        // Measure header height
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);

        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

    useEffect(() => {
        // Show notification on home page if not previously dismissed
        if (isHomePage) {
            const wasDismissed = localStorage.getItem('storeNotificationDismissed');
            if (!wasDismissed) {
                // Small delay for smooth slide-in animation
                setTimeout(() => {
                    setShowNotification(true);
                }, 300);
            }
        } else {
            setShowNotification(false);
        }
    }, [isHomePage]);

    const handleDismissNotification = useCallback(() => {
        setShowNotification(false);
        localStorage.setItem('storeNotificationDismissed', 'true');
    }, []);

    useEffect(() => {
        // Add keyboard support (Escape key) to close notification
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && showNotification) {
                handleDismissNotification();
            }
        };

        if (showNotification) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showNotification, handleDismissNotification]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Fixed Header */}
            <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <Header />
            </header>

            {/* Slide-up Notification Bar */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ top: `${headerHeight}px` }}
                        className="fixed left-0 right-0 z-40 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-b border-amber-200 shadow-md cursor-pointer"
                        onClick={handleDismissNotification}
                    >
                        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm sm:text-base text-amber-800 font-medium">
                                        No physical stores available
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDismissNotification();
                                    }}
                                    className="flex-shrink-0 ml-4 p-1.5 rounded-full hover:bg-amber-100 transition-colors group"
                                    aria-label="Close notification"
                                >
                                    <svg className="w-5 h-5 text-amber-600 group-hover:text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main
                className="flex-1"
                style={{
                    paddingTop: showNotification
                        ? `${headerHeight + 56}px`
                        : `${headerHeight}px`
                }}
            >
                {children}
            </main>

            {/* Fixed Footer */}
            <footer className=" bottom-0 left-0 right-0 z-40  text-white">
                <Footer />
            </footer>
        </div>
    );
};

export default MainLayout;
