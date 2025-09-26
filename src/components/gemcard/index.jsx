import React, { useState } from "react";
import { motion } from "framer-motion";

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
    const [currentMobileSlide, setCurrentMobileSlide] = useState(0);

    return (
        <motion.section
            className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Explore Our Precious Gems
                    </h1>
                    <p className="text-xl text-white/80 max-w-3xl mx-auto">
                        Discover the mystical power and timeless beauty of authentic gemstones, each carefully selected for their spiritual significance and exceptional quality.
                    </p>
                </motion.div>

                {/* Desktop Grid View */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-8">
                    {gems.map((gem, index) => (
                        <motion.div
                            key={index}
                            className="group"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
                                <div className="relative p-8">
                                    <motion.div
                                        className="flex justify-center items-center mb-6"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={gem.image}
                                            alt={gem.name}
                                            className="h-40 w-auto object-contain drop-shadow-lg"
                                        />
                                    </motion.div>

                                    <h2 className="text-2xl font-bold text-white mb-4 text-center group-hover:text-purple-300 transition-colors">
                                        {gem.name}
                                    </h2>

                                    <p className="text-white/80 text-sm mb-6 leading-relaxed">
                                        {gem.description}
                                    </p>

                                    <div className="space-y-2 mb-6">
                                        {gem.benefits.map((benefit, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex items-center text-white/90 text-sm"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                            >
                                                <span className="text-purple-400 mr-2">✨</span>
                                                {benefit}
                                            </motion.div>
                                        ))}
                                    </div>

                                    <motion.button
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Discover Power
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile/Tablet Carousel View */}
                <div className="lg:hidden">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            }
                        }}
                        className="pb-12"
                    >
                        {gems.map((gem, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 p-6"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex justify-center items-center mb-4">
                                        <img
                                            src={gem.image}
                                            alt={gem.name}
                                            className="h-32 w-auto object-contain drop-shadow-lg"
                                        />
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 text-center">
                                        {gem.name}
                                    </h2>

                                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                                        {gem.description}
                                    </p>

                                    <div className="space-y-1 mb-4">
                                        {gem.benefits.slice(0, 3).map((benefit, i) => (
                                            <div key={i} className="flex items-center text-white/90 text-xs">
                                                <span className="text-purple-400 mr-2">✨</span>
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                                        Discover Power
                                    </button>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Call to Action */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <motion.button
                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View All Gems Collection
                    </motion.button>
                </motion.div>
            </div>
        </motion.section >
    );
};

export default GemCards;
