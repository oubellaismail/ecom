import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import { Container } from 'react-bootstrap';

const CategoryCard = ({ category, products }) => {
  return (
    <div className="col-12 mb-5">
      <div className="category-section">
        <div className="category-header mb-4">
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map(product => {
            // Transform the product data to match the expected structure
            const transformedProduct = {
              id: product.id,
              name: product.name,
              price: product.price || 0,
              category: {
                name: category.name,
                slug: category.slug
              },
              // Use the image URL directly from the backend
              image: product.product_image || '/images/1.jpg',
              product_image: product.product_image,
              product_item: {
                price: product.price,
                qty_in_stock: product.qty_in_stock,
                product_image: product.product_image
              },
              qte_stock: product.qty_in_stock || 0,
              slug: product.slug
            };
            
            return (
              <div key={product.id} className="col">
                <ProductCard product={transformedProduct} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CategoriesShowcase = () => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRandomCategory = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get the token from localStorage
        const token = localStorage.getItem('access_token');
        console.log('Access Token:', token);
        
        if (!token) {
          setError('Please login to view categories');
          setLoading(false);
          return;
        }

        // Create axios instance with default headers
        const api = axios.create({
          baseURL: 'http://localhost:8000/api',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Fetching random category...');
        const response = await api.get('/categories/random');
        console.log('API Response:', response);
        
        if (response.data && response.data.data) {
          setCategory(response.data.data);
        } else {
          setError('No category data received');
        }
      } catch (error) {
        console.error('Category error:', error);
        setError('Error loading category. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomCategory();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status" style={{ color: '#ff4d4d' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ fontWeight: '500' }}>Loading category...</p>
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
          Categories
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
            style={{ borderRadius: '12px', border: 'none', background: 'rgba(255, 77, 77, 0.1)' }}
            role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <div className="row">
          {category && (
            <CategoryCard 
              category={category.category} 
              products={category.products} 
            />
          )}
        </div>
      </Container>
    </section>
  );
};

export default CategoriesShowcase;