
import React from 'react';

export default function UserBadge({ role }) {
  const roleColors = {
    'super-admin': 'bg-purple-700',
    admin: 'bg-blue-600',
    moderator: 'bg-green-600',
    user: 'bg-gray-500',
  };

  return (
    <span className={`text-xs text-white px-2 py-1 rounded ${roleColors[role] || 'bg-gray-500'}`}>
      {role}
    </span>
  );
}
