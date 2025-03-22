import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 fixed bottom-0 w-full">
      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center text-teal-600 sm:justify-start">
            <svg className="h-8" viewBox="0 0 118 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* SVG content here */}
            </svg>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0">
            © 2025 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
