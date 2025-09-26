import React from "react";

// Data for gems
const gems = [
    {
        name: "Emerald Stone",
        image: "gemimages/emrald.webp",
        description:
            "Adorned by Elizabeth Taylor and Angelina Jolie, and coveted by Cleopatra, emeralds outshine diamonds in rarity and allure. This opulent gem whispers legacy, prestige, and timeless power crafted for the truly elite.",
        benefits: [
            "Growth in business",
            "Eloquence & Charisma",
            "Sharper Intellect & Memory",
            "Growth In Speculation",
        ],
    },
    {
        name: "Yellow Sapphire (Pukhraj)",
        image: "gemimages/yellowsapphire.webp",
        description:
            "Unlock prosperity and wisdom with Yellow Sapphire, the gemstone of Jupiter. Enhance intellect, boost financial stability, and attract positive energy. Wear the power of Pukhraj for growth and success.",
        benefits: [
            "Financial Growth",
            "Promotes Good Health",
            "Stability in domestic life",
            "Good for education",
        ],
    },
    {
        name: "Blue Sapphire (Neelam Stone)",
        image: "gemimages/bluesapphire.webp",
        description:
            "Blue Sapphire (Neelam Stone) is a precious, blue-coloured gemstone of the Corundum mineral family. Recognized as the most powerful and fastest-acting gemstone in Vedic astrology, Neelam Ratna brings instant wealth, fame, and success to the wearer’s life.",
        benefits: [
            "Alleviates Misfortune",
            "Supports Mental Health",
            "Increases Wisdom",
            "Success in business",
        ],
    },
    {
        name: "Ruby Stone (Manik Stone)",
        image: "gemimages/ruby.webp",
        description:
            "Experience the pinnacle of luxury with a rare, investment-worthy ruby symbolizes power, passion, and exclusivity. Own a timeless masterpiece treasured by royalty, designed to elevate your legacy forever.",
        benefits: [
            "Professional Success",
            "Boosts Financial Status",
            "Overall Good Health",
            "Better Paternal Relationships",
        ],
    },
    {
        name: "Pearl Stone (Moti)",
        image: "gemimages/pearl.webp",
        description:
            "Pearl also known as Moti, has adorned celebrities like Audrey Hepburn and Meghan Markle. This gemstone symbolizes purity, wisdom, and emotional balance, making it a sophisticated choice for those seeking classic beauty and spiritual harmony.",
        benefits: [
            "Better Maternal Relations",
            "Physical Healing",
            "Mental Strength",
            "Calmer Personality",
        ],
    },
    {
        name: "Red Coral (Moonga Stone)",
        image: "gemimages/redcoral.webp",
        description:
            "Red Coral (Moonga), also called “OX blood” in the trade, is a precious gemstone formed in the deep sea by marine creatures called coral polyps (Corallium rubrum). It is a popular astrological gemstone worn to ensure success in leadership roles, sports, business, and health.",
        benefits: [
            "Gives Courage",
            "Cures Blood Disorders",
            "Athletic Capabilities",
            "Overcoming Obstacles",
        ],
    },
    {
        name: "Gomed Stone (Hessonite)",
        image: "gemimages/hessonite.webp",
        description:
            "Hessonite (Gomed Stone) is a deep brown or honey-coloured, semi-precious gemstone from the grossular Garnet mineral family. It is worn to overcome the adverse effects of Rahu and gain power, wealth, and success in public careers, jobs, and businesses.",
        benefits: [
            "Sudden Gain",
            "Growth in politics",
            "Control Gastric problems",
            "Provides Spiritual Protection",
        ],
    },
];

const GemCards = () => {
    return (
        <div className="bg-[#c9d7e5] py-10 px-5 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-10 text-white">
                Explore Our Precious Gems
            </h1>

            <div className="flex flex-wrap justify-center gap-8">
                {gems.map((gem, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-2xl overflow-hidden w-80 flex flex-col hover:scale-105 transition-transform duration-300"
                    >
                        <div className="bg-white flex justify-center items-center p-4">
                            <img
                                src={gem.image}
                                alt={gem.name}
                                className="h-32 w-auto object-contain"
                            />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                                {gem.name}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4">{gem.description}</p>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                                {gem.benefits.map((benefit, i) => (
                                    <li key={i}>{benefit}</li>
                                ))}
                            </ul>
                            <button className="mt-5 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition">
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GemCards;
