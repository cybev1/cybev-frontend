// Featured Template 3: News Magazine
// Professional editorial design for news and publications

import React from 'react';

const NewsMagazine = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Breaking News Bar */}
      <div className="bg-red-600 text-white py-2 text-center text-sm font-bold">
        🔴 BREAKING: Major development in ongoing global summit - Full coverage below
      </div>
      
      {/* Header */}
      <header className="border-b-4 border-black">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <h1 className="text-7xl font-black font-serif mb-2">THE CHRONICLE</h1>
            <p className="text-sm text-gray-600">Independent Journalism Since 2025</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-8 text-sm font-bold">
            <a href="#" className="hover:underline">HOME</a>
            <a href="#" className="hover:underline">WORLD</a>
            <a href="#" className="hover:underline">POLITICS</a>
            <a href="#" className="hover:underline">BUSINESS</a>
            <a href="#" className="hover:underline">TECH</a>
            <a href="#" className="hover:underline">CULTURE</a>
            <a href="#" className="hover:underline">SPORTS</a>
            <a href="#" className="hover:underline">OPINION</a>
          </nav>
        </div>
      </header>

      {/* Date and Weather */}
      <div className="border-b border-gray-300 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="text-gray-600">Friday, November 14, 2025</div>
          <div className="text-gray-600">New York, NY - 72°F ☀️</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Featured Story */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          <article className="lg:col-span-2">
            <div className="mb-6">
              <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold">BREAKING NEWS</span>
            </div>
            <div className="h-96 bg-gray-300 mb-6 flex items-center justify-center text-gray-500">
              [Featured Image]
            </div>
            <h2 className="text-5xl font-black font-serif mb-4 leading-tight">
              Historic Agreement Reached at Global Economic Summit
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <span>By Sarah Johnson</span>
              <span>•</span>
              <span>2 hours ago</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              World leaders announced a groundbreaking agreement today that promises to reshape 
              international economic cooperation for decades to come. The historic deal, reached 
              after three days of intensive negotiations, addresses critical issues including 
              climate finance, digital taxation, and global trade reform.
            </p>
            <button className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition">
              READ FULL STORY →
            </button>
          </article>

          {/* Sidebar - Top Stories */}
          <aside>
            <h3 className="text-2xl font-black font-serif mb-6 border-b-2 border-black pb-2">
              TOP STORIES
            </h3>
            <div className="space-y-6">
              {[
                {
                  category: 'POLITICS',
                  title: 'Congress Debates New Infrastructure Bill',
                  time: '3 hours ago'
                },
                {
                  category: 'TECH',
                  title: 'AI Startup Raises Record $500M in Funding',
                  time: '5 hours ago'
                },
                {
                  category: 'BUSINESS',
                  title: 'Stock Markets Hit New Highs Amid Optimism',
                  time: '6 hours ago'
                },
                {
                  category: 'WORLD',
                  title: 'UN Announces Major Climate Initiative',
                  time: '8 hours ago'
                }
              ].map((story, i) => (
                <article key={i} className="border-b border-gray-200 pb-4">
                  <span className="text-xs font-bold text-gray-600 mb-2 block">{story.category}</span>
                  <h4 className="font-bold text-lg mb-2 hover:underline cursor-pointer">
                    {story.title}
                  </h4>
                  <p className="text-sm text-gray-500">{story.time}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>

        {/* Latest News Grid */}
        <section className="mb-16">
          <h3 className="text-3xl font-black font-serif mb-8 border-b-2 border-black pb-2">
            LATEST NEWS
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                category: 'WORLD',
                image: '🌍',
                title: 'European Leaders Meet to Discuss Energy Crisis',
                excerpt: 'Summit addresses rising costs and supply concerns',
                author: 'Michael Chen',
                time: '4 hours ago'
              },
              {
                category: 'TECH',
                image: '💻',
                title: 'New Cybersecurity Threats Emerge for Businesses',
                excerpt: 'Experts warn of sophisticated attacks targeting enterprises',
                author: 'Emily Rodriguez',
                time: '5 hours ago'
              },
              {
                category: 'BUSINESS',
                image: '📊',
                title: 'Retail Sales Surge During Holiday Season',
                excerpt: 'Consumer spending exceeds analyst expectations',
                author: 'David Park',
                time: '6 hours ago'
              },
              {
                category: 'POLITICS',
                image: '🏛️',
                title: 'Supreme Court to Hear Landmark Case',
                excerpt: 'Decision could have far-reaching implications',
                author: 'Jennifer Liu',
                time: '7 hours ago'
              },
              {
                category: 'CULTURE',
                image: '🎭',
                title: 'Major Art Exhibition Opens Downtown',
                excerpt: 'Featuring works from renowned international artists',
                author: 'Alex Thompson',
                time: '8 hours ago'
              },
              {
                category: 'SPORTS',
                image: '⚽',
                title: 'Championship Game Sets Viewership Records',
                excerpt: 'Millions tune in for historic matchup',
                author: 'Chris Martinez',
                time: '9 hours ago'
              }
            ].map((article, i) => (
              <article key={i} className="border border-gray-300 hover:shadow-lg transition">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-6xl">
                  {article.image}
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-gray-600 mb-2 block">{article.category}</span>
                  <h4 className="font-bold text-xl mb-3 font-serif leading-tight hover:underline cursor-pointer">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.time}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Opinion Section */}
        <section className="mb-16 bg-gray-100 p-8">
          <h3 className="text-3xl font-black font-serif mb-8">OPINION</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'The Future of Democracy in the Digital Age',
                author: 'Dr. Patricia Williams',
                role: 'Political Analyst',
                excerpt: 'As technology reshapes our society, we must consider how to preserve democratic values...'
              },
              {
                title: 'Why Climate Action Cannot Wait',
                author: 'Prof. James Anderson',
                role: 'Environmental Scientist',
                excerpt: 'The data is clear: we are running out of time to address the climate crisis...'
              }
            ].map((op, i) => (
              <article key={i} className="bg-white p-6 border-l-4 border-black">
                <h4 className="font-bold text-2xl mb-3 font-serif hover:underline cursor-pointer">
                  {op.title}
                </h4>
                <div className="mb-4">
                  <div className="font-bold">{op.author}</div>
                  <div className="text-sm text-gray-600">{op.role}</div>
                </div>
                <p className="text-gray-700">{op.excerpt}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-black text-white p-12 text-center mb-16">
          <h3 className="text-3xl font-black mb-4">STAY INFORMED</h3>
          <p className="text-xl mb-8">Get the day's top stories delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 text-black"
            />
            <button className="bg-white text-black px-8 py-3 font-bold hover:bg-gray-200 transition">
              SUBSCRIBE
            </button>
          </div>
          <p className="text-sm mt-4 text-gray-400">Free. Unsubscribe anytime.</p>
        </section>

        {/* More Sections */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Business Section */}
          <section>
            <h3 className="text-2xl font-black font-serif mb-6 border-b-2 border-black pb-2">
              BUSINESS
            </h3>
            <div className="space-y-6">
              {[
                'Tech Giant Announces Major Acquisition',
                'Markets React to Fed Interest Rate Decision',
                'Startup Disrupts Traditional Banking Model',
                'Oil Prices Fluctuate Amid Global Tensions'
              ].map((title, i) => (
                <article key={i} className="border-b border-gray-200 pb-4">
                  <h4 className="font-bold text-lg mb-2 hover:underline cursor-pointer">
                    {title}
                  </h4>
                  <p className="text-sm text-gray-500">Business Desk • {i + 1} hours ago</p>
                </article>
              ))}
            </div>
          </section>

          {/* Culture Section */}
          <section>
            <h3 className="text-2xl font-black font-serif mb-6 border-b-2 border-black pb-2">
              CULTURE
            </h3>
            <div className="space-y-6">
              {[
                'New Film Festival Celebrates Independent Cinema',
                'Bestselling Author Releases Highly Anticipated Novel',
                'Museum Exhibition Explores Modern Architecture',
                'Music Awards Honor Industry\'s Top Talent'
              ].map((title, i) => (
                <article key={i} className="border-b border-gray-200 pb-4">
                  <h4 className="font-bold text-lg mb-2 hover:underline cursor-pointer">
                    {title}
                  </h4>
                  <p className="text-sm text-gray-500">Culture Desk • {i + 2} hours ago</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-black font-serif mb-4">THE CHRONICLE</h3>
              <p className="text-gray-600 mb-4">
                Independent journalism you can trust since 2025
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-black transition">Twitter</a>
                <a href="#" className="text-gray-600 hover:text-black transition">Facebook</a>
                <a href="#" className="text-gray-600 hover:text-black transition">Instagram</a>
                <a href="#" className="text-gray-600 hover:text-black transition">LinkedIn</a>
              </div>
            </div>
            
            {[
              {
                title: 'Sections',
                links: ['World', 'Politics', 'Business', 'Tech', 'Culture', 'Sports']
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Contact', 'Press']
              },
              {
                title: 'Legal',
                links: ['Terms', 'Privacy', 'Cookies', 'Ethics']
              }
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-600 hover:text-black transition text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-300 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 The Chronicle. All rights reserved. Built with CYBEV.io</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsMagazine;