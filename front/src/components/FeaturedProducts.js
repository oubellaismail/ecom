import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { productApi } from '../api/productService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await productApi.getProducts();
        console.log('API Response:', response);

        // Handle different response formats
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response.products) {
          data = response.products;
        } else if (response.data) {
          data = Array.isArray(response.data) ? response.data : [response.data];
        }

        // Get 8 random products
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 8);

        // Transform the data to ensure it has the required fields
        const transformedProducts = randomProducts.map(product => ({
          id: product.id || product._id,
          name: product.name,
          price: product.price || product.product_item?.price,
          category: product.category || product.category_name || product.category_slug,
          image: product.image,
          product_image: product.product_image,
          product_item: product.product_item,
          qte_stock: product.qte_stock || product.qty_in_stock || product.product_item?.qty_in_stock,
          new_arrival: product.new_arrival,
          slug: product.slug
        }));

        setProducts(transformedProducts);
      } catch (error) {
        setError('Error loading featured products. Please try again.');
        console.error('Featured products error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status" style={{ 
          color: '#ff4d4d',
          width: '3rem',
          height: '3rem',
          borderWidth: '0.3em'
        }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ 
          fontWeight: '500',
          color: '#ff4d4d',
          fontSize: '1.1rem'
        }}>Loading featured products...</p>
      </div>
    );
  }

  return (
    <section className="py-5" style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 77, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>
      
      <Container>
        <h2 className="text-center mb-5" style={{
          fontWeight: '800',
          fontSize: '2.5rem',
          background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',

          position: 'relative',
          paddingBottom: '1rem'
        }}>
          Featured Products
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
            borderRadius: '2px'
          }}></div>
        </h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show"
            style={{ 
              borderRadius: '12px',
              border: 'none',
              background: 'rgba(255, 77, 77, 0.1)',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {products.length === 0 && !error && (
          <div className="alert alert-info"
            style={{ 
              borderRadius: '12px',
              border: 'none',
              background: 'rgba(255, 77, 77, 0.1)',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            role="alert">
            No featured products available at the moment.
          </div>
        )}

        {products.length > 0 && (
          <div style={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active'
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                576: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 4,
                },
              }}
              style={{
                padding: '20px 0 40px',
                '--swiper-navigation-color': '#ff4d4d',
                '--swiper-pagination-color': '#ff4d4d',
                '--swiper-pagination-bullet-size': '10px',
                '--swiper-pagination-bullet-inactive-color': '#999',
                '--swiper-pagination-bullet-inactive-opacity': '0.5',
                '--swiper-pagination-bullet-horizontal-gap': '6px'
              }}
            >
              {products.map(product => (
                <SwiperSlide key={product.id}>
                  <div className="p-2" style={{
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
              
              {/* Custom Pagination */}
              <div className="swiper-pagination" style={{
                position: 'relative',
                bottom: '0',
                marginTop: '20px'
              }}></div>
            </Swiper>
            
            {/* Custom Navigation Arrows - Positioned outside the Swiper */}
            <div className="swiper-button-next" style={{
              background: 'rgba(255, 255, 255, 0.9)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              right: '-60px',
              '&:after': {
                fontSize: '24px',
                color: '#ff4d4d'
              }
            }}></div>
            <div className="swiper-button-prev" style={{
              background: 'rgba(255, 255, 255, 0.9)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              left: '-60px',
              '&:after': {
                fontSize: '24px',
                color: '#ff4d4d'
              }
            }}></div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProducts;