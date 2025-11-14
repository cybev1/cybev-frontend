// Sports News Template
// Dynamic sports blog with live scores, match highlights, and team coverage

import React from 'react';

const SportsNewsTemplate = () => {
  const liveMatch = {
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    homeScore: 98,
    awayScore: 95,
    quarter: "Q4 - 2:45",
    status: "LIVE"
  };

  const headlines = [
    {
      id: 1,
      title: "Championship Final: Historic Comeback Secures Victory",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200",
      category: "Basketball",
      time: "10 min ago",
      featured: true
    },
    {
      id: 2,
      title: "Star Athlete Signs Record-Breaking Contract Extension",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
      category: "NFL",
      time: "1 hour ago"
    },
    {
      id: 3,
      title: "Olympic Gold Medalist Announces Comeback Season",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
      category: "Athletics",
      time: "2 hours ago"
    }
  ];

  const liveScores = [
    { home: "Man City", away: "Liverpool", homeScore: 2, awayScore: 1, time: "78'", sport: "⚽" },
    { home: "Heat", away: "Celtics", homeScore: 89, awayScore: 92, time: "Q3", sport: "🏀" },
    { home: "Yankees", away: "Red Sox", homeScore: 4, awayScore: 3, time: "7th", sport: "⚾" }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Live Score Ticker */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block px-8">🔴 LIVE: Lakers 98-95 Warriors Q4</span>
          <span className="inline-block px-8">⚽ GOAL: Man City 2-1 Liverpool 78'</span>
          <span className="inline-block px-8">🏀 Heat 89-92 Celtics Q3</span>
          <span className="inline-block px-8">⚾ Yankees 4-3 Red Sox 7th</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black">
              <span className="text-white">CYBEV</span>
              <span className="text-red-600"> SPORTS</span>
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-white hover:text-red-600 font-bold">⚽ Soccer</a>
              <a href="#" className="text-white hover:text-red-600 font-bold">🏀 Basketball</a>
              <a href="#" className="text-white hover:text-red-600 font-bold">🏈 Football</a>
              <a href="#" className="text-white hover:text-red-600 font-bold">⚾ Baseball</a>
              <a href="#" className="text-white hover:text-red-600 font-bold">🎾 Tennis</a>
            </nav>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">
              📺 Watch Live
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Featured Story */}
            <article className="relative mb-8 rounded-2xl overflow-hidden group cursor-pointer">
              <img 
                src={headlines[0].image} 
                alt={headlines[0].title}
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                    {headlines[0].category}
                  </span>
                  <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                    {headlines[0].title}
                  </h2>
                  <div className="flex items-center gap-4 text-white/80">
                    <span>{headlines[0].time}</span>
                    <span>•</span>
                    <span>⚡ BREAKING</span>
                  </div>
                </div>
              </div>
            </article>

            {/* More Headlines */}
            <div className="space-y-4">
              {headlines.slice(1).map(article => (
                <article key={article.id} className="flex gap-4 bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-48 h-32 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <span className="text-red-600 text-sm font-bold">{article.category}</span>
                    <h3 className="text-white text-xl font-bold mt-2 mb-2">{article.title}</h3>
                    <span className="text-gray-400 text-sm">{article.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Scores */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                Live Scores
              </h3>
              <div className="space-y-4">
                {liveScores.map((match, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-lg p-4">
                    <div className="text-2xl mb-2">{match.sport}</div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-semibold">{match.home}</span>
                      <span className="text-white text-xl font-bold">{match.homeScore}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-semibold">{match.away}</span>
                      <span className="text-white text-xl font-bold">{match.awayScore}</span>
                    </div>
                    <div className="text-red-600 text-sm font-bold">{match.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">🏆 Daily Sports Digest</h3>
              <p className="text-sm opacity-90 mb-4">Top highlights delivered every morning</p>
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full px-4 py-2 rounded-lg mb-3"
              />
              <button className="w-full bg-black py-2 rounded-lg font-bold hover:bg-gray-900">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-500">
          <p>© 2025 CYBEV Sports. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SportsNewsTemplate;