import React from 'react';
import Header from './Header.jsx';  
import Footer from './Footer';  // Assurez-vous que le chemin est correct
import Product from './Product.jsx'; 
import Carousel from './Carousel.jsx';
function Home() {
  return (
    <>
      <Header />
      <Carousel />
      <Footer />
    </>
  );
}

export default Home;
