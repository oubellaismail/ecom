import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaTimesCircle, FaHome, FaRedo } from 'react-icons/fa';

const CheckoutFailed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const errorMessage = searchParams.get('error') || 'Payment processing failed';

    return (
        <section className="py-5 min-vh-100 d-flex align-items-center" style={{ 
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
                <Row className="justify-content-center w-100">
                    <Col md={8} lg={6} className="text-center">
                        <div className="error-animation mb-4" style={{
                            animation: 'scaleIn 0.5s ease-out'
                        }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(90deg, #ff4d4d, #ff6b6b)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                            }}>
                                <FaTimesCircle size={60} color="white" />
                            </div>
                        </div>
                        
                        <h1 className="display-4 mb-4 fw-bold" style={{ 
                            background: 'linear-gradient(90deg, #ff4d4d, #ff6b6b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.5px',
                            position: 'relative',
                            paddingBottom: '1rem'
                        }}>
                            Payment Failed
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '4px',
                                background: 'linear-gradient(90deg, #ff4d4d, #ff6b6b)',
                                borderRadius: '2px'
                            }}></div>
                        </h1>
                        
                        <p className="lead mb-5" style={{ 
                            color: '#6c757d',
                            fontSize: '1.25rem',
                            lineHeight: '1.6'
                        }}>
                            {errorMessage}
                        </p>

                        <div className="error-details p-5 mb-5" style={{ 
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <h3 className="mb-4" style={{ 
                                color: '#495057',
                                fontWeight: '600',
                                fontSize: '1.5rem'
                            }}>
                                What to do next?
                            </h3>
                            <p style={{ 
                                color: '#6c757d',
                                fontSize: '1.1rem',
                                lineHeight: '1.6'
                            }}>
                                Please try again or contact our support team if the problem persists.
                            </p>
                        </div>

                        <div className="action-buttons d-flex justify-content-center gap-3">
                            <Button 
                                variant="outline-danger" 
                                onClick={() => navigate('/')}
                                style={{ 
                                    padding: '8px 20px',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    fontSize: '0.95rem',
                                    borderColor: '#ff4d4d',
                                    color: '#ff4d4d',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.1)'
                                }}
                                className="hover-scale"
                            >
                                <FaHome className="me-2" />
                                Back to Home
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={() => navigate('/checkout')}
                                style={{ 
                                    padding: '8px 20px',
                                    borderRadius: '12px',
                                    fontWeight: '500',
                                    fontSize: '0.95rem',
                                    background: 'linear-gradient(90deg, #ff4d4d, #ff6b6b)',
                                    border: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                                }}
                                className="hover-scale"
                            >
                                <FaRedo className="me-2" />
                                Try Again
                            </Button>
                        </div>
                    </Col>
                </Row>

                <style>
                    {`
                        @keyframes scaleIn {
                            from {
                                transform: scale(0.8);
                                opacity: 0;
                            }
                            to {
                                transform: scale(1);
                                opacity: 1;
                            }
                        }
                        .hover-scale:hover {
                            transform: scale(1.05);
                            box-shadow: 0 6px 20px rgba(255, 77, 77, 0.2) !important;
                        }
                        .hover-scale {
                            transition: all 0.3s ease;
                        }
                    `}
                </style>
            </Container>
        </section>
    );
};

export default CheckoutFailed; 