import React, { useState, useEffect } from 'react';
import logo from './img.jpg';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

import './App.css';
import Header from './components/Header';

const App = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    <div className="coming-soon-container">
      <div className="content-wrapper">
        <div className="image-container">
          <img 
            src={logo} 
            alt="Coming Soon" 
            className="announcement-image"
          />
        </div>
        
        <h1 className="main-title">3assasa ecom</h1>
        <h2 className="subtitle">Coming soon</h2>
        
        <div className="loading-container">
          <span className="loading-text">Loading{dots}</span>
        </div>
      </div>
    </div>
    </>
  );
};

export default App;