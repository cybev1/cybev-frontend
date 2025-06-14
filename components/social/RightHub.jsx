import React from 'react';

export default function RightHub({ notifications, earnings }) {
  return (
    <aside className="hidden xl:block bg-white dark:bg-gray-800 p-4 w-72">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <ul className="mb-4">
        {notifications.map(n => <li key={n.id} className="text-sm">{n.message}</li>)}
      </ul>
      <div className="text-sm font-semibold">Earnings: {earnings.amount}</div>
    </aside>
  );
}
