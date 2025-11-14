// Featured Template 2: Ministry/Church
// Warm, welcoming, community-focused design

import React from 'react';

const MinistryChurch = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">✝️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Grace Community Church</h1>
                <p className="text-sm text-gray-600">Where Faith Meets Family</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-semibold">
              <a href="#" className="text-gray-700 hover:text-amber-600 transition">Home</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition">About</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition">Sermons</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition">Events</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition">Ministries</a>
              <a href="#" className="text-gray-700 hover:text-amber-600 transition">Give</a>
            </nav>
            <button className="hidden md:block bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition">
              Join Us
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl font-bold mb-4">Welcome Home</h2>
          <p className="text-2xl mb-2">You are loved. You are welcome. You belong here.</p>
          <p className="text-xl mb-8 opacity-90">Join us for Sunday Service at 10:00 AM</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-amber-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-50 transition">
              Plan Your Visit
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition">
              Watch Online
            </button>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl">📅</div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Sunday Service</div>
                <div className="text-gray-600">10:00 AM - 11:30 AM</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl">📍</div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Location</div>
                <div className="text-gray-600">123 Faith Street, City, ST</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl">📞</div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Contact</div>
                <div className="text-gray-600">(555) 123-4567</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">A Message from Our Pastor</h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-32 h-32 rounded-full bg-amber-200 mx-auto mb-6 flex items-center justify-center text-5xl">
              👨‍💼
            </div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              "Welcome to Grace Community Church! Whether you're exploring faith for the first time 
              or looking for a church home, we're so glad you're here. Our church is a place where 
              everyone belongs, where faith is real, and where community matters. Come as you are, 
              and discover God's amazing love for you."
            </p>
            <div className="font-bold text-gray-900">Pastor John Smith</div>
            <div className="text-gray-600">Senior Pastor</div>
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Ministries</h2>
            <p className="text-xl text-gray-600">Something for everyone in the family</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📖',
                title: 'Bible Study',
                description: 'Deep dive into Scripture together every Wednesday at 7:00 PM',
                age: 'All Ages'
              },
              {
                icon: '👨‍👩‍👧‍👦',
                title: 'Family Ministry',
                description: 'Programs and activities designed to strengthen families',
                age: 'Families'
              },
              {
                icon: '🎸',
                title: 'Youth Group',
                description: 'Fun, faith, and fellowship for teens on Friday nights',
                age: 'Ages 13-18'
              },
              {
                icon: '👶',
                title: 'Children\'s Ministry',
                description: 'Age-appropriate lessons and activities during service',
                age: 'Ages 0-12'
              },
              {
                icon: '🎵',
                title: 'Worship Team',
                description: 'Join us in leading worship through music and arts',
                age: 'All Ages'
              },
              {
                icon: '🤝',
                title: 'Community Outreach',
                description: 'Serve our community through various service projects',
                age: 'All Ages'
              }
            ].map((ministry, i) => (
              <div key={i} className="bg-amber-50 p-8 rounded-xl hover:shadow-lg transition">
                <div className="text-5xl mb-4">{ministry.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{ministry.title}</h3>
                <p className="text-gray-600 mb-4">{ministry.description}</p>
                <div className="inline-block bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {ministry.age}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Mark your calendars</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                date: 'Sun, Dec 24',
                time: '6:00 PM',
                title: 'Christmas Eve Service',
                description: 'Celebrate the birth of our Savior with candlelight and carols'
              },
              {
                date: 'Sat, Jan 13',
                time: '9:00 AM',
                title: 'Men\'s Breakfast',
                description: 'Food, fellowship, and encouragement for men of all ages'
              },
              {
                date: 'Sun, Jan 21',
                time: '12:30 PM',
                title: 'New Members Class',
                description: 'Learn about our church and what it means to be a member'
              },
              {
                date: 'Fri, Jan 26',
                time: '7:00 PM',
                title: 'Movie Night',
                description: 'Family-friendly film with popcorn and fellowship'
              },
              {
                date: 'Sat, Feb 3',
                time: '10:00 AM',
                title: 'Community Service Day',
                description: 'Join us in serving our local community'
              },
              {
                date: 'Sun, Feb 11',
                time: '6:00 PM',
                title: 'Valentine\'s Banquet',
                description: 'A special evening for couples and married partners'
              }
            ].map((event, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-amber-600 text-white px-4 py-2 rounded-lg text-center min-w-[80px]">
                    <div className="font-bold text-lg">{event.date.split(',')[1].trim()}</div>
                    <div className="text-sm">{event.date.split(',')[0]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">{event.time}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prayer Request */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="text-5xl mb-6">🙏</div>
          <h2 className="text-4xl font-bold mb-4">Need Prayer?</h2>
          <p className="text-xl mb-8">
            We believe in the power of prayer. Share your request and our prayer team will lift you up.
          </p>
          <button className="bg-white text-amber-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-50 transition">
            Submit Prayer Request
          </button>
          <p className="mt-6 text-sm opacity-90">24/7 Prayer Line: (555) 123-PRAY</p>
        </div>
      </section>

      {/* Giving */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Give</h2>
          <p className="text-xl text-gray-600 mb-8">
            Your generosity helps us spread God's love and serve our community
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-amber-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="font-bold text-lg mb-2">Online</h3>
              <p className="text-sm text-gray-600 mb-4">Give securely online anytime</p>
              <button className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition">
                Give Now
              </button>
            </div>
            <div className="bg-amber-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-2">Text to Give</h3>
              <p className="text-sm text-gray-600 mb-4">Text GIVE to (555) 123-4567</p>
              <button className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition">
                Learn More
              </button>
            </div>
            <div className="bg-amber-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="font-bold text-lg mb-2">Mail</h3>
              <p className="text-sm text-gray-600 mb-4">Send check to church address</p>
              <button className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition">
                Get Address
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">✝️</div>
                <div>
                  <h3 className="text-xl font-bold">Grace Community Church</h3>
                  <p className="text-sm text-gray-400">Where Faith Meets Family</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                123 Faith Street<br />
                City, State 12345<br />
                (555) 123-4567
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white transition">YouTube</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Beliefs</a></li>
                <li><a href="#" className="hover:text-white transition">Staff</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Sermons</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Calendar</a></li>
                <li><a href="#" className="hover:text-white transition">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Grace Community Church. Built with CYBEV.io</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinistryChurch;