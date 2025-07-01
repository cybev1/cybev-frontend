export default function LiveNowStrip() {
  const liveUsers = ['Jane', 'Prince', 'Elijah'];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mt-4">
      {liveUsers.map((name, idx) => (
        <div key={idx} className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200">
          <div className="w-20 h-20 bg-red-600 text-white rounded-md flex items-center justify-center text-xl font-bold">🔴</div>
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}