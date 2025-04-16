import React, { useState } from 'react';

const NewsletterAndTrust = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            // In a real application, you would call an API to handle the subscription
            setSubscribed(true);
            setEmail('');
            setTimeout(() => {
                setSubscribed(false);
            }, 3000);
        }
    };

    const trustBadges = [
        { id: 1, icon: "bi bi-shield-lock-fill", text: "Secure Payment" },
        { id: 2, icon: "bi bi-truck", text: "Fast Shipping" },
        { id: 3, icon: "bi bi-box-seam", text: "Quality Products" },
        { id: 4, icon: "bi bi-headset", text: "24/7 Support" }
    ];

    return (
        <>
            {/* Newsletter Section */}
            <section className="newsletter-section py-5">
                <div className="container">
                    <div className="newsletter-container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <h2 className="newsletter-title">Stay Updated</h2>
                                <p className="newsletter-subtitle">
                                    Subscribe to our newsletter for exclusive deals, new product announcements, and security tips.
                                </p>
                            </div>
                            <div className="col-lg-6">
                                <form onSubmit={handleSubmit} className="newsletter-form">
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="btn"
                                            disabled={subscribed}
                                        >
                                            {subscribed ? 'Subscribed!' : 'Subscribe'}
                                        </button>
                                    </div>
                                    <p className="newsletter-note">
                                        By subscribing, you agree to our Privacy Policy and consent to receive marketing emails.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges Section */}
            <section className="trust-badges py-4">
                <div className="container">
                    <div className="row">
                        {trustBadges.map((badge) => (
                            <div key={badge.id} className="col-6 col-md-3">
                                <div className="trust-badge">
                                    <i className={badge.icon}></i>
                                    <span>{badge.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
        /* Newsletter Styles */
        .newsletter-section {
          background-color: #f8f9fa;
          position: relative;
          overflow: hidden;
        }
        
        .newsletter-container {
          background: linear-gradient(135deg, #343a40 0%, #212529 100%);
          border-radius: 20px;
          padding: 3rem;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .newsletter-container:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #ff4d4d, #f9cb28);
        }
        
        .newsletter-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .newsletter-subtitle {
          font-size: 1rem;
          opacity: 0.8;
          margin-bottom: 0;
        }
        
        .newsletter-form {
          margin-top: 1rem;
        }
        
        .newsletter-form .input-group {
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .newsletter-form .form-control {
          border: none;
          padding: 1rem 1.5rem;
          font-size: 1rem;
        }
        
        .newsletter-form .btn {
          background: linear-gradient(90deg, #ff4d4d, #f9cb28);
          border: none;
          color: white;
          font-weight: 600;
          padding: 0 1.5rem;
          transition: all 0.3s ease;
        }
        
        .newsletter-form .btn:hover {
          opacity: 0.9;
        }
        
        .newsletter-form .btn:disabled {
          background: #28a745;
          opacity: 1;
        }
        
        .newsletter-note {
          font-size: 0.8rem;
          opacity: 0.6;
          margin-top: 0.75rem;
          text-align: center;
        }
        
        /* Trust Badges Styles */
        .trust-badges {
          background-color: white;
          border-bottom: 1px solid #e9ecef;
        }
        
        .trust-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          gap: 10px;
        }
        
        .trust-badge i {
          font-size: 1.5rem;
          color: #f9cb28;
        }
        
        .trust-badge span {
          font-weight: 600;
          color: #495057;
        }
        
        @media (max-width: 991.98px) {
          .newsletter-container {
            padding: 2rem;
          }
          
          .newsletter-title {
            font-size: 1.5rem;
          }
          
          .newsletter-subtitle {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
        </>
    );
};

export default NewsletterAndTrust;