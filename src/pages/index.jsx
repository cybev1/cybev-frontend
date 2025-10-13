import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CYBEVLanding() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '🎨',
      title: 'Build Your Empire',
      desc: 'Create stunning blogs & websites with AI',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: '🚀',
      title: 'Social + Web3',
      desc: 'Connect, create, own your content as NFTs',
      gradient: 'from-indigo-500 to-blue-400'
    },
    {
      icon: '💰',
      title: 'Earn & Grow',
      desc: 'Get paid for engagement, stake, trade',
      gradient: 'from-blue-600 to-sky-400'
    },
    {
      icon: '🤖',
      title: 'AI Powers',
      desc: 'Generate content, images with AI magic',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Creators' },
    { number: '$2M+', label: 'Earned' },
    { number: '50K+', label: 'NFTs' },
    { number: '100+', label: 'Communities' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900">
      {/* Mobile-First Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 20 ? 'bg-white/90 backdrop-blur-xl border-b border-blue-100 shadow-lg' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl text-white shadow-lg">
              C
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              CYBEV
            </span>
          </div>
          
          <div className="hidden sm:flex gap-6 lg:gap-8 text-gray-600 text-sm lg:text-base">
            <a href="#features" className="hover:text-blue-600 transition font-medium">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition font-medium">How it Works</a>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={() => router.push('/auth/login')}
              className="px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-blue-50 transition font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/auth/choice')}
              className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition font-semibold shadow-lg text-sm sm:text-base"
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto text-center z-10 w-full">
          <div className="mb-6 sm:mb-8 inline-block">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold">
              ✨ The Future of Social Web3
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900 px-2">
            Create. <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Connect.</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Own Everything.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Build your blog, join the social network, mint NFTs, and earn crypto. All powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-20 px-4">
            <button 
              onClick={() => router.push('/auth/choice')}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition font-bold text-base sm:text-lg shadow-2xl shadow-blue-200 active:scale-95"
            >
              🚀 Start Building Free
            </button>
            <button className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 transition font-bold text-base sm:text-lg active:scale-95">
              👀 Watch Demo
            </button>
          </div>

          {/* Stats - Mobile Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-4">
            {stats.map((stat, i) => (
              <div key={i} className="p-4 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 active:scale-95">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-white via-blue-50 to-cyan-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">One platform. Infinite possibilities.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm border border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 active:scale-95"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Super <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Easy</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600">Get started in 3 simple steps</p>
          </div>

          <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 md:gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create account in 30 seconds', icon: '👤', color: 'from-blue-600 to-blue-500' },
              { step: '02', title: 'Build & Create', desc: 'Launch blog or start posting', icon: '✨', color: 'from-cyan-600 to-cyan-500' },
              { step: '03', title: 'Earn & Own', desc: 'Get paid, mint NFTs, stake', icon: '💰', color: 'from-indigo-600 to-indigo-500' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="hidden sm:block text-7xl md:text-8xl font-bold text-blue-100 absolute -top-4 md:-top-6 -left-2 md:-left-4">
                  {item.step}
                </div>
                <div className="relative p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm border border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 active:scale-95">
                  <div className="flex items-center gap-4 mb-4 sm:mb-6">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl sm:text-3xl shadow-xl`}>
                      {item.icon}
                    </div>
                    <span className="sm:hidden text-3xl font-bold text-blue-200">{item.step}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-white via-cyan-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Loved by <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Creators</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              { name: 'Sarah Chen', role: 'Creator', text: 'Made $5K in my first month! 🔥', avatar: '👩🏻‍💻' },
              { name: 'Marcus J', role: 'NFT Artist', text: 'Sold 200+ NFTs. Game changer!', avatar: '🎨' },
              { name: 'Emma Rose', role: 'Blogger', text: 'AI tools are incredible 💌', avatar: '✨' }
            ].map((testimonial, i) => (
              <div key={i} className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm border border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 active:scale-95">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Ready to Build Your Empire?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 sm:mb-8">
              Join 10,000+ creators earning and owning their future
            </p>
            <button 
              onClick={() => router.push('/auth/choice')}
              className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition font-bold text-base sm:text-lg md:text-xl shadow-2xl active:scale-95"
            >
              🚀 Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-blue-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg shadow-lg"></div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">CYBEV</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The future of creator economy
              </p>
            </div>

            {[
              { title: 'Platform', links: ['Blog Builder', 'Social Feed', 'NFT Market', 'Staking'] },
              { title: 'Resources', links: ['Docs', 'API', 'Support', 'Roadmap'] },
              { title: 'Community', links: ['Discord', 'Twitter', 'Telegram', 'Blog'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold mb-3 sm:mb-4 text-gray-900 text-sm sm:text-base">{col.title}</h4>
                <ul className="space-y-2 text-gray-600 text-xs sm:text-sm">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="hover:text-blue-600 transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 sm:pt-8 border-t border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-gray-600 text-xs sm:text-sm">© 2025 CYBEV. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition">Terms</a>
              <a href="#" className="hover:text-blue-600 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
