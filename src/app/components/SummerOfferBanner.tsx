'use client';

import React, { useState, useEffect } from 'react';

export default function SummerOfferBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-20 left-0 w-full z-30
        bg-gradient-to-r from-emerald-400 to-teal-500 text-white
        py-3 px-4 shadow-xl
        transform transition-transform duration-700 ease-out
        ${isVisible ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-base relative">
        <span className="flex-grow text-center md:text-left font-medium pr-8">
          Este verano, contrata tu web o app y obtén un{' '}
          <strong className="text-emerald-200 font-bold">10% de descuento</strong>.
        </span>
        <button
          onClick={handleDismiss}
          className="
            absolute right-0 top-1/2 -translate-y-1/2
            text-white text-opacity-80 hover:text-opacity-100
            bg-transparent border-none
            p-2 rounded-full
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
            cursor-pointer hover:bg-neutral-200 hover:text-black
          "
          aria-label="Cerrar banner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}