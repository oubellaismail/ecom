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
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold display-6">{user.name}</h2>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mt-3">
                            <Link to="/edit-profile" className="btn btn-primary">Edit Profile</Link>
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Recent Orders */}
            <div className="card border-0 mt-4" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px'
            }}>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold mb-0">Recent Orders</h5>
                        <button
                            onClick={toggleOrdersDisplay}
                            className="btn btn-sm"
                            style={{
                                background: 'rgba(236, 236, 236, 0.7)',
                                color: '#333',
                                fontWeight: '500',
                                borderRadius: '8px',
                                border: 'none'
                            }}
                        >
                            {showAllOrders ? 'View Less' : 'View All'}
                        </button>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Order ID</th>
                                    <th scope="col">Customer</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Status</th>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;