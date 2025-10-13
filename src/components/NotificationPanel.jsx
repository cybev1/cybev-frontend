export default function NotificationPanel() {
  const notifications = [
    { id: 1, type: 'like', text: 'Jane liked your post.', time: '2h ago' },
    { id: 2, type: 'follow', text: 'Chris started following you.', time: '3h ago' },
    { id: 3, type: 'comment', text: 'Prince commented on your post.', time: '4h ago' },
  ];

  return (
    <div className="space-y-4">
      {notifications.map((note) => (
        <div key={note.id} className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow flex justify-between items-center">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            <p>{note.text}</p>
            <span className="text-xs text-gray-500">{note.time}</span>
          </div>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-lg capitalize">
            {note.type}
          </span>
        </div>
      ))}
    </div>
  );
}