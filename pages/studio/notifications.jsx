import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock fetch
    setNotifications([
      { type: 'reaction', user: 'superblogger', text: 'liked your post', time: '2h ago' },
      { type: 'comment', user: 'kingcode', text: 'commented on your blog', time: '5h ago' },
      { type: 'follow', user: 'newfan', text: 'started following you', time: '1d ago' }
    ]);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 min-h-screen text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">🔔 Notifications</h1>
      <ul className="space-y-4">
        {notifications.map((n, i) => (
          <li key={i} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
            <p className="text-sm"><strong>@{n.user}</strong> {n.text}</p>
            <p className="text-xs text-gray-500 mt-1">{n.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}