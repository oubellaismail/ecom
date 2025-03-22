import { useState, useEffect } from "react";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    { src: "https://mdbcdn.b-cdn.net/img/new/slides/041.webp", alt: "Wild Landscape" },
    { src: "https://mdbcdn.b-cdn.net/img/new/slides/042.webp", alt: "Camera" },
    { src: "https://mdbcdn.b-cdn.net/img/new/slides/043.webp", alt: "Exotic Fruits" },
  ];

  // Auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg mt-6">
      <div className="relative flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img src={image.src} alt={image.alt} className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none" onClick={handlePrev}>
        &#10094;
      </button>
      <button className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none" onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
