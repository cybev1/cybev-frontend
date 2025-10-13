import React from 'react';
import { useRouter } from 'next/router';

const TopNavbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            CYBEV
          </button>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => router.push('/features')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => router.push('/pricing')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Pricing
            </button>
            <button 
              onClick={() => router.push('/about')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              About
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/auth/choice')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;