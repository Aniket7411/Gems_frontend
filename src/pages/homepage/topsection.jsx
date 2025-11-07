import { Link } from "react-router-dom";

const TopSection = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center lg:justify-start lg:items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Video Background */}
            <video
                src="./images/bannervideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            ></video>
            
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40 z-1"></div>
            
            {/* Content */}
            <div className="relative z-10 text-center lg:text-left max-w-2xl text-white">
                <h1 
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                    style={{ 
                        textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
                    }}
                >
                    Aurelane
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl mb-4 font-medium tracking-wide opacity-95">
                    India's fastest growing international gem exporter
                </p>
                
                <div
                    className="w-32 h-1 mx-auto lg:mx-0 mb-6"
                    style={{
                        background: "linear-gradient(90deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))",
                        borderRadius: "2px",
                        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)"
                    }}
                ></div>
                
                <p className="text-base sm:text-lg lg:text-xl mb-6 max-w-xl leading-relaxed">
                    Discover the timeless beauty of precious gemstones. At Aurelane, we bring you 
                    handpicked elegance, crafted to shine with sophistication and grace.
                </p>

                {/* No Physical Stores Message */}
                <div className="mb-8 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20 max-w-md mx-auto lg:mx-0">
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg">🌐</span>
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-emerald-100">Exclusively Online</p>
                            <p className="text-sm text-gray-200 opacity-90">
                                Experience luxury from anywhere - no physical stores, just pure quality delivered to you
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <Link to="/shop">
                    <button 
                        className="text-emerald-700 hover:text-emerald-800 transition-all duration-300 transform hover:scale-105"
                        style={{
                            marginTop: "10px",
                            padding: "14px 36px",
                            fontSize: "1.1rem",
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                            backdropFilter: "blur(10px)"
                        }}
                    >
                        Explore Collection
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default TopSection;