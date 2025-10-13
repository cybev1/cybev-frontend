import { useState, useEffect } from 'react';

export default function CYBEVLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '🎨',
      title: 'Build Your Empire',
      desc: 'Create stunning blogs & websites in minutes with AI-powered tools',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🚀',
      title: 'Social + Web3',
      desc: 'Connect, create, and earn. Own your content as NFTs',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💰',
      title: 'Earn While You Create',
      desc: 'Get paid for engagement, stake tokens, trade NFTs',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🤖',
      title: 'AI Superpowers',
      desc: 'Generate content, images, and optimize everything with AI',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Creators' },
    { number: '$2M+', label: 'Earned' },
    { number: '50K+', label: 'NFTs Minted' },
    { number: '100+', label: 'Communities' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/80 backdrop-blur-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-xl">
              C
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CYBEV
            </span>
          </div>
          
          <div className="hidden md:flex gap-8">
            <a href="#features" className="hover:text-purple-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-purple-400 transition">How it Works</a>
            <a href="#community" className="hover:text-purple-400 transition">Community</a>
          </div>

          <div className="flex gap-4">
            <button className="px-4 py-2 rounded-lg border border-purple-500 hover:bg-purple-500/20 transition">
              Sign In
            </button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition font-semibold">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center z-10">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 text-sm font-semibold">
              ✨ The Future of Social Web3
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Create. <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Connect.</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Own Everything.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Build your blog, join the social network, mint NFTs, and earn crypto. 
            All powered by AI. Welcome to the creator economy 2.0
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition font-bold text-lg shadow-lg shadow-purple-500/50">
              🚀 Start Building Free
            </button>
            <button className="px-8 py-4 rounded-xl border-2 border-purple-500 hover:bg-purple-500/20 transition font-bold text-lg">
              👀 See How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-500 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Dominate</span>
            </h2>
            <p className="text-xl text-gray-400">One platform. Infinite possibilities.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`group p-8 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-105`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-black via-purple-900/10 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Getting Started is
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Easy AF</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create account in 30 seconds with email or wallet', icon: '👤' },
              { step: '02', title: 'Build & Create', desc: 'Launch your blog or start posting. AI helps you create', icon: '✨' },
              { step: '03', title: 'Earn & Own', desc: 'Get paid, mint NFTs, stake tokens. Your content = your money', icon: '💰' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-bold text-purple-500/20 absolute -top-8 -left-4">
                  {item.step}
                </div>
                <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Movement</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'Content Creator', text: 'Made $5K in my first month just posting what I love. This is insane! 🔥', avatar: '👩🏻‍💻' },
              { name: 'Marcus J', role: 'NFT Artist', text: 'Sold 200+ NFTs of my blog posts. CYBEV changed the game for creators like me.', avatar: '🎨' },
              { name: 'Emma Rose', role: 'Blogger', text: 'Built my entire brand here. The AI tools are chef\'s kiss 👌', avatar: '✨' }
            ].map((testimonial, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 border border-white/20 backdrop-blur-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Empire?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 10,000+ creators earning, creating, and owning their future
            </p>
            <button className="px-10 py-5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition font-bold text-xl shadow-2xl shadow-purple-500/50">
              🚀 Get Started - It's Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
                <span className="text-xl font-bold">CYBEV</span>
              </div>
              <p className="text-gray-400 text-sm">
                The future of creator economy. Build, earn, own.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Blog Builder</a></li>
                <li><a href="#" className="hover:text-purple-400">Social Feed</a></li>
                <li><a href="#" className="hover:text-purple-400">NFT Marketplace</a></li>
                <li><a href="#" className="hover:text-purple-400">Token Staking</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-400">API</a></li>
                <li><a href="#" className="hover:text-purple-400">Support</a></li>
                <li><a href="#" className="hover:text-purple-400">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Discord</a></li>
                <li><a href="#" className="hover:text-purple-400">Twitter</a></li>
                <li><a href="#" className="hover:text-purple-400">Telegram</a></li>
                <li><a href="#" className="hover:text-purple-400">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2025 CYBEV. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-purple-400">Privacy</a>
              <a href="#" className="hover:text-purple-400">Terms</a>
              <a href="#" className="hover:text-purple-400">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
