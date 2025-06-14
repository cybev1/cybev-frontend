import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { BellIcon } from 'lucide-react';

const fetcher = url => axios.get(url).then(res => res.data);

export default function NotificationBell() {
  const { data, error } = useSWR('/api/notifications/unread-count', fetcher);

  if (error) return null;
  if (!data) return null;

  return (
    <div className="relative p-2">
      <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      {data.count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {data.count}
        </span>
      )}
    </div>
  );
}
