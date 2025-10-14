import { Link } from "react-router-dom";

const TopSection = () => {
    return (
        <div
            style={{
                backgroundImage: `url('images/gemtop.jpeg')`,
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
            <p style={{ maxWidth: "600px", fontSize: "1.2rem", marginTop: "10px" }}>
                Discover the timeless beauty of precious gemstones. At Aurelane, we bring you handpicked elegance, crafted to shine with sophistication and grace.
            </p>
            <Link to="/shop">
                <button className="text-[green]"
                    style={{
                        marginTop: "20px",
                        padding: "12px 30px",
                        fontSize: "1rem",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Explore Collection
                </button>

            </Link>
        </div>
    );
};

export default TopSection;
