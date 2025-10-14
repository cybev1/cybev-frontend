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

      {/* Hero Section */}
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

          {/* Stats */}
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

      {/* Rest of sections stay the same... */}
      {/* Features, How It Works, Testimonials, CTA, Footer */}
      {/* (Copy from your existing file) */}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Ready to Build Your Empire?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-50 mb-6 sm:mb-8">
              Join 10,000+ creators earning and owning their future
            </p>
