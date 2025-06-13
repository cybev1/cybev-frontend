// pages/studio/events.jsx
import { useState, useEffect } from 'react';
import EventCard from '../../components/social/EventCard';

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.map(e => (<EventCard key={e.id} event={e} />))}
      </div>
    </div>
  );
}
