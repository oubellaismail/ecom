import React, { useState, useEffect } from 'react';
import { productApi } from '../api/productService';
import ProductCard from './ProductCard';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await productApi.getProducts({ new_arrival: true });

        // Handle different response formats
        let data = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response.products) {
          data = response.products;
        } else if (response.data) {
          data = Array.isArray(response.data) ? response.data : [response.data];
        }

        // Transform the data to ensure it has the required fields
        const transformedProducts = data.map(product => ({
          id: product.id || product._id,
          name: product.name,
          price: product.price || product.product_item?.price,
          category: product.category || product.category_name || product.category_slug,
          image: product.image,
          product_image: product.product_image,
          product_item: product.product_item,
          qte_stock: product.qte_stock || product.qty_in_stock || product.product_item?.qty_in_stock,
          new_arrival: true,
          slug: product.slug
        }));

        setProducts(transformedProducts);
      } catch (error) {
        setError('Error loading new arrivals. Please try again.');
        console.error('New arrivals error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status" style={{ color: '#ff4d4d' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ fontWeight: '500' }}>Loading new arrivals...</p>
      </div>
    );
  }

  return (
    <section className="py-5" style={{ background: 'rgba(249, 249, 249, 0.5)' }}>
      <div className="container">
        <h2 className="text-center mb-5" style={{
          fontWeight: '700',
          background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          New Arrivals
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
            No new arrivals available at the moment.
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {products.map(product => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;