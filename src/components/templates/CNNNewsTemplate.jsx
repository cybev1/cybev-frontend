// CNN-Style News Blog Template
// Modern, professional news layout with breaking news banner

import React from 'react';

const CNNNewsTemplate = () => {
  // Demo news articles with stock images
  const breakingNews = {
    title: "Breaking: Major Climate Agreement Reached at Global Summit",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200",
    category: "World News",
    time: "5 minutes ago",
    badge: "BREAKING"
  };

  const topStories = [
    {
      id: 1,
      title: "Tech Giants Unveil Revolutionary AI Breakthrough",
      excerpt: "Leading technology companies announce collaborative effort in artificial intelligence research...",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "Technology",
      author: "Sarah Johnson",
      time: "1 hour ago",
      featured: true
    },
    {
      id: 2,
      title: "Global Markets Rally on Economic Recovery Signs",
      excerpt: "Stock markets worldwide show strongest gains in months as economic indicators point to sustained recovery...",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
      category: "Business",
      author: "Michael Chen",
      time: "2 hours ago",
      featured: true
    },
    {
      id: 3,
      title: "Historic Space Mission Launches Successfully",
      excerpt: "International space collaboration marks new era in space exploration with successful launch...",
      image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800",
      category: "Science",
      author: "Dr. Emily Roberts",
      time: "3 hours ago"
    }
  ];

  const sidebarStories = [
    {
      title: "Election Results: What You Need to Know",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400",
      category: "Politics",
      time: "4 hours ago"
    },
    {
      title: "Health Officials Report Breakthrough in Treatment",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
      category: "Health",
      time: "5 hours ago"
    },
    {
      title: "Sports: Championship Final Set for This Weekend",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
      category: "Sports",
      time: "6 hours ago"
    },
    {
      title: "Entertainment: New Film Breaks Box Office Records",
      image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400",
      category: "Entertainment",
      time: "7 hours ago"
    }
  ];

  const videoStories = [
    {
      title: "Watch: Inside the Climate Summit",
      thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400",
      duration: "3:45",
      views: "125K"
    },
    {
      title: "Exclusive Interview: Tech CEO Discusses Future",
      thumbnail: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400",
      duration: "12:30",
      views: "89K"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Breaking News Banner */}
      <div className="bg-red-600 text-white py-2 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center gap-4">
          <span className="font-bold text-sm uppercase tracking-wider animate-pulse">
            🔴 BREAKING NEWS
          </span>
          <p className="text-sm flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
            {breakingNews.title}
          </p>
          <button className="text-xs underline hover:no-underline">
            Read More →
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-4xl font-black text-red-600">CYBEV NEWS</h1>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-white hover:text-red-600 text-sm font-semibold">World</a>
                <a href="#" className="text-white hover:text-red-600 text-sm font-semibold">Politics</a>
                <a href="#" className="text-white hover:text-red-600 text-sm font-semibold">Business</a>
                <a href="#" className="text-white hover:text-red-600 text-sm font-semibold">Tech</a>
                <a href="#" className="text-white hover:text-red-600 text-sm font-semibold">Health</a>
                <a href="#" className="text-white hover:text-red-600 text-sm font-semibold">Entertainment</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-700">
                Live TV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Story */}
            <article className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={breakingNews.image} 
                  alt={breakingNews.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase">
                    {breakingNews.badge}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-red-600 text-sm font-semibold">{breakingNews.category}</span>
                  <span className="text-gray-600 text-sm">• {breakingNews.time}</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {breakingNews.title}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  World leaders have reached a historic agreement on climate action following intense negotiations at the global summit. The comprehensive deal includes commitments from over 190 nations to reduce carbon emissions and transition to renewable energy sources...
                </p>
                <button className="mt-4 text-red-600 font-semibold hover:underline">
                  Read Full Story →
                </button>
              </div>
            </article>

            {/* Top Stories Grid */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                TOP STORIES
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {topStories.slice(0, 2).map(story => (
                  <article key={story.id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all cursor-pointer">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-600 text-xs font-semibold uppercase">{story.category}</span>
                        <span className="text-gray-600 text-xs">• {story.time}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {story.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {story.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Video Section */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                📹 VIDEO NEWS
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {videoStories.map((video, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg overflow-hidden group cursor-pointer">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-semibold">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-1">{video.title}</h4>
                      <p className="text-gray-500 text-xs">{video.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* More Stories List */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                MORE HEADLINES
              </h3>
              <div className="space-y-4">
                {topStories.map(story => (
                  <article key={story.id} className="flex gap-4 bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-32 h-24 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-600 text-xs font-semibold uppercase">{story.category}</span>
                        <span className="text-gray-600 text-xs">• {story.time}</span>
                      </div>
                      <h4 className="text-white font-semibold mb-1 line-clamp-2">
                        {story.title}
                      </h4>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {story.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Updates */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                <h3 className="text-xl font-bold text-white">LIVE UPDATES</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-red-600 pl-4">
                  <p className="text-gray-500 text-xs mb-1">2 min ago</p>
                  <p className="text-white text-sm">Breaking: New developments in ongoing negotiations</p>
                </div>
                <div className="border-l-2 border-gray-700 pl-4">
                  <p className="text-gray-500 text-xs mb-1">15 min ago</p>
                  <p className="text-white text-sm">Officials confirm latest reports</p>
                </div>
                <div className="border-l-2 border-gray-700 pl-4">
                  <p className="text-gray-500 text-xs mb-1">28 min ago</p>
                  <p className="text-white text-sm">Market response shows positive trends</p>
                </div>
              </div>
            </div>

            {/* Trending */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🔥 TRENDING NOW
              </h3>
              <div className="space-y-4">
                {sidebarStories.map((story, idx) => (
                  <article key={idx} className="group cursor-pointer">
                    <div className="flex gap-3">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-20 h-20 object-cover rounded group-hover:opacity-80 transition-opacity"
                      />
                      <div className="flex-1">
                        <span className="text-red-600 text-xs font-semibold">{story.category}</span>
                        <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-red-600 transition-colors">
                          {story.title}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1">{story.time}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">📧 Daily Briefing</h3>
              <p className="text-sm opacity-90 mb-4">Get the top news delivered to your inbox every morning</p>
              <input 
                type="email" 
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded bg-white text-black mb-3"
              />
              <button className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-900 transition-colors">
                Subscribe Free
              </button>
            </div>

            {/* Weather Widget */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">🌤️ Weather</h3>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">72°</div>
                <p className="text-sm opacity-90">Partly Cloudy</p>
                <div className="mt-4 pt-4 border-t border-blue-500 flex justify-around text-xs">
                  <div><div className="font-bold">Mon</div><div className="opacity-75">75°</div></div>
                  <div><div className="font-bold">Tue</div><div className="opacity-75">68°</div></div>
                  <div><div className="font-bold">Wed</div><div className="opacity-75">71°</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">News Categories</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-red-600">World</a></li>
                <li><a href="#" className="hover:text-red-600">Politics</a></li>
                <li><a href="#" className="hover:text-red-600">Business</a></li>
                <li><a href="#" className="hover:text-red-600">Technology</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-red-600">Live TV</a></li>
                <li><a href="#" className="hover:text-red-600">Video</a></li>
                <li><a href="#" className="hover:text-red-600">Audio</a></li>
                <li><a href="#" className="hover:text-red-600">Newsletters</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-red-600">About Us</a></li>
                <li><a href="#" className="hover:text-red-600">Careers</a></li>
                <li><a href="#" className="hover:text-red-600">Contact</a></li>
                <li><a href="#" className="hover:text-red-600">Advertise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                  <span>f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                  <span>𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                  <span>in</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 CYBEV News. All rights reserved. | <a href="#" className="hover:text-red-600">Privacy Policy</a> | <a href="#" className="hover:text-red-600">Terms of Service</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CNNNewsTemplate;