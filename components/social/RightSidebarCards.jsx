
import React from 'react';

export default function RightSidebarCards() {
  return (
    <aside className="space-y-4 mt-8 text-sm text-gray-700 dark:text-gray-200">
      {/* News Flash Card */}
      <div className="p-4 bg-yellow-100 dark:bg-yellow-800 rounded shadow">
        <h4 className="font-bold mb-1">🗞️ Top News</h4>
        <p>CYBEV reaches 1M users worldwide. 🚀</p>
      </div>

      {/* Suggested Events */}
      <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded shadow">
        <h4 className="font-bold mb-1">📅 Events</h4>
        <div className="space-y-2">
          <div>
            <p>Web3 Hackathon – Jun 30</p>
            <button className="text-xs text-white bg-blue-600 rounded px-2 py-1 mt-1">RSVP</button>
          </div>
          <div>
            <p>Creator Meetup – Jul 5</p>
            <button className="text-xs text-white bg-blue-600 rounded px-2 py-1 mt-1">RSVP</button>
          </div>
        </div>
      </div>

      {/* Marketplace */}
      <div className="p-4 bg-green-100 dark:bg-green-800 rounded shadow">
        <h4 className="font-bold mb-1">🛒 Marketplace</h4>
        <p>“Crypto Mastery” eBook – 2.5 CYBV</p>
        <button className="text-xs text-white bg-green-600 rounded px-2 py-1 mt-1">Buy Now</button>
      </div>

      {/* Jobs */}
      <div className="p-4 bg-indigo-100 dark:bg-indigo-800 rounded shadow">
        <h4 className="font-bold mb-1">💼 Jobs</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>React Developer (Remote)</li>
          <li>Marketing Intern – CYBEV</li>
        </ul>
      </div>

      {/* Extras */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
        <h4 className="font-bold mb-1">🎯 Explore</h4>
        <ul className="space-y-1">
          <li><a href="#" className="underline">🎮 Games</a></li>
          <li><a href="#" className="underline">📅 Memories</a></li>
          <li><a href="#" className="underline">📝 Surveys</a></li>
        </ul>
      </div>
    </aside>
  );
}
