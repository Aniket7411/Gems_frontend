import React from "react";
import "./gemscarausel.css";

const gems = [
  { name: "Blue Topaz", src: "./gemimages/bluetopaz.png" },
  { name: "Carnelian", src: "./gemimages/carnelianstone.png" },
  { name: "Citrine", src: "./gemimages/citrinestone.png" },
  { name: "Peridot", src: "./gemimages/peridotstone.png" },
  { name: "Rose Quartz", src: "./gemimages/rosequartz.png" },
  { name: "Amethyst", src: "./gemimages/amethuststone.png" },
];

const GemsCarousel = () => {
  return (
    <div className="gems-carousel-container">
      <div className="gems-track">
        {gems.map((gem, index) => (
          <div key={index} className="gem-item">
            <img src={gem.src} alt={gem.name} />
            <p>{gem.name}</p>
          </div>
        ))}

        {/* Duplicate for infinite loop */}
        {gems.map((gem, index) => (
          <div key={index + "-copy"} className="gem-item">
            <img src={gem.src} alt={gem.name} />
            <p>{gem.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GemsCarousel;
