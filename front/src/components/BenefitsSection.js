import React from 'react';

const BenefitsSection = () => {
    const benefits = [
        {
            id: 1,
            icon: "bi bi-shield-check",
            title: "Premium Quality",
            description: "All our products are carefully selected and rigorously tested to ensure durability and reliability in the field."
        },
        {
            id: 2,
            icon: "bi bi-truck",
            title: "Fast Shipping",
            description: "With nationwide distribution centers, we guarantee quick delivery of your essential security equipment."
        },
        {
            id: 3,
            icon: "bi bi-headset",
            title: "Expert Support",
            description: "Our team of security professionals is available to provide guidance on selecting the right equipment for your needs."
        },
        {
            id: 4,
            icon: "bi bi-arrow-repeat",
            title: "Easy Returns",
            description: "Not satisfied? Return your unused products within 30 days for a full refund or exchange."
        }
    ];

    return (
        <section className="benefits-section py-5">
            <div className="container">
                <div className="row mb-5">
                    <div className="col-lg-6 mx-auto text-center">
                        <h2 className="section-title">Why Choose Guardian Gear</h2>
                        <p className="section-subtitle">We're committed to providing the highest quality security equipment with exceptional service</p>
                    </div>
                </div>

                <div className="row">
                    {benefits.map(benefit => (
                        <div key={benefit.id} className="col-md-6 col-lg-3 mb-4">
                            <div className="benefit-card">
                                <div className="benefit-icon">
                                    <i className={benefit.icon}></i>
                                </div>
                                <h3 className="benefit-title">{benefit.title}</h3>
                                <p className="benefit-description">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-4">
                    <div className="col-12 text-center">
                        <button className="btn btn-outline-dark px-4 py-2" style={{
                            borderRadius: '25px',
                            fontWeight: '500'
                        }}>
                            Learn More About Us
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .benefits-section {
          background-color: #f8f9fa;
          position: relative;
          overflow: hidden;
        }
        
        .benefits-section:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: linear-gradient(90deg, #ff4d4d, #f9cb28);
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
        }
        
        .benefit-card {
          background: white;
          border-radius: 16px;
          padding: 2rem 1.5rem;
          height: 100%;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .benefit-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .benefit-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #ff4d4d1a, #f9cb281a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .benefit-icon i {
          font-size: 2rem;
          background: linear-gradient(90deg, #ff4d4d, #f9cb28);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .benefit-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .benefit-description {
          font-size: 0.9rem;
          color: #6c757d;
          line-height: 1.6;
        }
      `}</style>
        </section>
    );
};

export default BenefitsSection;