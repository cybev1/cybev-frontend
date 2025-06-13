// components/social/EventCard.jsx
import React from 'react';

export default function EventCard({ event }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold mb-1">{event.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
      <p className="mt-2 text-sm">{event.description}</p>
      <button className="mt-4 px-3 py-1 bg-green-600 text-white rounded">RSVP</button>
    </div>
  );
}
