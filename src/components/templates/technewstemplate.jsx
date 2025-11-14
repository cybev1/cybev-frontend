// Tech News Template
// Modern tech blog with dark theme, product showcases, and code-friendly design

import React from 'react';

const TechNewsTemplate = () => {
  const featuredStory = {
    title: "Revolutionary AI Chip Breakthrough Changes Computing Forever",
    excerpt: "Tech giants unveil next-generation processor that promises 100x faster AI processing...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
    category: "AI & Machine Learning",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    date: "2 hours ago",
    readTime: "8 min read",
    tags: ["AI", "Processors", "Innovation"]
  };

  const techNews = [
    {
      id: 1,
      title: "Apple Announces Vision Pro 2 with Groundbreaking Features",
      excerpt: "The next generation of spatial computing arrives with improved specs and new capabilities...",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800",
      category: "Hardware",
      author: "Mike Johnson",
      date: "3 hours ago",
      readTime: "5 min"
    },
    {
      id: 2,
      title: "OpenAI Releases GPT-5: What You Need to Know",
      excerpt: "The latest language model brings unprecedented capabilities and new ethical considerations...",
      image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800",
      category: "AI",
      author: "Emily Davis",
      date: "5 hours ago",
      readTime: "10 min"
    },
    {
      id: 3,
      title: "Quantum Computing Achieves Major Milestone",
      excerpt: "Researchers demonstrate quantum advantage in solving real-world problems...",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
      category: "Quantum",
      author: "Dr. James Wilson",
      date: "8 hours ago",
      readTime: "7 min"
    }
  ];

  const productShowcase = [
    {
      name: "MacBook Pro M4",
      price: "$2,499",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      rating: 4.8,
      badge: "Editor's Choice"
    },
    {
      name: "iPhone 16 Pro",
      price: "$1,199",
      image: "https://images.unsplash.com/photo-1678652197950-29c26f7bc3f6?w=400",
      rating: 4.9,
      badge: "Best Value"
    },
    {
      name: "Vision Pro 2",
      price: "$3,499",
      image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400",
      rating: 4.7,
      badge: "New"
    }
  ];

  const quickLinks = [
    { name: "Startups", count: 245 },
    { name: "Gadgets", count: 189 },
    { name: "Software", count: 334 },
    { name: "Security", count: 156 },
    { name: "Cloud", count: 278 },
    { name: "Mobile", count: 421 }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="font-semibold">⚡ TRENDING:</span>
            <span className="hidden md:inline">AI Revolution • Quantum Leap • 5G Expansion</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:underline">Subscribe</a>
            <span>•</span>
            <a href="#" className="hover:underline">Newsletter</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CYBEV TECH
              </h1>
              <nav className="hidden lg:flex items-center gap-6">
                <a href="#" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">AI</a>
                <a href="#" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Hardware</a>
                <a href="#" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Software</a>
                <a href="#" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Startups</a>
                <a href="#" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Reviews</a>
                <a href="#" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">Podcast</a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Story */}
        <article className="mb-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-96 md:h-auto">
              <img 
                src={featuredStory.image} 
                alt={featuredStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  FEATURED
                </span>
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">
                  {featuredStory.category}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">{featuredStory.readTime}</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                {featuredStory.title}
              </h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                {featuredStory.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {featuredStory.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src={featuredStory.authorImage} 
                  alt={featuredStory.author}
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                <div>
                  <p className="font-semibold text-white">{featuredStory.author}</p>
                  <p className="text-gray-500 text-sm">{featuredStory.date}</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Latest Tech News */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Latest Stories</h3>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                  View All →
                </a>
              </div>
              <div className="space-y-6">
                {techNews.map(article => (
                  <article key={article.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all group">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="relative overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {article.category}
                          </span>
                          <span className="text-gray-500 text-sm">{article.date}</span>
                        </div>
                        <h4 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-gray-400 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 text-sm">{article.author}</span>
                          <span className="text-gray-500 text-sm">{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Product Showcase */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                Editor's Picks
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {productShowcase.map((product, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500 transition-all group cursor-pointer">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                          {product.badge}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-400">{product.price}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-4">Browse by Topic</h3>
              <div className="space-y-2">
                {quickLinks.map((link, idx) => (
                  <a 
                    key={idx}
                    href="#" 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                  >
                    <span className="font-medium group-hover:text-blue-400 transition-colors">
                      {link.name}
                    </span>
                    <span className="text-gray-500 text-sm">{link.count}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-xl font-bold mb-2">Daily Tech Brief</h3>
              <p className="text-sm opacity-90 mb-4">
                Get the biggest tech stories delivered to your inbox every morning
              </p>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur border border-white/30 placeholder-white/60 mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Subscribe Free
              </button>
            </div>

            {/* Tech Events */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📅</span>
                Upcoming Events
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-sm text-gray-400 mb-1">Jan 25, 2025</p>
                  <p className="font-semibold">CES 2025 Tech Summit</p>
                </div>
                <div className="border-l-2 border-purple-500 pl-4">
                  <p className="text-sm text-gray-400 mb-1">Feb 10, 2025</p>
                  <p className="font-semibold">AI Innovation Conference</p>
                </div>
                <div className="border-l-2 border-green-500 pl-4">
                  <p className="text-sm text-gray-400 mb-1">Mar 5, 2025</p>
                  <p className="font-semibold">Mobile World Congress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CYBEV TECH
              </h4>
              <p className="text-gray-400 text-sm">
                Your source for the latest technology news, reviews, and analysis.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Topics</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">AI & ML</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Hardware</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Software</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Startups</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Advertise</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Follow Us</h5>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span>𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span>in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span>YT</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 CYBEV Tech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TechNewsTemplate;