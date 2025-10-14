import React from "react";

const rings = [
    { name: "Blue Sapphire", src: "./ringimages/bluesaffire.jpg" },
    { name: "Hessonite", src: "./ringimages/hessonite.jpg" },
    { name: "Natural Diamond", src: "./ringimages/naturaldimond.jpg" },
    { name: "Natural Alexandrite", src: "./ringimages/naturalexandrite.jpg" },
    { name: "Natural Fire Opal", src: "./ringimages/naturalfire.jpg" },
    { name: "Natural Pearl", src: "./ringimages/naturalpearl.jpg" },
    { name: "Natural Zircon", src: "./ringimages/naturalzircon.jpg" },
    { name: "Pitambari", src: "./ringimages/pitambari.jpg" },
    { name: "Red Coral", src: "./ringimages/redcoral.jpg" },
    { name: "Ruby Manik", src: "./ringimages/rubymanik.jpg" },
    { name: "Turquoise", src: "./ringimages/turquoise.jpg" },
    { name: "White Sapphire", src: "./ringimages/whitesaffire.jpg" },
    { name: "Yellow Sapphire", src: "./ringimages/yellowsaffire.jpg" },
];

const RingSection = () => {
    return (
        <div 
        
        
        className="bg-gradient-to-t from-green-400 via-green-50 to-blue-200  py-10 px-2">
            <h2 className="text-3xl font-bold text-center text-[#000] mb-4">
                Create Your Dream Jewelry
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
                {rings.map((ring, index) => (
                    <div
                        key={index}
                        className="w-[45%] sm:w-1/3 md:w-1/4 lg:w-1/5 flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                    >
                        <img
                            src={ring.src}
                            alt={ring.name}
                            className="w-40 h-40 object-cover rounded-md"
                        />
                        <p className="mt-3 font-medium text-gray-700 text-center">{ring.name}</p>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default RingSection;
