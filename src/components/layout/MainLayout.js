import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <Header />
            </header>

            {/* Main Content Area */}
            <main className="flex-1  pt-16 ">
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
