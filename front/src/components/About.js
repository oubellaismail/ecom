import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="container py-5">
            {/* Hero Section */}
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold mb-3" style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    About Our E-Commerce Platform
                </h1>
                <p className="lead text-muted">Your Trusted Destination for Quality Products</p>
            </div>

            {/* Company Overview */}
            <div className="row mb-5">
                <div className="col-md-6">
                    <div className="p-4 rounded" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <h2 className="h3 mb-4" style={{
                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Our Story
                        </h2>
                        <p className="lead">
                            Founded with a vision to revolutionize online shopping, our platform brings together
                            quality products and exceptional customer service. We believe in making shopping
                            convenient, secure, and enjoyable for everyone.
                        </p>
                        <p>
                            Our journey began with a simple idea: to create a marketplace where customers can
                            find everything they need, from daily essentials to unique finds, all in one place.
                            Today, we're proud to serve thousands of satisfied customers worldwide.
                        </p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-4 rounded" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <h2 className="h3 mb-4" style={{
                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Our Mission
                        </h2>
                        <p className="lead">
                            To provide a seamless shopping experience while maintaining the highest standards
                            of quality and customer satisfaction.
                        </p>
                        <p>
                            We're committed to:
                        </p>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Offering high-quality products at competitive prices
                            </li>
                            <li className="mb-2">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Ensuring secure and convenient payment options
                            </li>
                            <li className="mb-2">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Providing excellent customer support
                            </li>
                            <li className="mb-2">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                Supporting local businesses and artisans
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="row mb-5">
                <div className="col-12 text-center mb-4">
                    <h2 className="h3" style={{
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Our Core Values
                    </h2>
                </div>
                <div className="col-md-4">
                    <div className="p-4 rounded text-center" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        height: '100%'
                    }}>
                        <div className="mb-3" style={{
                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            <i className="bi bi-shield-check display-4"></i>
                        </div>
                        <h3 className="h4 mb-3">Trust</h3>
                        <p>Building lasting relationships through transparency and reliability</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 rounded text-center" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        height: '100%'
                    }}>
                        <div className="mb-3" style={{
                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            <i className="bi bi-star display-4"></i>
                        </div>
                        <h3 className="h4 mb-3">Quality</h3>
                        <p>Delivering excellence in every product and service</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 rounded text-center" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        height: '100%'
                    }}>
                        <div className="mb-3" style={{
                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            <i className="bi bi-people display-4"></i>
                        </div>
                        <h3 className="h4 mb-3">Community</h3>
                        <p>Creating a vibrant community of satisfied customers</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-5">
                <Link to="/shop" className="btn btn-lg" style={{
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    fontWeight: '500',
                    padding: '0.75rem 2rem',
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)',
                    border: 'none'
                }}>
                    Start Shopping
                </Link>
            </div>
        </div>
    );
};

export default About; 