import { Link } from "react-router-dom";

const TopSection = () => {
    return (
        <div
            style={{
                backgroundImage: `url('images/gemtop.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "90vh",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "0 20px",
            }}
            className="lg:justify-center lg:items-start justify-end"
        >

            <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
                Aurelane
            </h1>
            <p style={{ 
                fontSize: "1.1rem", 
                marginTop: "8px", 
                marginBottom: "8px",
                fontWeight: "500",
                letterSpacing: "0.5px",
                opacity: "0.95"
            }}>
                India's fastest growing international gem exporter
            </p>
            <div
                style={{
                    width: "120px",
                    height: "4px",
                    background: "linear-gradient(90deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.8))",
                    borderRadius: "2px",
                    marginBottom: "10px",
                    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"
                }}
            ></div>
            <p style={{ maxWidth: "600px", fontSize: "1.2rem", marginTop: "10px" }}>
                Discover the timeless beauty of precious gemstones. At Aurelane, we bring you handpicked elegance, crafted to shine with sophistication and grace.
            </p>
            <Link to="/shop">
                <button className="text-emerald-700 hover:text-emerald-800 transition-colors"
                    style={{
                        marginTop: "20px",
                        padding: "12px 30px",
                        fontSize: "1rem",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    Explore Collection
                </button>

            </Link>
        </div>
    );
};

export default TopSection;
