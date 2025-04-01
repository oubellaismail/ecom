import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: '/images/1.jpg',
      title: 'Summer Collection 2025',
      subtitle: 'Discover the latest trends and styles',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      position: 'left'
    },
    {
      id: 2,
      image: '/images/2.jpg',
      title: 'Special Discounts',
      subtitle: 'Up to 50% off on selected items',
      buttonText: 'View Offers',
      buttonLink: '/sale',
      position: 'center'
    },
    {
      id: 3,
      image: '/images/3.jpg',
      title: 'New Arrivals',
      subtitle: 'Be the first to wear our newest collections',
      buttonText: 'Explore',
      buttonLink: '/new',
      position: 'right'
    },
    {
      id: 4,
      image: '/images/4.jpg',
      title: 'New Arrivals',
      subtitle: 'Be the first to wear our newest collections',
      buttonText: 'Explore',
      buttonLink: '/new',
      position: 'center'
    },
    {
      id: 5,
      image: '/images/5.jpg',
      title: 'New Arrivals',
      subtitle: 'Be the first to wear our newest collections',
      buttonText: 'Explore',
      buttonLink: '/new',
      position: 'left'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrevSlide = () => {
    setActiveIndex(activeIndex === 0 ? slides.length - 1 : activeIndex - 1);
  };

  const goToNextSlide = () => {
    setActiveIndex(activeIndex === slides.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
            <img 
              src={slide.image} 
              className="d-block w-100" 
              alt={slide.title}
              style={{ objectFit: 'cover', height: '70vh' }}
            />
            <div className={`carousel-caption d-none d-md-block text-${slide.position}`} style={{
              bottom: 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
              maxWidth: '500px',
              left: slide.position === 'left' ? '10%' : slide.position === 'right' ? 'auto' : '50%',
              right: slide.position === 'right' ? '10%' : 'auto',
              marginLeft: slide.position === 'center' ? '-250px' : '0',
              textAlign: slide.position
            }}>
              <h1 style={{
                fontWeight: '800',
                fontSize: '3rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>{slide.title}</h1>
              <p className="mb-4" style={{
                fontSize: '1.2rem',
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
              }}>{slide.subtitle}</p>
              <Link to={slide.buttonLink} className="btn btn-lg" style={{
                background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                color: 'white',
                fontWeight: '500',
                padding: '0.75rem 2rem',
                borderRadius: '25px',
                boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
              }}>
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-control-prev" type="button" onClick={goToPrevSlide}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      
      <button className="carousel-control-next" type="button" onClick={goToNextSlide}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
      
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={index === activeIndex ? 'active' : ''}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: index === activeIndex ? 'linear-gradient(90deg, #ff4d4d, #f9cb28)' : 'rgba(255,255,255,0.5)',
              border: 'none'
            }}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;