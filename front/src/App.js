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
    <Router>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<AllProducts />} />
                  <Route path="/product/:id" element={<ViewDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<OrderValidation />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
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
                    path="/edit-profile"
                    element={
                        <EditProfile />
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;