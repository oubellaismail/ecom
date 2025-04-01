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
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;