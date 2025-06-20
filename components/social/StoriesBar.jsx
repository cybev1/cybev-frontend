import { PlusIcon } from '@heroicons/react/24/solid';

export default function StoriesBar({ stories = [] }) {
  const currentUser = typeof window !== 'undefined' ? localStorage.getItem('cybev_username') : null;

  return (
    <div className="overflow-x-auto flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
          <PlusIcon className="w-6 h-6" />
        </button>
        <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">Add</span>
      </div>

      {stories.map((story, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <img
            src={story.avatar}
            alt={story.username}
            className="w-14 h-14 rounded-full border-2 border-blue-600"
          />
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">{story.username}</span>
        </div>
      ))}
    </div>
  );
}