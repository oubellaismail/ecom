import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    
    const user = {
        name: 'John Doe',
    };
    
    // État pour contrôler l'affichage de toutes les commandes
    const [showAllOrders, setShowAllOrders] = useState(false);
    
    // Données factices pour les commandes récentes
    const stats = {
        recentSales: [
            { id: 1, customer: 'Alice Smith', date: '2025-04-05', amount: 125.99, status: 'completed' },
            { id: 2, customer: 'Bob Johnson', date: '2025-04-04', amount: 89.50, status: 'pending' },
            { id: 3, customer: 'Carol Davis', date: '2025-04-03', amount: 245.75, status: 'processing' },
            { id: 4, customer: 'David Wilson', date: '2025-04-02', amount: 67.25, status: 'completed' },
            { id: 5, customer: 'Eva Martinez', date: '2025-04-01', amount: 154.20, status: 'pending' },
            { id: 6, customer: 'Frank Brown', date: '2025-03-31', amount: 210.50, status: 'completed' },
            { id: 7, customer: 'Grace Lee', date: '2025-03-30', amount: 78.99, status: 'processing' },
            { id: 8, customer: 'Henry Taylor', date: '2025-03-29', amount: 322.75, status: 'completed' }
        ]
    };
    
    // Commandes à afficher - limitées ou toutes
    const displayedOrders = showAllOrders 
        ? stats.recentSales 
        : stats.recentSales.slice(0, 4);
    
    // Composant pour le badge de statut
    const StatusBadge = ({ status }) => {
        let badgeClass = 'badge ';
        
        switch(status) {
            case 'completed':
                badgeClass += 'bg-success';
                break;
            case 'pending':
                badgeClass += 'bg-warning text-dark';
                break;
            case 'processing':
                badgeClass += 'bg-info text-dark';
                break;
            default:
                badgeClass += 'bg-secondary';
        }
        
        return <span className={badgeClass}>{status}</span>;
    };
    
    // Fonction pour basculer l'affichage
    const toggleOrdersDisplay = () => {
        setShowAllOrders(!showAllOrders);
    };
    
    // Fonction de déconnexion
    const handleLogout = () => {
        // Ici vous pourriez ajouter une logique pour supprimer le token d'authentification, etc.
        // Par exemple: localStorage.removeItem('authToken');
        
        // Redirection vers la page d'accueil
        navigate('/');
    };
    
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        borderRadius: '16px'
                    }}>
                        <div className="card-body p-4 p-md-5">
                            {/* Logo */}
                            <div className="text-center mb-4">
                                <h1 style={{
                                    fontWeight: '800',
                                    fontSize: '2rem',
                                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    3Ecom
                                </h1>
                                <h2 className="fw-bold mb-1">Hello, {user.name}</h2>
                                <p className="text-muted">Manage your account</p>
                            </div>
                            
                            <div className="d-flex justify-content-between mt-4">
                                <Link 
                                    to="/edit-profile" 
                                    className="btn w-100 me-2"
                                    style={{
                                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                        color: 'white',
                                        fontWeight: '500',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)'
                                    }}
                                >
                                    Edit Profile
                                </Link>
                                <button 
                                    className="btn w-100 ms-2"
                                    onClick={handleLogout}
                                    style={{
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: 'none'
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Recent Orders */}
            <div className="row justify-content-center mt-4">
                <div className="col-12">
                    <div className="card border-0" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        borderRadius: '16px'
                    }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold mb-0" style={{ fontSize: '1.25rem' }}>Recent Orders</h5>
                                <button
                                    onClick={toggleOrdersDisplay}
                                    className="btn btn-sm"
                                    style={{
                                        background: 'rgba(236, 236, 236, 0.7)',
                                        color: '#333',
                                        fontWeight: '500',
                                        borderRadius: '8px',
                                        border: 'none',
                                        padding: '8px 12px'
                                    }}
                                >
                                    {showAllOrders ? 'View Less' : 'View All'}
                                </button>
                            </div>
                            
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Order ID</th>
                                            <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Customer</th>
                                            <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Date</th>
                                            <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Amount</th>
                                            <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Status</th>
                                            <th scope="col" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td>#{order.id + 1000}</td>
                                                <td>{order.customer}</td>
                                                <td>{order.date}</td>
                                                <td>${order.amount.toFixed(2)}</td>
                                                <td>
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td>
                                                    <Link 
                                                        to={`/order/${order.id}`}
                                                        className="btn btn-sm"
                                                        style={{
                                                            background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                                                            color: 'white',
                                                            fontWeight: '500',
                                                            padding: '4px 10px',
                                                            borderRadius: '8px',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Separator */}
                            <div className="d-flex align-items-center my-4">
                                <div className="flex-grow-1 border-bottom"></div>
                            </div>
                            
                            {/* View all orders link */}
                            <div className="text-center">
                                <Link 
                                    to="/orders" 
                                    className="text-decoration-none" 
                                    style={{ 
                                        color: '#ff4d4d', 
                                        fontWeight: '500',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Manage All Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;