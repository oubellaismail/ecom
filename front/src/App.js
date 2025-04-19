import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import HomeCarousel from './components/HomeCarousel';
import FeaturedProducts from './components/FeaturedProducts';
import NewArrivals from './components/NewArrivals';
import CategoriesShowcase from './components/CategoriesShowcase';
import BenefitsSection from './components/BenefitsSection';
import NewsletterAndTrust from './components/NewsletterAndTrust';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Cart from './components/Cart.js';
import Checkout from './components/Checkout.js';
import ForgotPassword from './components/ForgotPassword.js';
import ResetPassword from './components/ResetPassword.js';
import AdminDashboard from './components/AdminDashboard.js';
import Dashboard from './components/Dashboard.js';
import EditProfile from './components/EditProfile.js';
import ViewDetails from './components/ViewDetails.js';
import OrderValidation from './components/OrderValidation.js';
import DiscountCoupons from './components/DiscountCoupons.js';
import AllProducts from './components/AllProducts.js';
import About from './components/About.js';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import CheckoutSuccess from './components/CheckoutSuccess';

function HomePage() {
  return (
    <>
      <HomeCarousel />
      <CategoriesShowcase />
      <FeaturedProducts />
      <NewArrivals />
      <BenefitsSection />
      <NewsletterAndTrust />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/order" element={<OrderValidation />} />
                  <Route path="/discount" element={<DiscountCoupons />} />
                  <Route
                    path="/AdminDashboard"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedAdminRoute>
                        <Dashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedAdminRoute>
                        <Profile />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route
                    path="/edit-profile"
                    element={
                      <ProtectedAdminRoute>
                        <EditProfile />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route path="/product/:id" element={<ViewDetails />} />
                  <Route path="/shop" element={<AllProducts />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;