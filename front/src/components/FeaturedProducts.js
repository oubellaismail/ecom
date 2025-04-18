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
        <div className="spinner-border" role="status" style={{ color: '#ff4d4d' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ fontWeight: '500' }}>Loading featured products...</p>
      </div>
    );
  }

  return (
    <section className="py-5" style={{ background: 'rgba(249, 249, 249, 0.5)' }}>
      <Container>
        <h2 className="text-center mb-5" style={{
          fontWeight: '700',
          background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Featured Products
        </h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show"
            style={{ borderRadius: '12px', border: 'none', background: 'rgba(255, 77, 77, 0.1)' }}
            role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {products.length === 0 && !error && (
          <div className="alert alert-info"
            style={{ borderRadius: '12px', border: 'none', background: 'rgba(0, 123, 255, 0.1)' }}
            role="alert">
            No featured products available at the moment.
          </div>
        )}

        {products.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
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
              padding: '20px 0',
              '--swiper-navigation-color': '#ff4d4d',
              '--swiper-pagination-color': '#ff4d4d',
            }}
          >
            {products.map(product => (
              <SwiperSlide key={product.id}>
                <div className="p-2">
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProducts;