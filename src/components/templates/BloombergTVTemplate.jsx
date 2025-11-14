// Bloomberg-Style Streaming/TV Blog Template
// Professional financial/business TV streaming platform

import React, { useState } from 'react';

const BloombergTVTemplate = () => {
  const [activeTab, setActiveTab] = useState('live');

  // Live stream data
  const liveStream = {
    title: "Market Close: Tech Stocks Rally on Earnings Beat",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200",
    viewers: "45.2K",
    host: "Maria Rodriguez",
    showTime: "4:00 PM - 6:00 PM ET"
  };

  // Featured shows
  const featuredShows = [
    {
      id: 1,
      title: "The Market Pulse",
      host: "David Chen",
      time: "6:00 AM ET",
      thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600",
      description: "Morning market analysis and trading strategies",
      category: "Markets",
      duration: "60 min"
    },
    {
      id: 2,
      title: "Tech Titans",
      host: "Sarah Williams",
      time: "12:00 PM ET",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
      description: "Deep dive into technology and innovation",
      category: "Technology",
      duration: "30 min"
    },
    {
      id: 3,
      title: "Global Economy Hour",
      host: "Michael Anderson",
      time: "3:00 PM ET",
      thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600",
      description: "International markets and economic analysis",
      category: "Economics",
      duration: "60 min"
    }
  ];

  // Video library
  const videoLibrary = [
    {
      id: 1,
      title: "CEO Interview: AI Revolution in Finance",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
      duration: "15:32",
      views: "125K",
      date: "2 hours ago",
      category: "Interviews"
    },
    {
      id: 2,
      title: "Market Analysis: S&P 500 Outlook for Q4",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
      duration: "12:18",
      views: "98K",
      date: "4 hours ago",
      category: "Analysis"
    },
    {
      id: 3,
      title: "Crypto Corner: Bitcoin Surges Past $50K",
      thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400",
      duration: "8:45",
      views: "156K",
      date: "6 hours ago",
      category: "Cryptocurrency"
    },
    {
      id: 4,
      title: "Fed Watch: Interest Rate Decision Preview",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
      duration: "10:22",
      views: "87K",
      date: "8 hours ago",
      category: "Economics"
    }
  ];

  // Market data
  const marketData = [
    { index: "S&P 500", value: "4,785.32", change: "+1.24%", up: true },
    { index: "Dow Jones", value: "37,846.15", change: "+0.87%", up: true },
    { index: "NASDAQ", value: "15,245.67", change: "+1.89%", up: true },
    { index: "Bitcoin", value: "$52,340", change: "-2.15%", up: false }
  ];

  // Schedule
  const schedule = [
    { time: "6:00 AM", show: "Market Open Prep", host: "David Chen" },
    { time: "9:30 AM", show: "Opening Bell", host: "Maria Rodriguez" },
    { time: "12:00 PM", show: "Tech Titans", host: "Sarah Williams" },
    { time: "3:00 PM", show: "Global Economy", host: "Michael Anderson" },
    { time: "4:00 PM", show: "Market Close", host: "Maria Rodriguez", live: true },
    { time: "6:00 PM", show: "Evening Brief", host: "James Thompson" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ticker Bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="overflow-hidden">
          <div className="flex animate-scroll py-2">
            {marketData.concat(marketData).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 px-8 border-r border-gray-800">
                <span className="text-sm font-semibold text-gray-400">{item.index}</span>
                <span className="text-sm font-bold">{item.value}</span>
                <span className={`text-sm font-semibold ${item.up ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <h1 className="text-3xl font-bold">
                <span className="text-yellow-500">CYBEV</span>
                <span className="text-white"> TV</span>
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-gray-300 hover:text-yellow-500 text-sm font-semibold">Live</a>
                <a href="#" className="text-gray-300 hover:text-yellow-500 text-sm font-semibold">Markets</a>
                <a href="#" className="text-gray-300 hover:text-yellow-500 text-sm font-semibold">Technology</a>
                <a href="#" className="text-gray-300 hover:text-yellow-500 text-sm font-semibold">Politics</a>
                <a href="#" className="text-gray-300 hover:text-yellow-500 text-sm font-semibold">Opinion</a>
                <a href="#" className="text-gray-300 hover:text-yellow-500 text-sm font-semibold">Shows</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="bg-yellow-500 text-black px-6 py-2 rounded font-bold text-sm hover:bg-yellow-400 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Live Stream Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={liveStream.thumbnail} 
                  alt={liveStream.title}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                {/* Live Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="bg-red-600 px-3 py-1 rounded flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span className="text-white text-xs font-bold uppercase">LIVE</span>
                  </div>
                  <div className="bg-black bg-opacity-70 px-3 py-1 rounded text-white text-xs font-semibold">
                    {liveStream.viewers} watching
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-black ml-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>

                {/* Stream Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {liveStream.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>with {liveStream.host}</span>
                    <span>•</span>
                    <span>{liveStream.showTime}</span>
                  </div>
                </div>
              </div>

              {/* Stream Controls */}
              <div className="p-4 bg-gray-950 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="text-white hover:text-yellow-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 6v12l10-6z"/>
                    </svg>
                  </button>
                  <button className="text-white hover:text-yellow-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  </button>
                  <div className="text-white text-sm font-semibold">
                    <span className="text-gray-500">LIVE</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-white hover:text-yellow-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-white hover:text-yellow-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button className="text-white hover:text-yellow-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Schedule */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                TODAY'S SCHEDULE
              </h3>
              <div className="space-y-3">
                {schedule.map((item, idx) => (
                  <div key={idx} className={`p-3 rounded ${item.live ? 'bg-yellow-500 bg-opacity-10 border border-yellow-500' : 'bg-gray-800'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-yellow-500">{item.time}</span>
                      {item.live && (
                        <span className="text-xs bg-red-600 px-2 py-0.5 rounded font-bold">LIVE NOW</span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold mb-0.5">{item.show}</h4>
                    <p className="text-xs text-gray-400">{item.host}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-yellow-500 text-sm font-semibold hover:underline">
                View Full Schedule →
              </button>
            </div>

            {/* Market Summary */}
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">📈 Market Summary</h3>
              <div className="space-y-3">
                {marketData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{item.index}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold">{item.value}</div>
                      <div className={`text-xs font-semibold ${item.up ? 'text-green-300' : 'text-red-300'}`}>
                        {item.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Shows */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-yellow-500">★</span> Featured Shows
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredShows.map(show => (
              <div key={show.id} className="bg-gray-900 rounded-lg overflow-hidden group cursor-pointer hover:transform hover:scale-105 transition-all">
                <div className="relative">
                  <img 
                    src={show.thumbnail} 
                    alt={show.title}
                    className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                    {show.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 px-2 py-1 rounded text-xs font-semibold">
                    {show.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-yellow-500 transition-colors">
                    {show.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{show.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{show.host}</span>
                    <span>{show.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Library */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">📹 Video Library</h2>
            <div className="flex gap-2">
              {['All', 'Interviews', 'Analysis', 'Markets', 'Technology'].map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                    activeTab === tab.toLowerCase() 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {videoLibrary.map(video => (
              <div key={video.id} className="bg-gray-900 rounded-lg overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs font-semibold">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
                      {video.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.views} views</span>
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Watch</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-500">Live TV</a></li>
                <li><a href="#" className="hover:text-yellow-500">Video Library</a></li>
                <li><a href="#" className="hover:text-yellow-500">Podcasts</a></li>
                <li><a href="#" className="hover:text-yellow-500">Schedule</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Markets</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-500">Stocks</a></li>
                <li><a href="#" className="hover:text-yellow-500">Crypto</a></li>
                <li><a href="#" className="hover:text-yellow-500">Commodities</a></li>
                <li><a href="#" className="hover:text-yellow-500">Currencies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-yellow-500">About</a></li>
                <li><a href="#" className="hover:text-yellow-500">Careers</a></li>
                <li><a href="#" className="hover:text-yellow-500">Press</a></li>
                <li><a href="#" className="hover:text-yellow-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Subscribe</h4>
              <p className="text-gray-400 text-sm mb-4">Get premium content and live market data</p>
              <button className="w-full bg-yellow-500 text-black py-2 rounded font-bold text-sm hover:bg-yellow-400 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 CYBEV TV. All rights reserved. | <a href="#" className="hover:text-yellow-500">Terms</a> | <a href="#" className="hover:text-yellow-500">Privacy</a></p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BloombergTVTemplate;