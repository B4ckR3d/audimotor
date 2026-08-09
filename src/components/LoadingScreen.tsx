'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [brandName, setBrandName] = useState('Audi Motor');
  const [brandLogo, setBrandLogo] = useState('');

  useEffect(() => {
    // fetch brand settings
    fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => {
        if (data.brand_name) setBrandName(data.brand_name);
        if (data.brand_logo_url) setBrandLogo(data.brand_logo_url);
      })
      .catch(() => {});

    // fade out after page is ready
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShow(false), 600);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--surface-2)] transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-2 border-gray-500 flex items-center justify-center bg-gradient-to-br from-gray-700 to-black overflow-hidden shadow-[0_0_30px_rgba(150,150,150,0.2)]">
          {brandLogo ? (
            <img src={brandLogo} alt={brandName} className="w-full h-full object-cover" />
          ) : (
            <i className="fas fa-car-side text-[var(--text-3)] text-3xl"></i>
          )}
        </div>
        {/* Spinner ring */}
        <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-gray-400 animate-spin"></div>
      </div>

      {/* Brand Name */}
      <h1 className="font-display font-bold text-3xl tracking-widest uppercase text-chrome-effect mb-3">
        {brandName}
      </h1>

      {/* Loading bar */}
      <div className="w-48 h-0.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
}
