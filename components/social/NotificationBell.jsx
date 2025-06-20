import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NotificationBell({ count = 0 }) {
  return (
    <Link href="/studio/notifications" className="relative">
      <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}