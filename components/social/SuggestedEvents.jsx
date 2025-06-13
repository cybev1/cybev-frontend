import React from 'react';

/** Suggested events with RSVP */
export default function SuggestedEvents({ events }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
      <h3 className="font-semibold mb-2">Suggested Events</h3>
      <ul className="space-y-2">
        {events.map(e => (
          <li key={e.id} className="flex justify-between">
            <span>{e.title}</span>
            <button className="bg-green-600 text-white px-2 py-1 rounded">RSVP</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
