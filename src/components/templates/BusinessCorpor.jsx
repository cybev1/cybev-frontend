// Featured Template 4: Business/Corporate
// Clean, professional, trustworthy design

import React from 'react';

const BusinessCorporate = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                BC
              </div>
              <span className="text-2xl font-bold text-gray-900">BusinessCorp</span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-semibold">
              <a href="#" className="hover:text-blue-600">Services</a>
              <a href="#" className="hover:text-blue-600">Solutions</a>
              <a href="#" className="hover:text-blue-600">About</a>
              <a href="#" className="hover:text-blue-600">Contact</a>
            </nav>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Business with Enterprise Solutions
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Trusted by 500+ companies worldwide to streamline operations and drive growth
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold">
                Schedule Demo
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Solutions</h2>
          <p className="text-xl text-gray-600">Comprehensive services for modern businesses</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📊', title: 'Analytics', desc: 'Data-driven insights for smarter decisions' },
            { icon: '🔒', title: 'Security', desc: 'Enterprise-grade protection for your data' },
            { icon: '⚡', title: 'Performance', desc: 'Lightning-fast solutions that scale' }
          ].map((service, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join hundreds of companies already growing with us</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg">
            Contact Sales
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Enterprise</li>
                <li>Small Business</li>
                <li>Startups</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Blog</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 BusinessCorp. Built with CYBEV.io</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusinessCorporate;