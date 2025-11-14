// Featured Template 1: Modern Tech
// Dark, sleek, developer-focused design for tech/SaaS

import React from 'react';

const ModernTech = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">
                T
              </div>
              <span className="text-xl font-bold">TechFlow</span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm">
              <a href="#" className="hover:text-blue-400 transition">Products</a>
              <a href="#" className="hover:text-blue-400 transition">Solutions</a>
              <a href="#" className="hover:text-blue-400 transition">Developers</a>
              <a href="#" className="hover:text-blue-400 transition">Pricing</a>
              <a href="#" className="hover:text-blue-400 transition">Docs</a>
            </nav>
            <div className="flex gap-4">
              <button className="text-sm hover:text-blue-400 transition">Sign In</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                Start Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-6">
            🚀 Now with AI-powered automation
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Build Faster.<br />Ship Better.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
            The modern development platform for ambitious teams. Deploy in seconds, scale to millions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition">
              Start Building Free
            </button>
            <button className="border-2 border-gray-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:border-gray-600 transition">
              View Demo
            </button>
          </div>
          <div className="mt-12 text-sm text-gray-500">
            Trusted by 50,000+ developers worldwide
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
{`// Deploy your app in one command
$ techflow deploy

✓ Building...
✓ Optimizing...
✓ Deploying to edge...
✓ Live at https://your-app.tf.io

Deployment complete in 4.2s 🚀`}
            </pre>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Built for Speed</h2>
            <p className="text-xl text-gray-400">Everything you need to ship faster</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Edge-optimized infrastructure delivers your content in milliseconds worldwide.',
                metric: '10ms'
              },
              {
                icon: '🔒',
                title: 'Enterprise Security',
                description: 'Bank-level encryption, DDoS protection, and automatic SSL certificates.',
                metric: '99.99%'
              },
              {
                icon: '📊',
                title: 'Real-time Analytics',
                description: 'Powerful insights into performance, users, and errors as they happen.',
                metric: '1M req/s'
              },
              {
                icon: '🌍',
                title: 'Global CDN',
                description: 'Content delivered from 200+ edge locations across 6 continents.',
                metric: '200+'
              },
              {
                icon: '🔄',
                title: 'Auto Scaling',
                description: 'Automatically scales to handle traffic spikes without configuration.',
                metric: 'Unlimited'
              },
              {
                icon: '🛠️',
                title: 'Developer Tools',
                description: 'CLI, SDK, webhooks, and integrations with your favorite tools.',
                metric: '50+'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-800/30 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition group">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{feature.metric}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50K+', label: 'Active Developers' },
              { number: '100M+', label: 'Requests Daily' },
              { number: '99.99%', label: 'Uptime SLA' },
              { number: '200+', label: 'Edge Locations' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400">Start free, scale as you grow</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'Perfect for side projects',
                features: [
                  '10 Projects',
                  '100GB Bandwidth',
                  'Community Support',
                  'Basic Analytics'
                ]
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/month',
                description: 'For professional developers',
                features: [
                  'Unlimited Projects',
                  '1TB Bandwidth',
                  'Priority Support',
                  'Advanced Analytics',
                  'Custom Domains',
                  'Team Collaboration'
                ],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large organizations',
                features: [
                  'Everything in Pro',
                  'Unlimited Bandwidth',
                  'Dedicated Support',
                  'SLA Guarantees',
                  'Custom Integrations',
                  'Advanced Security'
                ]
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`bg-gray-800/30 p-8 rounded-2xl border ${
                  plan.popular ? 'border-blue-500 relative' : 'border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
                <p className="text-gray-400 mb-8">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-bold transition ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Build?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join 50,000+ developers building the future
          </p>
          <button className="bg-white text-blue-600 px-12 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
            Start Building Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">
                  T
                </div>
                <span className="text-xl font-bold">TechFlow</span>
              </div>
              <p className="text-gray-400">
                The modern development platform for ambitious teams.
              </p>
            </div>
            
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Security', 'Roadmap']
              },
              {
                title: 'Developers',
                links: ['Documentation', 'API Reference', 'CLI', 'SDK']
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact']
              }
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-400 hover:text-white transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 TechFlow. Built with CYBEV.io
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernTech;