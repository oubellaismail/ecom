import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <div className="col">
      <Link to={category.link} className="text-decoration-none">
        <div className="category-card">
          <div className="category-img-container">
            <img src={category.image} alt={category.name} className="category-img" />
          </div>
          <div className="category-content">
            <h3 className="category-title">{category.name}</h3>
            <p className="category-description">{category.description}</p>
            <span className="category-link">Browse Products</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CategoriesShowcase = () => {
  const categories = [
    {
      id: 1,
      name: "Communication Equipment",
      description: "Two-way radios, walkie-talkies & accessories",
      image: "/images/a1.png",
      link: "/category/communication"
    },
    {
      id: 2,
      name: "Security Apparel",
      description: "Professional uniforms, tactical wear & safety gear",
      image: "/images/a1.png",
      link: "/category/apparel"
    },
    {
      id: 3,
      name: "Surveillance Tools",
      description: "Cameras, monitoring systems & detection devices",
      image: "/images/a1.png",
      link: "/category/surveillance"
    },
    {
      id: 4,
      name: "Tactical Equipment",
      description: "Lighting solutions, protective gear & field tools",
      image: "/images/a1.png",
      link: "/category/tactical"
    }
  ];

  return (
    <section className="categories-showcase py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="section-title">Shop By Category</h2>
            <p className="section-subtitle">Explore our extensive collection of security solutions</p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .categories-showcase {
          background-color: #ffffff;
        }
        
        .section-title {
          font-weight: 700;
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin-bottom: 2rem;
        }
        
        .category-card {
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          height: 100%;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        
        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .category-img-container {
          height: 180px;
          overflow: hidden;
        }
        
        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .category-card:hover .category-img {
          transform: scale(1.08);
        }
        
        .category-content {
          padding: 1.5rem;
          background: white;
        }
        
        .category-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .category-description {
          font-size: 0.9rem;
          color: #6c757d;
          margin-bottom: 1rem;
        }
        
        .category-link {
          color: #ff4d4d;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }
        
        .category-link:after {
          content: "→";
          margin-left: 0.5rem;
          transition: transform 0.3s ease;
        }
        
        .category-card:hover .category-link:after {
          transform: translateX(5px);
        }
      `}</style>
    </section>
  );
};

export default CategoriesShowcase;