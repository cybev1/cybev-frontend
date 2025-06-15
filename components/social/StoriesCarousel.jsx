export default function StoriesCarousel() {
  const stories = ['+', 'Alice', 'Bob', 'Carol'];
  return (
    <div className="flex space-x-4 overflow-x-auto p-4">
      {stories.map((s, i) => (
        <div key={i} className="w-20 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
          {s}
        </div>
      ))}
    </div>
  );
}
