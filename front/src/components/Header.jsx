import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import logo from "../logo1.png"; // Ensure your logo is correctly imported

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 w-full bg-gradient-to-r  shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 md:px-12">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 md:h-16 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-white text-lg font-medium">
          {["Accueil", "Produits", "Collections", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="relative pb-1 transition duration-300 hover:text-gray-200 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right Section: Cart + Auth */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Cart Icon */}
          <a href="/cart" className="relative text-white hover:text-gray-200">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              3
            </span>
          </a>

          {/* Authentication */}
          <SignedOut>
            <div className="flex space-x-4">
              <a href="/login" className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-green-600 transition">
                Login
              </a>
              <a href="/signup" className="px-4 py-2 rounded-lg bg-white text-green-600 hover:bg-gray-100 transition">
                Sign Up
              </a>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full">
          <ul className="flex flex-col items-center py-4 space-y-4 text-gray-800 text-lg">
            {["Accueil", "Produits", "Collections", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-green-500">{item}</a>
              </li>
            ))}
            <SignedOut>
              <div className="flex flex-col items-center space-y-3">
                <a href="/login" className="px-6 py-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-100 transition">
                  Login
                </a>
                <a href="/signup" className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
                  Sign Up
                </a>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
