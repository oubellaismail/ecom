import React from 'react';
import { Link } from 'react-router-dom';
import useDashboardData from './Dashboard/useDashboardData';

const Dashboard = () => {
  const { dashboardData, loading, error } = useDashboardData();

  // Status Badge component
  const StatusBadge = ({ status }) => {
    const getBadgeStyle = () => {
      switch (status) {
        case 'Delivered':
          return { background: '#28a745', color: 'white' };
        case 'Processing':
          return { background: '#ffc107', color: 'black' };
        case 'Shipped':
          return { background: '#17a2b8', color: 'white' };
        case 'Cancelled':
          return { background: '#dc3545', color: 'white' };
        default:
          return { background: '#6c757d', color: 'white' };
      }
    };

    return (
      <span className="badge px-3 py-2" style={{
        ...getBadgeStyle(),
        borderRadius: '8px',
        fontSize: '0.75rem'
      }}>
        {status}
      </span>
    );
  };

  // Chart bars component
  const ChartBars = ({ data }) => {
    const max = Math.max(...data.map(item => item.total));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    return (
      <div className="d-flex align-items-end justify-content-between mt-3" style={{ height: '150px' }}>
        {data.map((item, index) => (
          <div key={index} className="d-flex flex-column align-items-center" style={{ width: `${100 / data.length}%` }}>
            <div
              style={{
                height: `${(item.total / max) * 100}%`,
                width: '80%',
                borderRadius: '6px 6px 0 0',
                background: 'linear-gradient(180deg, #ff4d4d, #f9cb28)'
              }}
            ></div>
            <div className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>{months[index]}</div>
          </div>
        ))}
      </div>
    );
  };

  // Icons
  const DollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );

  const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  );

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      minHeight: '100vh'
    }}>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card border-0" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px'
          }}>
            <div className="card-body p-4">
              {/* Logo */}
              <div className="text-center mb-4">
                <h1 style={{
                  fontWeight: '800',
                  fontSize: '1.75rem',
                  background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  3Ecom Admin
                </h1>
                <p className="text-muted">Admin Panel</p>
              </div>

              {/* Navigation Menu */}
              <div className="nav flex-column">
                <Link
                  to="/dashboard"
                  className="nav-link text-start py-3 px-4 mb-2"
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                    color: 'white',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/AdminDashboard"
                  className="nav-link text-start py-3 px-4 mb-2"
                  style={{
                    borderRadius: '12px',
                    background: 'rgba(236, 236, 236, 0.7)',
                    color: '#333',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Products
                </Link>
                <Link
                  to="/order"
                  className="nav-link text-start py-3 px-4 mb-2"
                  style={{
                    borderRadius: '12px',
                    background: 'rgba(236, 236, 236, 0.7)',
                    color: '#333',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Orders
                </Link>
                <Link
                  to="/discount"
                  className="nav-link text-start py-3 px-4"
                  style={{
                    borderRadius: '12px',
                    background: 'rgba(236, 236, 236, 0.7)',
                    color: '#333',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Discount coupons
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="row g-4 mb-4">
            {/* Stats Cards */}
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 h-100" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle" style={{
                      background: 'rgba(255, 77, 77, 0.1)',
                      color: '#ff4d4d'
                    }}>
                      <DollarIcon />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Sales</h6>
                      <h3 className="fw-bold mb-0">${dashboardData.totalSales.toLocaleString()}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 h-100" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle" style={{
                      background: 'rgba(249, 203, 40, 0.1)',
                      color: '#f9cb28'
                    }}>
                      <BoxIcon />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Orders</h6>
                      <h3 className="fw-bold mb-0">{dashboardData.totalOrders}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 h-100" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle" style={{
                      background: 'rgba(23, 162, 184, 0.1)',
                      color: '#17a2b8'
                    }}>
                      <TagIcon />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Products</h6>
                      <h3 className="fw-bold mb-0">{dashboardData.totalProducts}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card border-0 h-100" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px'
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle" style={{
                      background: 'rgba(40, 167, 69, 0.1)',
                      color: '#28a745'
                    }}>
                      <UsersIcon />
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Customers</h6>
                      <h3 className="fw-bold mb-0">{dashboardData.totalCustomers}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Sales Chart */}
            <div className="col-lg-8">
              <div className="card border-0" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px'
              }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Sales Overview</h5>
                  <ChartBars data={dashboardData.salesOverview} />

                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <h6 className="text-muted mb-1">Monthly Average</h6>
                      <h4 className="fw-bold mb-0">
                        ${dashboardData.monthlyAverageRevenue.toLocaleString()}
                      </h4>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Revenue</h6>
                      <h4 className="fw-bold mb-0">
                        ${dashboardData.totalRevenueLast6Months.toLocaleString()}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="col-lg-4">
              <div className="card border-0" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px'
              }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Alerts</h5>

                  <div className="d-flex align-items-center p-3 mb-3" style={{
                    background: 'rgba(255, 77, 77, 0.1)',
                    borderRadius: '12px'
                  }}>
                    <div className="me-3" style={{ color: '#ff4d4d' }}>
                      <AlertIcon />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Pending Orders</h6>
                      <p className="mb-0" style={{ fontSize: '0.9rem' }}>{dashboardData.pendingOrders} orders need processing</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center p-3" style={{
                    background: 'rgba(249, 203, 40, 0.1)',
                    borderRadius: '12px'
                  }}>
                    <div className="me-3" style={{ color: '#f9cb28' }}>
                      <AlertIcon />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Low Stock Alert</h6>
                      <p className="mb-0" style={{ fontSize: '0.9rem' }}>{dashboardData.lowStockItems} products are low in stock</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      to="/admin/products"
                      className="btn w-100"
                      style={{
                        background: 'linear-gradient(90deg, #ff4d4d, #f9cb28)',
                        color: 'white',
                        fontWeight: '500',
                        padding: '10px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.2)',
                        border: 'none'
                      }}
                    >
                      Manage Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card border-0" style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px'
          }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Recent Orders</h5>
                <Link
                  to="/admin/orders"
                  className="btn btn-sm"
                  style={{
                    background: 'rgba(236, 236, 236, 0.7)',
                    color: '#333',
                    fontWeight: '500',
                    borderRadius: '8px',
                    border: 'none'
                  }}
                >
                  View All
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Order ID</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td>#{order.order_number}</td>
                        <td>{order.user_full_name}</td>
                        <td>${order.total_amount.toFixed(2)}</td>
                        <td>
                          <StatusBadge status={order.order_status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;