import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import HomeCarousel from './components/HomeCarousel';
import FeaturedProducts from './components/FeaturedProducts';
import NewArrivals from './components/NewArrivals';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Cart from './components/Cart.js';
import Checkout from './components/Checkout.js';
import ForgotPassword from './components/ForgotPassword.js';
import ResetPassword from './components/ResetPassword.js';
import AdminDashboard from './components/AdminDashboard.js';
import Dashboard from './components/Dashboard.js';



function HomePage() {
  return (
    <>
      <HomeCarousel />
      <FeaturedProducts />
      <NewArrivals />
    </>
  );
}

function App() {
  return (
    // kadir is here
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;