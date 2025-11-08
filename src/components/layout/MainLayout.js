import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    const [headerHeight, setHeaderHeight] = useState(64);
    const headerRef = useRef(null);

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);

        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

    return (
        <div className="min-h-screen flex flex-col" style={{ '--header-height': `${headerHeight}px` }}>
            <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <Header />
            </header>

            <main
                className="flex-1"
                style={{
                    paddingTop: `${headerHeight}px`
                }}
            >
                {children}
            </main>

            <footer className=" bottom-0 left-0 right-0 z-40  text-white">
                <Footer />
            </footer>
        </div>
    );
};

export default MainLayout;
