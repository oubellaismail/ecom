import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Header = () => {
  return (
    <header className="header sticky top-0 bg-white shadow-md flex items-center justify-between px-8 py-2">
      {/* logo */}
      <h1 className="w-3/12">
        <a href="">
          <svg viewBox="0 0 248 31" className="h-6 w-auto hover:text-green-500 duration-200">
            <path d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z" fill="#22C55E"></path>
          </svg>
        </a>
      </h1>

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
