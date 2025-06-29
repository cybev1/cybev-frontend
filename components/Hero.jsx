import React from 'react';

function Hero() {
  return (
    <section className="text-center py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to CYBEV.IO</h1>
      <p className="text-xl md:text-2xl mb-8">Your AI-Powered Web3 Social & Blogging Platform</p>
      <button className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold transition transform hover:scale-105">
        Get Started
      </button>
    </section>
  );
}

export default Hero;
