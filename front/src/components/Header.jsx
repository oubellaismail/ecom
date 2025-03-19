import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import logo from "../logs.png";
 

const Header = () => {
  return (
    <header className="header sticky top-0 bg-white shadow-md flex items-center justify-between px-8 py-2">
      {/* logo */}
      
      <a href="#" className="flex items-center">
        <img src={logo} alt="Logo" className="h-22 w-auto" />
      </a>
      

      {/* navigation */}
      <nav className="nav font-semibold text-lg">
        <ul className="flex items-center">
          <li className="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer active">
            <a href="">Accueil</a>
          </li>
          <li className="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer">
            <a href="">Produits</a>
          </li>
          <li className="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer">
            <a href="">Collections</a>
          </li>
          <li className="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-100 hover:text-green-500 duration-200 cursor-pointer">
            <a href="">Contact</a>
          </li>
        </ul>
      </nav>

      {/* Login and Register buttons */}
      <SignedOut>
        <div className="w-3/12 flex justify-end">
          <a href="/login" className="p-4 text-lg font-semibold text-green-500 hover:text-green-600 duration-200 cursor-pointer">
            Login
          </a>
          <a href="/signup" className="ml-4 p-4 text-lg font-semibold text-green-500 hover:text-green-600 duration-200 cursor-pointer">
            Signup
          </a>
        </div>
      </SignedOut>
      <SignedIn>
        <div>
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
};

export default Header;
